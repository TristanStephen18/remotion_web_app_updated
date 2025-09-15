import React, { useState, useRef, useEffect } from "react";
import { DisplayerModal } from "../Global/modal";
// import { BackgroundSecTrial } from "../Global/sidenav_sections/bg";
import { CurveLineSideNav } from "./sidenav";
import { SimpleTrendGraphPreview } from "../../layout/EditorPreviews/SimpleTrendMapPreview";
import type { SimpleGraphProps } from "../../remotion_compositions/Curvelinetrend/SimplifiedTemplateHolder";
import { CurveLineTextPanel } from "./sidenav_sections/titleandsubtitle";
import { ExportSecTrial } from "../Global/sidenav_sections/export";
// import { OptionSectionTrial } from "../Global/sidenav_sections/options";
import {
  CurveLineTrendDataPanel,
  type DataPoint,
} from "./sidenav_sections/data";
import { PresetPanel, type GraphThemeKey } from "./sidenav_sections/themes";
import { AnimationPanel } from "./sidenav_sections/animation";
import { defaultpanelwidth } from "../../../data/defaultvalues";
import { TemplateOptionsSection } from "../Global/templatesettings";

const initialData = [
  { label: 2015, value: 100 },
  { label: 2016, value: 150 },
  { label: 2017, value: 300 },
  { label: 2018, value: 200 },
  { label: 2019, value: 250 },
  { label: 2020, value: 400 },
  { label: 2021, value: 550 },
  { label: 2022, value: 450 },
  { label: 2023, value: 600 },
  { label: 2024, value: 750 },
];

export const CurveLineTrendEditor: React.FC = () => {
  const [templateName, setTemplateName] = useState(
    "🎬 Curve Line Trend Template"
  );
  const [fontFamily, setFontfamily] = useState("Arial, sans-serif");
  const [title, setTitle] = useState("Revenue Growth");
  const [subtitle, setSubtitle] = useState("2015–2024 • Journey");
  const [data, setData] = useState<DataPoint[]>(initialData);
  const [dataType, setDataType] = useState<"$" | "%" | "#" | "number">("$");
  const [preset, setPreset] = useState<GraphThemeKey>("corporate");
  const [animationSpeed, setAnimationSpeed] = useState<
    "slow" | "normal" | "fast"
  >("normal");
  const [minimalMode, setMinimalMode] = useState(false);

  const [titleFontSize, setTitleFontSize] = useState(50);
  const [subtitleFontSize, setSubtitleFontSize] = useState(30);
  const [previewSize, setPreviewSize] = useState(1);
  const backgroundImage = "";

  const graphProps: SimpleGraphProps = {
    title,
    subtitle,
    titleFontSize,
    subtitleFontSize,
    fontFamily,
    data,
    dataType,
    preset,
    backgroundImage,
    animationSpeed,
    minimalMode,
  };

  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "text" | "data" | "background" | "animation" | "template" | "export"
  >("text");
  const [collapsed, setCollapsed] = useState(false);

  //   const [isUploading, setIsUploading] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  // const [autoSave, setAutoSave] = useState(false);
  const [duration, setDuration] = useState(13);

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
    setIsExporting(format);
    try {
      const response = await fetch("/generatevideo/curvelinetrend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            title,
            subtitle,
            titleFontSize,
            subtitleFontSize,
            fontFamily,
            data,
            dataType,
            preset,
            backgroundImage,
            animationSpeed,
            minimalMode,
            duration,
          },
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
      <CurveLineSideNav
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

          {activeSection == "text" && (
            <CurveLineTextPanel
              setSubtitle={setSubtitle}
              setSubtitleFontSize={setSubtitleFontSize}
              setTitle={setTitle}
              setTitleFontSize={setTitleFontSize}
              subtitle={subtitle}
              subtitleFontSize={subtitleFontSize}
              title={title}
              titleFontSize={titleFontSize}
              fontFamily={fontFamily}
              setFontFamily={setFontfamily}
            />
          )}

          {activeSection === "data" && (
            <CurveLineTrendDataPanel
              data={data}
              dataType={dataType}
              setData={setData}
              setDataType={setDataType}
            />
          )}

          {activeSection === "background" && (
            <PresetPanel preset={preset} setPreset={setPreset} />
          )}

          {activeSection === "animation" && (
            <AnimationPanel
              animationSpeed={animationSpeed}
              duration={duration}
              minimalMode={minimalMode}
              setAnimationSpeed={setAnimationSpeed}
              setDuration={setDuration}
              setMinimalMode={setMinimalMode}
            />
          )}

          {activeSection === "template" && (
            <TemplateOptionsSection
              onEnterBatchRender={() => {
                window.location.assign("/template/curvelinetrend/mode/batchrendering");
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

      <SimpleTrendGraphPreview
        {...graphProps}
        duration={duration}
        previewBg={previewBg}
        cycleBg={cycleBg}
        previewScale={previewSize}
        showSafeMargins={showSafeMargins}
        onPreviewScaleChange={setPreviewSize}
        onToggleSafeMargins={setShowSafeMargins}
      />
    </div>
  );
};
