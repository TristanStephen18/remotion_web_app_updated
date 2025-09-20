import React, { useState, useRef, useEffect } from "react";
import { BackgroundSecTrial } from "../Global/sidenav_sections/bg";
import { BarGraphNavs } from "./sidenav";
import { BarGraphTemplatePreview } from "../../layout/EditorPreviews/BarGraphPreview";
import type { BargraphData } from "../../remotion_compositions/BarGraphTemplate";
import { TypographyPanelBarGraphTemplate } from "./sidenav_sections/header";
import { DataPanel } from "./sidenav_sections/dataenrty";
import { BarGraphControlsPanel } from "./sidenav_sections/bargraphconfig";
import { defaultpanelwidth } from "../../../data/defaultvalues";
import { ExportModal } from "../../layout/modals/exportmodal";
import { TopNavWithSave } from "../../navigations/single_editors/withsave";
import { useProjectSave } from "../../../hooks/saveproject";
import { SaveProjectModal } from "../../layout/modals/savemodal";
import { LoadingOverlay } from "../../layout/modals/loadingprojectmodal";
import { useParams } from "react-router-dom";

export const BarGraphEditor: React.FC = () => {
  const { id } = useParams();

  const [templateName, setTemplateName] = useState("My Bar Graph Analytics Template");
  const [previewSize, setPreviewSize] = useState(1);

  // header states
  const [title, setTitle] = useState("Your title");
  const [subtitle, setSubtitle] = useState("Your subtitle");
  const [titleFontSize, setTitleFontSize] = useState(80);
  const [subtitleFontSize, setSubtitleFontSize] = useState(50);
  const [titleFontColor, setTitleFontColor] = useState("white");
  const [subtitleFontColor, setSubtitleFontColor] = useState("white");
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [accent, setAccent] = useState("#3B82F6");

  // data
  const [data, setData] = useState<BargraphData[]>([
    { name: "Data1", value: 124500 },
    { name: "Data2", value: 110200 },
    { name: "Data3", value: 87300 },
    { name: "Data4", value: 76500 },
    { name: "Data5", value: 54200 },
    { name: "Data6", value: 49800 },
  ]);

  // bg
  const [backgroundImage, setBackgroundImage] = useState("/bgimages/colors/bg1.jpg");
  const [backgroundSource, setBackgroundSource] = useState<"upload" | "default">("default");

  // bargraph config
  const [barHeight, setBarHeight] = useState(100);
  const [barGap, setBarGap] = useState(36);
  const [barLabelFontSize, setBarLabelFontSize] = useState(36);
  const [barValueFontSize, setBarValueFontSize] = useState(36);

  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<"title" | "graph" | "data" | "background">("title");
  const [collapsed, setCollapsed] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [duration, setDuration] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Loader messages
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "⏳ Preparing your template...",
    "🙇 Sorry for the wait, still working on it...",
    "🚀 Almost there, thanks for your patience!",
  ];

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // 🔹 Resizable panel state
  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Drag handlers
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

      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
      const data = await response.json();
      setBackgroundImage(data.url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      let finalImageUrl = backgroundImage;
      const origin = window.location.origin;
      if (!finalImageUrl.startsWith(origin)) finalImageUrl = `${origin}${finalImageUrl}`;

      const response = await fetch("/generatevideo/bargraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          title,
          titleFontColor,
          backgroundImage: finalImageUrl,
          accent,
          subtitle,
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

      if (!response.ok) throw new Error(await response.text());
      const result = await response.json();
      setExportUrl(result.url);
      setShowModal(true);
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Export failed: ${error || "Please try again."}`);
    } finally {
      setIsExporting(false);
    }
  };

  // 🟢 Project save hook
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
    templateId: 3, // 👈 assign unique template ID
    buildProps: () => ({
      data,
      title,
      subtitle,
      titleFontSize,
      subtitleFontSize,
      titleFontColor,
      subtitleFontColor,
      fontFamily,
      accent,
      barHeight,
      barGap,
      barLabelFontSize,
      barValueFontSize,
      backgroundImage: backgroundImage.startsWith("http")
        ? backgroundImage
        : `${window.location.origin}${backgroundImage}`,
      duration,
    }),
    videoEndpoint: "/generatevideo/bargraph",
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
          setTitle(data.props.title);
          setSubtitle(data.props.subtitle);
          setTitleFontSize(data.props.titleFontSize);
          setSubtitleFontSize(data.props.subtitleFontSize);
          setTitleFontColor(data.props.titleFontColor);
          setSubtitleFontColor(data.props.subtitleFontColor);
          setFontFamily(data.props.fontFamily);
          setAccent(data.props.accent);
          setBarHeight(data.props.barHeight);
          setBarGap(data.props.barGap);
          setBarLabelFontSize(data.props.barLabelFontSize);
          setBarValueFontSize(data.props.barValueFontSize);
          setBackgroundImage(data.props.backgroundImage);
          setData(data.props.data);
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
        template="🎬 Bar Graph Analytics Template"
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
                subtitle={subtitle}
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
          subtitle={subtitle}
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
    </div>
  );
};
