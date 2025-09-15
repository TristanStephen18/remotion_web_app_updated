import React, { useState, useRef, useEffect } from "react";
import { DisplayerModal } from "../Global/modal";
// import { OptionSectionTrial } from "../Global/sidenav_sections/options";
import { ExportSecTrial } from "../Global/sidenav_sections/export";
import { KenBurnsSideNav } from "./sidenav";
import { KenBurnsCarouselPreview } from "../../layout/EditorPreviews/KenBurnsCarouselPreview";
import { KenBurnsImagesPanel } from "./sidenav_sections/images";
import { ProportionsPanel } from "./sidenav_sections/proportions";
import { defaultpanelwidth } from "../../../data/defaultvalues";
import { TemplateOptionsSection } from "../Global/templatesettings";

export const KernBurnsEditor: React.FC = () => {
  const [templateName, setTemplateName] = useState("🎬 Ken Burns Swipe Template");
  const [previewSize, setPreviewSize] = useState(1);

  const [images, setImages] = React.useState<string[]>([
    "/images/holder.jpg",
    "/images/holder.jpg",
    "/images/holder.jpg",
  ]);

  const [duration, setDuration] = React.useState<number>(15);

  const [cardWidthRatio, setCardWidthRatio] = React.useState<number>(0.75);

  const [cardHeightRatio, setCardHeightRatio] = React.useState<number>(0.75);
  const blurBgOpacity =0.0;
  // const [blurBgOpacity, setBlurBgOpacity] = React.useState<number>(0.0);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "images" | "proportions" | "template" | "export"
  >("images");
  const [collapsed, setCollapsed] = useState(false);

  // const [isUploading, setIsUploading] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

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

  const handleExport = async (format: string) => {
    const prefix = "http://localhost:3000";

    const updatedimages = images.map((img) => `${prefix}${img}`);

    console.log(updatedimages);
    setIsExporting(format);
    try {
      const response = await fetch("/generatevideo/kenburnsswipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: updatedimages,
          cardHeightRatio,
          cardWidthRatio,
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
      <KenBurnsSideNav
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
            transition: isResizing ? "#add" : "width 0.2s",
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
            {templateName}
          </h2>

          {activeSection === "images" && (
            <KenBurnsImagesPanel images={images} setImages={setImages} setDuration={setDuration} />
          )}

          {activeSection === "proportions" && (
            <ProportionsPanel
              cardHeightRatio={cardHeightRatio}
              cardWidthRatio={cardWidthRatio}
              setCardHeightRatio={setCardHeightRatio}
              setCardWidthRatio={setCardWidthRatio}
            />
          )}

          {activeSection === "template" && (
            <TemplateOptionsSection
            onEnterBatchRender={()=>{
              window.location.assign("/template/kenburnscarousel/mode/batchrendering")
            }}
            setTemplateName={setTemplateName}
            templateName={templateName}
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
  );
};
