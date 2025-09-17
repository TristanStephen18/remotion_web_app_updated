import React, { useState, useRef, useEffect } from "react";
import { DisplayerModal } from "../Global/modal";
import { BackgroundSecTrial } from "../Global/sidenav_sections/bg";
import { ExportSecTrial } from "../Global/sidenav_sections/export";
// import { OptionSectionTrial } from "../Global/sidenav_sections/options";
import { BarGraphNavs } from "./sidenav";
import { BarGraphTemplatePreview } from "../../layout/EditorPreviews/BarGraphPreview";
import type { BargraphData } from "../../remotion_compositions/BarGraphTemplate";
import { TypographyPanelBarGraphTemplate } from "./sidenav_sections/header";
import { DataPanel } from "./sidenav_sections/dataenrty";
import { BarGraphControlsPanel } from "./sidenav_sections/bargraphconfig";
import { defaultpanelwidth } from "../../../data/defaultvalues";
import { TemplateOptionsSection } from "../Global/templatesettings";

export const BarGraphEditor: React.FC = () => {
  const [templateName, setTemplateName] = useState(
    "🎬 Bar Graph Analytics Template"
  );
  const [previewSize, setPreviewSize] = useState(1);

  //header states
  const [title, setTitle] = useState("Your title");
  const [subTitle, setSubtitle] = useState("Your subtitle");
  const [titleFontSize, setTitleFontSize] = useState(80);
  const [subtitleFontSize, setSubtitleFontSize] = useState(50);
  const [titleFontColor, setTitleFontColor] = useState("white");
  const [subtitleFontColor, setSubtitleFontColor] = useState("white");
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [accent, setAccent] = useState("#3B82F6");
  //data
  const [data, setData] = useState<BargraphData[]>([
    { name: "Data1", value: 124500 },
    { name: "Data2", value: 110200 },
    { name: "Data3", value: 87300 },
    { name: "Data4", value: 76500 },
    { name: "Data5", value: 54200 },
    { name: "Data6", value: 49800 },
  ]);

  //bg
  const [backgroundImage, setBackgroundImage] = useState(
    "http://localhost:3000/bgimages/colors/bg1.jpg"
  );
  const [backgroundSource, setBackgroundSource] = useState<
    "upload" | "default"
  >("default");

  //bargraph configuration
  const [barHeight, setBarHeight] = useState(100);
  const [barGap, setBarGap] = useState(36);
  const [barLabelFontSize, setBarLabelFontSize] = useState(36);
  const [barValueFontSize, setBarValueFontSize] = useState(36);

  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "title" | "graph" | "data" | "background" | "template" | "export"
  >("title");
  const [collapsed, setCollapsed] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  // const [autoSave, setAutoSave] = useState(false);
  const [duration, setDuration] = useState(8);

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
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/uploadhandler/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      setBackgroundImage(data.url);
      console.log("Image uploaded successfully:", data.url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async (format: string) => {
    setIsExporting(format);
    console.log(backgroundImage);
    try {
      let finalImageUrl = backgroundImage;
      const origin = window.location.origin;
      if (!finalImageUrl.startsWith(origin)) {
        finalImageUrl = `${origin}${finalImageUrl}`;
      }

      const response = await fetch("/generatevideo/bargraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          title,
          titleFontColor,
          backgroundImage: finalImageUrl,
          accent,
          subtitle: subTitle,
          currency: "",
          titleFontSize,
          subtitleFontSize,
          subtitleColor: subtitleFontColor,
          barHeight,
          barGap,
          barLabelFontSize,
          barValueFontSize,
          fontFamily,
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
      const result = await response.json();
      setExportUrl(result.url);
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
      <BarGraphNavs
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

          {activeSection === "title" && (
            <TypographyPanelBarGraphTemplate
              accent={accent}
              fontFamily={fontFamily}
              setAccent={setAccent}
              setFontFamily={setFontFamily}
              setSubtitleFontColor={setSubtitleFontColor}
              setSubtitleFontSize={setSubtitleFontSize}
              setTitleFontColor={setTitleFontColor}
              setTitleFontSize={setTitleFontSize}
              subtitleFontColor={subtitleFontColor}
              subtitleFontSize={subtitleFontSize}
              titleFontColor={titleFontColor}
              titleFontSize={titleFontSize}
              title={title}
              setSubtitle={setSubtitle}
              setTitle={setTitle}
              subtitle={subTitle}
            />
          )}

          {activeSection === "data" && (
            <DataPanel
              data={data}
              setData={setData}
              duration={duration}
              setDuration={setDuration}
            />
          )}

          {activeSection === "graph" && (
            <BarGraphControlsPanel
              barGap={barGap}
              barHeight={barHeight}
              barLabelFontSize={barLabelFontSize}
              barValueFontSize={barValueFontSize}
              setBarGap={setBarGap}
              setBarHeight={setBarHeight}
              setBarLabelFontSize={setBarLabelFontSize}
              setBarValueFontSize={setBarValueFontSize}
            />
          )}

          {activeSection === "background" && (
            <BackgroundSecTrial
              backgroundImage={backgroundImage}
              backgroundSource={backgroundSource}
              handleFileUpload={handleFileUpload}
              isUploading={isUploading}
              setBackgroundImage={setBackgroundImage}
              setBackgroundSource={setBackgroundSource}
            />
          )}
          {activeSection === "template" && (
            <TemplateOptionsSection
              setTemplateName={setTemplateName}
              templateName={templateName}
              onEnterBatchRender={() => {
                window.location.assign(
                  "/template/bargraph/mode/batchrendering"
                );
              }}
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

      <BarGraphTemplatePreview
        accent={accent}
        backgroundImage={backgroundImage}
        cycleBg={cycleBg}
        data={data}
        previewBg={previewBg}
        title={title}
        titleFontColor={titleFontColor}
        barGap={barGap}
        barHeight={barHeight}
        barLabelFontSize={barLabelFontSize}
        barValueFontSize={barValueFontSize}
        subtitle={subTitle}
        subtitleColor={subtitleFontColor}
        titleFontSize={titleFontSize}
        subtitleFontSize={subtitleFontSize}
        fontFamily={fontFamily}
        previewScale={previewSize}
        duration={duration}
        showSafeMargins={showSafeMargins}
        onPreviewScaleChange={setPreviewSize}
        onToggleSafeMargins={setShowSafeMargins}
      />
    </div>
  );
};
