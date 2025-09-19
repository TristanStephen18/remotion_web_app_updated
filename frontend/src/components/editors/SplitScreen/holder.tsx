import React, { useState, useRef, useEffect } from "react";
import { DisplayerModal } from "../Global/modal";
// import { BackgroundSecTrial } from "../Global/sidenav_sections/bg";
// import { ExportSecTrial } from "../Global/sidenav_sections/export";
import { SplitScreenSideNavs } from "./sidenav";
// import { TextContentSection } from "./sidenav_sections/textcontent";
// import { OptionSectionTrial } from "../Global/sidenav_sections/options";
import { BottomVideoSelectorPanel } from "./sidnav_sections/bottomvidselection";
import { SPlitScreenPreview } from "../../layout/EditorPreviews/SplitScreenPreview";
import { VideoUploadPanel } from "./sidnav_sections/upload";
import { VideoSettingsControlPanel } from "./sidnav_sections/videosettings";
import { defaultpanelwidth } from "../../../data/defaultvalues";
// import { TopNav } from "../../navigations/single_editors/trialtopnav";
import { TopNavWithoutBatchrendering } from "../../navigations/single_editors/withoutswitchmodesbutton";
import { ExportModal } from "../../layout/modals/exportmodal";
// import { SoundAndDurationSection } from "./sidenav_sections/sound_and_duration";
// import { TypographySection } from '../Global/sidenav_sections/typo';
// import { TextTypingTemplatePreview } from "../../layout/EditorPreviews/TextTypingPreview";

export const SplitScreenEditor: React.FC = () => {
  const [templateName, setTemplateName] = useState("My splitscreen video");
  const [bottomVideoUrl, setBottomVideoUrl] = useState("");
  const [topVideoUrl, setTopVideoUrl] = useState("");
  const [bottomHeightPercent, setBottomHeightPercent] = useState(50);
  const [topHeightPercent, setTopHeightPercent] = useState(50);
  const [bottomOpacity, setBottomOpacity] = useState(1);
  const [topOpacity, setTopOpacity] = useState(1);
  const [swap, setSwap] = useState(false);
  const [bottomVolumem, setBottomVolume] = useState(0);
  const [topVolume, setTopVolume] = useState(1);
  const [duration, setDuration] = useState(10);

  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewSize, setPreviewSize] = useState(1);

  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "upload" | "bottomvid" | "settings"
  >("upload");
  const [collapsed, setCollapsed] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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
  //for background images upload
  // SplitScreenEditor.tsx
  const handleVideoUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch("/uploadhandler/upload-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      // backend returns { url, filename, size, durationSeconds }

      setTopVideoUrl(data.url); // 👈 sets preview
      setDuration(data.durationSeconds); // 👈 store video duration
      console.log(
        "✅ Video uploaded:",
        data.url,
        "⏱ Duration:",
        data.durationSeconds
      );
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async (format: string) => {
    // const multiplier = (fontSize - 20) / 10 + 1;
    setIsExporting(true);
    // console.log(fontSize);
    // console.log(backgroundImage)

    try {
      const response = await fetch("/generatevideo/splitscreen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bottomHeightPercent,
          bottomOpacity,
          bottomVideoUrl,
          bottomVolume: bottomVolumem,
          swap,
          topHeightPercent,
          topOpacity,
          topVideoUrl,
          topVolume,
          duration,
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
        template="🎬 Split Screen Video Template"
      />
      <div style={{ display: "flex", flex: 1, marginTop: "60px" }}>
        {/* modal */}
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
        <SplitScreenSideNavs
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

            {activeSection === "upload" && (
              <VideoUploadPanel
                handleVideoUpload={handleVideoUpload}
                setTopVideoUrl={setTopVideoUrl}
                topVideoUrl={topVideoUrl}
              />
            )}

            {activeSection === "bottomvid" && (
              <BottomVideoSelectorPanel
                bottomVideoUrl={bottomVideoUrl}
                setBottomVideoUrl={setBottomVideoUrl}
              />
            )}

            {activeSection === "settings" && (
              <VideoSettingsControlPanel
                bottomHeightPercent={bottomHeightPercent}
                bottomOpacity={bottomOpacity}
                bottomVolume={bottomVolumem}
                setBottomHeightPercent={setBottomHeightPercent}
                setBottomOpacity={setBottomOpacity}
                setBottomVolume={setBottomVolume}
                setSwap={setSwap}
                setTopHeightPercent={setTopHeightPercent}
                setTopOpacity={setTopOpacity}
                setTopVolume={setTopVolume}
                swap={swap}
                topHeightPercent={topHeightPercent}
                topOpacity={topOpacity}
                topVolume={topVolume}
              />
            )}
          </div>
        )}

        <SPlitScreenPreview
          bottomHeightPercent={bottomHeightPercent}
          bottomOpacity={bottomOpacity}
          bottomVideoUrl={bottomVideoUrl}
          bottomVolume={bottomVolumem}
          cycleBg={cycleBg}
          duration={duration}
          previewBg={previewBg}
          swap={swap}
          topHeightPercent={topHeightPercent}
          topOpacity={topOpacity}
          topVideoUrl={topVideoUrl}
          topVolume={topVolume}
          previewScale={previewSize}
          showSafeMargins={showSafeMargins}
          onPreviewScaleChange={setPreviewSize}
          onToggleSafeMargins={setShowSafeMargins}
        />
      </div>
    </div>
  );
};
