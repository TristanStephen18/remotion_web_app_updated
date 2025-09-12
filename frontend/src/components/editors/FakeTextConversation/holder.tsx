import React, { useState, useRef, useEffect } from "react";
import { DisplayerModal } from "../Global/modal";
import { ExportSecTrial } from "../Global/sidenav_sections/export";
import { OptionSectionTrial } from "../Global/sidenav_sections/options";
import { FakeTextVideoSideNavigation } from "./sidenav";
import { ChatVideoPreview } from "../../layout/EditorPreviews/FakeTextConversationPreview";
import { defaultchats } from "./defaultdata";
import { VoiceSelector } from "./sidenav_sections/voice";
import { MessagesPanel } from "./sidenav_sections/chats";
import { AvatarSelector } from "./sidenav_sections/avatars";
import { ChatStylePanel } from "./sidenav_sections/themesnfonts";
import { BackgroundVideoSelectorPanel } from "../Global/sidenav_sections/bgvideoselector";
import { MusicSelector } from "../Global/bgmusic";
import { defaultpanelwidth } from "../../../data/defaultvalues";
type ChatLine = { speaker: "person_1" | "person_2"; text: string };

export const FakeTextConversationEditor: React.FC = () => {
  const [chatdata, setChatData] = useState(defaultchats);
  const [voice1, setVoice1] = useState("21m00Tcm4TlvDq8ikWAM");
  const [voice2, setVoice2] = useState("2EiwWnXFnvU5JabPnv8n");
  const [chats, setChats] = useState<ChatLine[]>([
    { speaker: "person_1", text: "Hey, have you tried The Green Fork yet?" },
    { speaker: "person_2", text: "Not yet. Is it any good?" },
  ]);
  const [previewSize, setPreviewSize] = useState(1);
  const [duration, setDuration] = useState(10);

  const [chatTheme, setChatTheme] = useState<
    "default" | "discord" | "messenger" | "whatsapp"
  >("discord");

  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [fontSize, setFontSize] = useState(28);
  const [fontColor, setFontColor] = useState("");

  const [bgVideo, setBgVideo] = useState("/defaultvideos/minecraft/m1.mp4");
  const [chatAudio, setChatAudio] = useState("/fakeconvo/fakeconvo.mp3");
  const [musicAudio, setMusicAudio] = useState(
    "/soundeffects/bgmusic/bg10.mp3"
  );
  const [avatars, setAvatars] = useState({
    left: "/images/vectors/v1.jpg",
    right: "/images/vectors/v8.jpg",
  });
  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState(false);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    | "messages"
    | "voice"
    | "avatar"
    | "display"
    | "background"
    | "music"
    | "options"
    | "export"
  >("messages");
  const [collapsed, setCollapsed] = useState(false);

  //default variables
  const defaultvalues = {
    chatPath: "chats.json",
    chatAudio: "fakeconvo.mp3",
    musicBase: 0.12,
    musicWhileTalking: 0.06,
    duckAttackMs: 120,
    duckReleaseMs: 240,
    timeShiftSec: 0,
  };

  //   const [isUploading, setIsUploading] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [autoSave, setAutoSave] = useState(false);

  // 🔹 Resizable panel state
  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth); // default width
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Drag handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth =
        e.clientX - (panelRef.current?.getBoundingClientRect().left || 0);
      if (newWidth > 200 && newWidth < 600) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const cycleBg = () => {
    if (previewBg === "dark") setPreviewBg("light");
    else if (previewBg === "light") setPreviewBg("grey");
    else setPreviewBg("dark");
  };

  const createJsonFileandAudio = async () => {
    setIsUpdatingTemplate(true);
    try {
      const payload = {
        voices: [voice1, voice2],
        chats,
      };

      const res = await fetch("/sound/test-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setChatData(data);
      console.log(data);
      setChatAudio(data.serverfilename);
      console.log(Math.ceil(data.duration));
      setDuration(Math.ceil(data.duration));
    } catch (err) {
      console.error("Failed to update template ❗", err);
      alert("Template update failed, please try again.");
    } finally {
      setIsUpdatingTemplate(false);
    }
  };

  const handleExport = async (format: string) => {
    const prefix = "http://localhost:3000";

    const newavatars = {
      left: prefix + avatars.left,
      right: prefix + avatars.right,
    };
    setIsExporting(format);
    console.log(fontSize);
    try {
      const response = await fetch("/generatevideo/faketextconvo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatPath: defaultvalues.chatPath,
          bgVideo,
          chatAudio: defaultvalues.chatAudio,
          musicAudio,
          musicBase: defaultvalues.musicBase,
          musicWhileTalking: defaultvalues.musicWhileTalking,
          duckAttackMs: defaultvalues.duckAttackMs,
          duckReleaseMs: defaultvalues.duckReleaseMs,
          timeShiftSec: defaultvalues.timeShiftSec,
          fontFamily,
          fontSize,
          fontColor,
          chatTheme,
          avatars: newavatars,
          format,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }
      const data = await response.json();
      setExportUrl(data.url);
      setShowModal(true);
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Export failed: ${error || "Please try again."}`);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fafafa" }}>
      {/* modal */}
      {showModal && exportUrl && (
        <DisplayerModal exportUrl={exportUrl} setShowModal={setShowModal} />
      )}

      {/* sidenav */}
      <FakeTextVideoSideNavigation
        activeSection={activeSection}
        collapsed={collapsed}
        setActiveSection={setActiveSection}
        setCollapsed={setCollapsed}
      />

      {/* Controls Panel */}
      {!collapsed && (
        <div
          ref={panelRef}
          style={{
            width: `${panelWidth}px`,
            padding: "2rem",
            overflowY: "auto",
            background: "#fff",
            borderRight: "1px solid #eee",
            position: "relative",
            transition: isResizing ? "none" : "width 0.2s",
          }}
        >
          <div
            onMouseDown={() => setIsResizing(true)}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "6px",
              cursor: "col-resize",
              background: "#ddd", // 👈 always visible
            }}
          />

          <h2
            style={{
              marginBottom: "1.5rem",
              fontSize: "1.5rem",
              fontWeight: 600,
              background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🎬 Fake Text Conversation Template
          </h2>

          {activeSection === "messages" && (
            <MessagesPanel chats={chats} setChats={setChats} />
          )}
          {activeSection === "voice" && (
            <VoiceSelector
              setVoice1={setVoice1}
              setVoice2={setVoice2}
              voice1={voice1}
              voice2={voice2}
              onUpdateTemplate={createJsonFileandAudio}
              isUpdatingTemplate={isUpdatingTemplate} // ✅ new prop
            />
          )}

          {activeSection === "avatar" && (
            <AvatarSelector avatars={avatars} setAvatars={setAvatars} />
          )}

          {activeSection === "display" && (
            <ChatStylePanel
              chatTheme={chatTheme}
              fontColor={fontColor}
              fontFamily={fontFamily}
              fontSize={fontSize}
              setChatTheme={setChatTheme}
              setFontColor={setFontColor}
              setFontFamily={setFontFamily}
              setFontSize={setFontSize}
            />
          )}

          {activeSection === "background" && (
            <BackgroundVideoSelectorPanel
              bgVideo={bgVideo}
              setBgVideo={setBgVideo}
            />
          )}

          {activeSection === "music" && (
            <MusicSelector
              musicAudio={musicAudio}
              setMusicAudio={setMusicAudio}
            />
          )}

          {activeSection === "options" && (
            <OptionSectionTrial
              setShowSafeMargins={setShowSafeMargins}
              showSafeMargins={showSafeMargins}
              setAutoSave={setAutoSave}
              autoSave={autoSave}
              previewSize={previewSize}
              setPreviewSize={setPreviewSize}
            />
          )}
          {activeSection === "export" && (
            <ExportSecTrial
              handleExport={handleExport}
              isExporting={isExporting}
            />
          )}
        </div>
      )}

      <ChatVideoPreview
        chatdata={chatdata}
        cycleBg={cycleBg}
        duration={duration}
        previewBg={previewBg}
        previewScale={previewSize}
        avatars={avatars}
        bgVideo={bgVideo}
        chatAudio={chatAudio}
        chatTheme={chatTheme}
        fontColor={fontColor}
        fontFamily={fontFamily}
        fontSize={fontSize}
        musicAudio={musicAudio}
        showSafeMargins={showSafeMargins}
        onPreviewScaleChange={setPreviewSize}
        onToggleSafeMargins={setShowSafeMargins}
        //   timeShiftSec={}
      />
    </div>
  );
};
