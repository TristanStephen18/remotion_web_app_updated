import React, { useState, useRef, useEffect } from "react";
import { DisplayerModal } from "../Global/modal";
import { ExportSecTrial } from "../Global/sidenav_sections/export";
import { OptionSectionTrial } from "../Global/sidenav_sections/options";
// import { ChatVideoPreview } from "../../layout/EditorPreviews/FakeTextConversationPreview";

import { BackgroundVideoSelectorPanel } from "../Global/sidenav_sections/bgvideoselector";
import { MusicSelector } from "../Global/bgmusic";
import { script } from "./defaultvalues";
import { RedditVideoPreview } from "../../layout/EditorPreviews/RedditTemplatePreview";
import { RedditSideNavigation } from "./sidenav";
// import { VoiceSelector } from "../FakeTextConversation/sidenav_sections/voice";
import { AiVoiceSelector } from "../Global/sidenav_sections/aivoices";
import { RedditTypoGraphy } from "../Global/sidenav_sections/typography";
import { RedditFetcherSidepanel } from "./sidenav_sections/post";
import { defaultpanelwidth } from "../../../data/defaultvalues";

export const RedditVideoEditor: React.FC = () => {
  const [postUrl, setPostUrl] = useState("");
  const [loadingPost, setLoadingPost] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [fetchedPost, setFetchedPost] = useState<{
    title: string;
    selftext: string;
    author?: string;
  } | null>(null);
  const defaulvalues = {
    backgroundOverlay: "rgba(0,0,0,0.6)",
    musicVolume: 0.2,
    voiceoverPath: "reddit.mp3",
  };
  const [redditData, setRedditData] = useState(script);
  const [previewSize, setPreviewSize] = useState(1);
  const [duration, setDuration] = useState(Math.ceil(script.duration) + 2);

  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [fontSize, setFontSize] = useState(42);
  const [fontColor, setFontColor] = useState("#ffffff");

  const [sentenceBgColor, setSentenceBgColor] = useState("#ff8c00");

  // const [isUpdating, setIsUpdating] = useState(false);
  const [aiVoice, setAiVoice] = useState("21m00Tcm4TlvDq8ikWAM");

  const [voiceoverPath, setVoiceoverPath] = useState(
    "/soundeffects/reddit/voice.mp3"
  );
  const [backgroundVideo, setBackgroundVideo] = useState(
    "/defaultvideos/minecraft/m1.mp4"
  );
  const [backgroundMusicPath, setBackgroundMusicPath] = useState(
    "/soundeffects/bgmusic/bg11.mp3"
  );

  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState(false);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "post" | "voice" | "text" | "background" | "music" | "options" | "export"
  >("post");
  const [collapsed, setCollapsed] = useState(false);

  //default variables

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

  async function fetchPost(postUrl: string) {
    try {
      console.log(postUrl);
      setLoadingPost(true);
      setPostError(null);
      setFetchedPost(null);

      const res = await fetch("/reddit/getpost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: postUrl }),
      });

      // const res = await fetch(cleanUrl);
      if (!res.ok) throw new Error("Failed to fetch Reddit post");
      const data = await res.json();
      const fetched = data[0]?.data?.children[0]?.data;

      const post = {
        title: fetched.title,
        selftext: fetched.selftext,
        author: fetched.author,
      };

      setFetchedPost(post);
    } catch (err) {
      console.error("Failed to fetch post", err);
      setPostError("Could not fetch Reddit post.");
    } finally {
      setLoadingPost(false);
    }
  }

  const createVoiceOverandScript = async () => {
    setIsUpdatingTemplate(true);
    if (fetchedPost) {
      console.log(fetchedPost.title, fetchedPost.selftext, aiVoice);
      // setIsUpdatingTemplate(true);
      try {
        const res = await fetch("/sound/reddit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: fetchedPost.title,
            textcontent: fetchedPost.selftext,
            voiceid: aiVoice,
          }),
        });

        const data = await res.json();
        //   setChatData(data);
        console.log(data);
        //   setChatAudio(data.serverfilename);
        //   console.log(Math.ceil(data.duration));
        setRedditData(data.script);
        setVoiceoverPath(data.serverfilename);
        setDuration(Math.ceil(data.duration) + 2);
      } catch (err) {
        console.error("Failed to update template ❗", err);
        alert("Template update failed, please try again.");
      } finally {
        setIsUpdatingTemplate(false);
      }
    } else {
      alert("You don't have a post yet");
    }
  };

  const handleExport = async (format: string) => {
    setIsExporting(format);
    console.log(fontSize);
    try {
      const response = await fetch("/generatevideo/redditvideo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voiceoverPath: defaulvalues.voiceoverPath,
          duration,
          fontSize,
          fontFamily,
          fontColor,
          sentenceBgColor,
          backgroundVideo,
          backgroundMusicPath,
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
      <RedditSideNavigation
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
            🎬 Reddit Video Template
          </h2>

          {activeSection === "post" && (
            <RedditFetcherSidepanel
              url={postUrl}
              setUrl={setPostUrl}
              loading={loadingPost}
              error={postError}
              post={fetchedPost}
              onFetch={fetchPost}
            />
          )}

          {activeSection === "voice" && (
            <AiVoiceSelector
              isUpdatingTemplate={isUpdatingTemplate}
              onUpdateTemplate={createVoiceOverandScript}
              aiVoice={aiVoice}
              setAiVoice={setAiVoice}
            />
          )}

          {activeSection === "text" && (
            <RedditTypoGraphy
              fontColor={fontColor}
              fontFamily={fontFamily}
              fontSize={fontSize}
              sentenceBgColor={sentenceBgColor}
              setFontColor={setFontColor}
              setFontFamily={setFontFamily}
              setFontSize={setFontSize}
              setSentenceBgColor={setSentenceBgColor}
            />
          )}

          {activeSection === "background" && (
            <BackgroundVideoSelectorPanel
              bgVideo={backgroundVideo}
              setBgVideo={setBackgroundVideo}
            />
          )}

          {activeSection === "music" && (
            <MusicSelector
              musicAudio={backgroundMusicPath}
              setMusicAudio={setBackgroundMusicPath}
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
      <RedditVideoPreview
        script={redditData}
        voiceoverPath={voiceoverPath}
        duration={duration}
        previewBg={previewBg}
        cycleBg={cycleBg}
        previewScale={previewSize}
        backgroundVideo={backgroundVideo}
        backgroundMusicPath={backgroundMusicPath}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontColor={fontColor}
        sentenceBgColor={sentenceBgColor}
        backgroundOverlayColor={defaulvalues.backgroundOverlay}
        showSafeMargins={showSafeMargins}
        onPreviewScaleChange={setPreviewSize}
        onToggleSafeMargins={setShowSafeMargins}
      />
    </div>
  );
};
