import React, { useState, useRef, useEffect } from "react";
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
import { ExportModal } from "../../layout/modals/exportmodal";
import { TopNavWithSave } from "../../navigations/single_editors/withsave";
import { SaveProjectModal } from "../../layout/modals/savemodal";
import { LoadingOverlay } from "../../layout/modals/loadingprojectmodal";
import { useProjectSave } from "../../../hooks/saveproject";
import { useParams } from "react-router-dom";

type ChatLine = { speaker: "person_1" | "person_2"; text: string };

export const FakeTextConversationEditor: React.FC = () => {
  const { id } = useParams();

  // 🟢 States
  const [templateName, setTemplateName] = useState(
    "My Fake Text Conversation Template"
  );
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
  const [serverAudio, setServerAudio] = useState("");
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
    "messages" | "voice" | "avatar" | "display" | "background" | "music"
  >("messages");
  const [collapsed, setCollapsed] = useState(false);

  // Default values required for export/save
  const defaultvalues = {
    chatPath: "chats.json",
    chatAudio: "fakeconvo.mp3",
    musicBase: 0.12,
    musicWhileTalking: 0.06,
    duckAttackMs: 120,
    duckReleaseMs: 240,
    timeShiftSec: 0,
  };

  // 🟢 Export modal + loading
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
       "⏳ Preparing your template...",

    "🙇 Sorry for the wait, still working on it...",
    "🚀 Almost there, thanks for your patience!",
  ];
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(
      () => setMessageIndex((p) => (p + 1) % messages.length),
      10000
    );
    return () => clearInterval(interval);
  }, [isLoading]);

  // 🟢 Resizable panel
  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth =
        e.clientX - (panelRef.current?.getBoundingClientRect().left || 0);
      if (newWidth > 200 && newWidth < 600) setPanelWidth(newWidth);
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

  // 🟢 Update JSON + Audio generation
  const createJsonFileandAudio = async () => {
    setIsUpdatingTemplate(true);
    try {
      const payload = { voices: [voice1, voice2], chats };
      const res = await fetch("/sound/test-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setChatData(data);
      setChatAudio(data.serverfilename);
      setServerAudio(data.serverfilename);
      setDuration(Math.ceil(data.duration));
    } catch (err) {
      console.error("Failed to update template ❗", err);
      alert("Template update failed, please try again.");
    } finally {
      setIsUpdatingTemplate(false);
    }
  };

  // 🟢 Export Handler
  const handleExport = async (format: string) => {
    const prefix = window.location.origin;
    const newavatars = {
      left: avatars.left.startsWith("http")
        ? avatars.left
        : prefix + avatars.left,
      right: avatars.right.startsWith("http")
        ? avatars.right
        : prefix + avatars.right,
    };
    setIsExporting(true);
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
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setExportUrl(data.url);
      setShowModal(true);
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Export failed: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  // 🟢 Project Save Hook
  const {
    projectId,
    setProjectId,
    isSaving,
    showSaveModal,
    setShowSaveModal,
    handleSave,
    saveNewProject,
    lastSavedProps,
  } = useProjectSave({
    templateId: 9, // unique ID for FakeText
    buildProps: () => {
      const prefix = window.location.origin;
      return {
        // 🔹 Full project state (DB should remember all of this)
        chats,
        voice1,
        voice2,
        chatdata,
        duration,
        serverAudio,

        // 🔹 Render-safe props
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
        avatars: {
          left: avatars.left.startsWith("http")
            ? avatars.left
            : prefix + avatars.left,
          right: avatars.right.startsWith("http")
            ? avatars.right
            : prefix + avatars.right,
        },
      };
    },
    videoEndpoint: "/generatevideo/faketextconvo",

    // 👇 NEW: strip extras before hitting video render API
    filterRenderProps: (props) => {
      const {
        chats,
        voice1,
        voice2,
        chatdata,
        duration,
        serverAudio,
        ...renderProps
      } = props;
      return renderProps;
    },
  });

  // 🟢 Load project if editing existing
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetch(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load project");
          return res.json();
        })
        .then((data) => {
          const newavatars = {
            left: data.props.avatars.left.replaceAll(
              `${window.location.origin}`,
              ""
            ),
            right: data.props.avatars.right.replaceAll(
              `${window.location.origin}`,
              ""
            ),
          };
          setProjectId(data.id);
          setBgVideo(data.props.bgVideo);
          setMusicAudio(data.props.musicAudio);
          setFontFamily(data.props.fontFamily);
          setFontSize(data.props.fontSize);
          setFontColor(data.props.fontColor);
          setChatTheme(data.props.chatTheme);
          setAvatars(newavatars);
          // ✅ Restore persisted states
          if (data.props.chats) setChats(data.props.chats);
          if (data.props.voice1) setVoice1(data.props.voice1);
          if (data.props.voice2) setVoice2(data.props.voice2);
          if (data.props.chatdata) setChatData(data.props.chatdata);
          if (data.props.duration) setDuration(data.props.duration);
          if (data.props.serverAudio) setChatAudio(data.props.serverAudio);

          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  return (
    <div style={{ display: "flex", height: "100%", flex: 1 }}>
      {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

      {/* 🔹 Top Navigation */}
      <TopNavWithSave
        templateName={templateName}
        onSave={handleSave}
        onExport={handleExport}
        setTemplateName={setTemplateName}
        onOpenExport={() => setShowModal(true)}
        template="🎬 Fake Text Conversation Template"
        isSaving={isSaving}
      />

      {/* 🔹 Save Modal */}
      <SaveProjectModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={saveNewProject}
      />

      <div style={{ display: "flex", flex: 1, marginTop: "60px" }}>
        {showModal && (
          <ExportModal
            showExport={showModal}
            setShowExport={setShowModal}
            isExporting={isExporting}
            exportUrl={exportUrl}
            onExport={handleExport}
          />
        )}

        {/* 🔹 Side Navigation */}
        <FakeTextVideoSideNavigation
          activeSection={activeSection}
          collapsed={collapsed}
          setActiveSection={setActiveSection}
          setCollapsed={setCollapsed}
        />

        {/* 🔹 Control Panel */}
        {!collapsed && (
          <div
            ref={panelRef}
            style={{
              width: `${panelWidth}px`,
              padding: "1rem",
              overflowY: "auto",
              background: "#fff",
              borderRight: "1px solid #eee",
              position: "relative",
              transition: isResizing ? "none" : "width 0.2s",
            }}
          >
            {/* Drag Handle */}
            <div
              onMouseDown={() => setIsResizing(true)}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "6px",
                cursor: "col-resize",
                background: "#ddd",
              }}
            />

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
                isUpdatingTemplate={isUpdatingTemplate}
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
          </div>
        )}

        {/* 🔹 Preview */}
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
        />
      </div>
    </div>
  );
};
