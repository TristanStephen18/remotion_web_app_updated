import React, { useState, useRef, useEffect } from "react";
import { SplitScreenSideNavs } from "./sidenav";
import { BottomVideoSelectorPanel } from "./sidnav_sections/bottomvidselection";
import { SPlitScreenPreview } from "../../layout/EditorPreviews/SplitScreenPreview";
import { VideoUploadPanel } from "./sidnav_sections/upload";
import { VideoSettingsControlPanel } from "./sidnav_sections/videosettings";
import { defaultpanelwidth } from "../../../data/defaultvalues";
import { ExportModal } from "../../layout/modals/exportmodal";
import { TopNavWithSave } from "../../navigations/single_editors/withsave";
import { SaveProjectModal } from "../../layout/modals/savemodal";
import { LoadingOverlay } from "../../layout/modals/loadingprojectmodal";
import { useProjectSave } from "../../../hooks/saveproject";
import { useParams } from "react-router-dom";

export const SplitScreenEditor: React.FC = () => {
  const { id } = useParams();

  const [templateName, setTemplateName] = useState("My splitscreen video");
  const [bottomVideoUrl, setBottomVideoUrl] = useState("");
  const [topVideoUrl, setTopVideoUrl] = useState("");
  const [bottomHeightPercent, setBottomHeightPercent] = useState(50);
  const [topHeightPercent, setTopHeightPercent] = useState(50);
  const [bottomOpacity, setBottomOpacity] = useState(1);
  const [topOpacity, setTopOpacity] = useState(1);
  const [swap, setSwap] = useState(false);
  const [bottomVolume, setBottomVolume] = useState(0);
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

  // 🟢 Loading overlay state
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
      () => setMessageIndex((prev) => (prev + 1) % messages.length),
      10000
    );
    return () => clearInterval(interval);
  }, [isLoading]);

  // 🔹 Resizable panel state
  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX - (panelRef.current?.getBoundingClientRect().left || 0);
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

  // 🟢 Video Upload
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
      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
      const data = await response.json();
      setTopVideoUrl(data.url);
      setDuration(data.durationSeconds);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // 🟢 Export
  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      const response = await fetch("/generatevideo/splitscreen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bottomHeightPercent,
          bottomOpacity,
          bottomVideoUrl,
          bottomVolume,
          swap,
          topHeightPercent,
          topOpacity,
          topVideoUrl,
          topVolume,
          duration,
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
    templateId: 6,
    buildProps: () => ({
      bottomHeightPercent,
      bottomOpacity,
      bottomVideoUrl,
      bottomVolume,
      swap,
      topHeightPercent,
      topOpacity,
      topVideoUrl,
      topVolume,
      duration,
    }),
    videoEndpoint: "/generatevideo/splitscreen",
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
          setProjectId(data.id);
          setBottomHeightPercent(data.props.bottomHeightPercent);
          setBottomOpacity(data.props.bottomOpacity);
          setBottomVideoUrl(data.props.bottomVideoUrl);
          setBottomVolume(data.props.bottomVolume);
          setSwap(data.props.swap);
          setTopHeightPercent(data.props.topHeightPercent);
          setTopOpacity(data.props.topOpacity);
          setTopVideoUrl(data.props.topVideoUrl);
          setTopVolume(data.props.topVolume);
          setDuration(data.props.duration);
          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  return (
    <div style={{ display: "flex", height: "100%", flex: 1 }}>
      {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

      <TopNavWithSave
        templateName={templateName}
        onSave={handleSave}
        onExport={handleExport}
        setTemplateName={setTemplateName}
        onOpenExport={() => setShowModal(true)}
        template="🎬 Split Screen Video Template"
        isSaving={isSaving}
      />

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

        <SplitScreenSideNavs
          activeSection={activeSection}
          collapsed={collapsed}
          setActiveSection={setActiveSection}
          setCollapsed={setCollapsed}
        />

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
                bottomVolume={bottomVolume}
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
          bottomVolume={bottomVolume}
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
