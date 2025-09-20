import React, { useState, useRef, useEffect } from "react";
import { KenBurnsSideNav } from "./sidenav";
import { KenBurnsCarouselPreview } from "../../layout/EditorPreviews/KenBurnsCarouselPreview";
import { KenBurnsImagesPanel } from "./sidenav_sections/images";
import { ProportionsPanel } from "./sidenav_sections/proportions";
import { defaultpanelwidth } from "../../../data/defaultvalues";
import { ExportModal } from "../../layout/modals/exportmodal";
import { TopNavWithSave } from "../../navigations/single_editors/withsave";
import { SaveProjectModal } from "../../layout/modals/savemodal";
import { LoadingOverlay } from "../../layout/modals/loadingprojectmodal";
import { useProjectSave } from "../../../hooks/saveproject";
import { useParams } from "react-router-dom";

export const KenBurnsEditor: React.FC = () => {
  const { id } = useParams();

  // 🟢 Core States
  const [templateName, setTemplateName] = useState(
    "🎬 Ken Burns Swipe Template"
  );
  const [previewSize, setPreviewSize] = useState(1);
  const [images, setImages] = useState<string[]>([
    "/images/holder.jpg",
    "/images/holder.jpg",
    "/images/holder.jpg",
  ]);
  const [duration, setDuration] = useState<number>(15);
  const [cardWidthRatio, setCardWidthRatio] = useState<number>(0.75);
  const [cardHeightRatio, setCardHeightRatio] = useState<number>(0.75);
  const blurBgOpacity = 0.0;

  // 🟢 UI States
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<"images" | "proportions">(
    "images"
  );
  const [collapsed, setCollapsed] = useState(false);

  // 🟢 Export
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // 🟢 Loading overlay
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

  // 🟢 Resizable Panel
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

  // 🟢 Background cycle
  const cycleBg = () => {
    if (previewBg === "dark") setPreviewBg("light");
    else if (previewBg === "light") setPreviewBg("grey");
    else setPreviewBg("dark");
  };

  // 🟢 Export Handler
  const handleExport = async (format: string) => {
    const prefix = window.location.origin;
    const updatedImages = images.map((img) =>
      img.startsWith("http") ? img : `${prefix}${img}`
    );

    setIsExporting(true);
    try {
      const response = await fetch("/generatevideo/kenburnsswipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: updatedImages,
          cardHeightRatio,
          cardWidthRatio,
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
    templateId: 8, // 👈 unique ID for Ken Burns
    buildProps: () => ({
      images: images.map((img) =>
        img.startsWith("http") ? img : `${window.location.origin}${img}`
      ),
      duration,
      cardWidthRatio,
      cardHeightRatio,
    }),
    videoEndpoint: "/generatevideo/kenburnsswipe",
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
          setImages(data.props.images);
          setDuration(data.props.duration);
          setCardHeightRatio(data.props.cardHeightRatio);
          setCardWidthRatio(data.props.cardWidthRatio);
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
        template="🎬 Ken Burns Carousel Template"
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
        <KenBurnsSideNav
          activeSection={activeSection}
          collapsed={collapsed}
          setActiveSection={setActiveSection}
          setCollapsed={setCollapsed}
        />

        {/* 🔹 Side Panel */}
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

            {activeSection === "images" && (
              <KenBurnsImagesPanel
                images={images}
                setImages={setImages}
                setDuration={setDuration}
              />
            )}

            {activeSection === "proportions" && (
              <ProportionsPanel
                cardHeightRatio={cardHeightRatio}
                cardWidthRatio={cardWidthRatio}
                setCardHeightRatio={setCardHeightRatio}
                setCardWidthRatio={setCardWidthRatio}
              />
            )}
          </div>
        )}

        {/* 🔹 Preview */}
        <KenBurnsCarouselPreview
          cycleBg={cycleBg}
          duration={duration}
          images={images}
          previewBg={previewBg}
          cardHeightRatio={cardHeightRatio}
          blurBgOpacity={blurBgOpacity}
          cardWidthRatio={cardWidthRatio}
          previewScale={previewSize}
          showSafeMargins={showSafeMargins}
          onPreviewScaleChange={setPreviewSize}
          onToggleSafeMargins={setShowSafeMargins}
        />
      </div>
    </div>
  );
};
