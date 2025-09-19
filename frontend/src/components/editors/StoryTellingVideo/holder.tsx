import React, { useState, useRef, useEffect } from "react";
import { BackgroundVideoSelectorPanel } from "../Global/sidenav_sections/bgvideoselector";
import { MusicSelector } from "../Global/bgmusic";
import { AiVoiceSelector } from "../Global/sidenav_sections/aivoices";
import { RedditTypoGraphy } from "../Global/sidenav_sections/typography";
import { StoryTellingPreview } from "../../layout/EditorPreviews/StoryTellingPreview";
import { samplestory } from "./defaultvalues";
import { StoryTellingSidePanel } from "./sidenav";
import { StorySidePanel } from "./sidenav_sections/story";
import { defaultpanelwidth } from "../../../data/defaultvalues";
import { ExportModal } from "../../layout/modals/exportmodal";
import { TopNavWithoutBatchrendering } from "../../navigations/single_editors/withoutswitchmodesbutton";
// import { script } from "../RedditTemplate/defaultvalues";

export const StoryTellingVideoEditor: React.FC = () => {
  const [templateName, setTemplateName] = useState("My Ai Story Narration");
  const [storyData, setStoryData] = useState(samplestory);

  const [isGenerating, setIsGenerating] = useState(false);
  const [story, setStory] = useState("sample");
  const [genres, setGenres] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");

  const defaulvalues = {
    backgroundOverlay: "rgba(0,0,0,0.6)",
    musicVolume: 0.2,
    voiceoverPath: "story.mp3",
  };

  const [previewSize, setPreviewSize] = useState(1);

  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [fontSize, setFontSize] = useState(42);
  const [fontColor, setFontColor] = useState("#ffffff");

  const [sentenceBgColor, setSentenceBgColor] = useState("#ff8c00");

  const [isUpdating, setIsUpdating] = useState(false);
  const [aiVoice, setAiVoice] = useState("21m00Tcm4TlvDq8ikWAM");

  const [voiceoverPath, setVoiceoverPath] = useState(
    "/soundeffects/story/voice.mp3"
  );
  const [backgroundVideo, setBackgroundVideo] = useState(
    "/defaultvideos/minecraft/m1.mp4"
  );
  const [backgroundMusicPath, setBackgroundMusicPath] = useState(
    "/soundeffects/bgmusic/bg11.mp3"
  );

  const [duration, setDuration] = useState(2);

  //   const [isUpdatingTemplate, setIsUpdatingTemplate] = useState(false);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "story" | "voice" | "text" | "background" | "music" 
  >("story");
  const [collapsed, setCollapsed] = useState(false);

  //default variables

  //   const [isUploading, setIsUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  // const [autoSave, setAutoSave] = useState(false);

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

  async function fetchAiStory() {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          genres,
        }),
      });
      const data = await res.json();
      setStory(data.story);
    } catch (error) {
      console.error(" Error Fetching ai generated story");
    } finally {
      setIsGenerating(false);
    }
  }

  const createVoiceOverandScript = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch("/sound/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: story,
          voiceid: aiVoice,
        }),
      });
      const data = await res.json();
      //   setChatData(data);
      console.log(data);
      //   setChatAudio(data.serverfilename);
      //   console.log(Math.ceil(data.duration));
      setStoryData(data.script);
      setVoiceoverPath(data.serverfilename);
      setDuration(Math.ceil(data.duration));
    } catch (err) {
      console.error("Failed to update template ❗", err);
      alert("Template update failed, please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);
    console.log(fontSize);
    try {
      const response = await fetch("/generatevideo/storytelling", {
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
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100%", flex: 1 }}>
      <TopNavWithoutBatchrendering
        templateName={templateName}
        onSave={() => {}}
        onExport={handleExport}
        setTemplateName={setTemplateName}
        onOpenExport={() => setShowModal(true)}
        template="🎬 AI Story Narration"
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

        {/* sidenav */}
        <StoryTellingSidePanel
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
              padding: "1rem",
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

            {activeSection === "story" && (
              <StorySidePanel
                fetchAiStory={fetchAiStory}
                genres={genres}
                isGenerating={isGenerating}
                prompt={prompt}
                setGenres={setGenres}
                setPrompt={setPrompt}
                setStory={setStory}
                story={story}
              />
            )}

            {activeSection === "voice" && (
              <AiVoiceSelector
                isUpdatingTemplate={isUpdating}
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

            {/* {activeSection === "options" && (
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
          )} */}
          </div>
        )}
        <StoryTellingPreview
          script={storyData}
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
    </div>
  );
};
