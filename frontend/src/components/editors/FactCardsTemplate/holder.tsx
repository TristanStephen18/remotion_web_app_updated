import React, { useState, useRef, useEffect } from "react";
// import { DisplayerModal } from "../Global/modal";
import { BackgroundSecTrial } from "../Global/sidenav_sections/bg";
// import { ExportSecTrial } from "../Global/sidenav_sections/export";
// import { OptionSectionTrial } from "../Global/sidenav_sections/options";
import { FactCardsSidenav } from "./sidenav";
import { IntroOutroPanel } from "./sidenave_sections/endpoints";
import type { Slide } from "../../layout/EditorPreviews/FacstCardTemplate";
import { FactPanel } from "./sidenave_sections/facts";
import { TypographyPanelFactsTemplate } from "./sidenave_sections/typo";
import { FacstCardPreview } from "../../layout/EditorPreviews/FacstCardTemplate";
import { DurationSection } from "./sidenave_sections/duration";
import { defaultpanelwidth } from "../../../data/defaultvalues";
// import { TemplateOptionsSection } from "../Global/templatesettings";
// import { TopNav } from "../../navigations/single_editors/trialtopnav";
import { ExportModal } from "../../layout/modals/exportmodal";
import { TopNavWithoutBatchrendering } from "../../navigations/single_editors/withoutswitchmodesbutton";

export const FactCardsEditor: React.FC = () => {
  const [templateName, setTemplateName] = useState("My Fact Cards Template");
  const [intro, setIntro] = useState<Slide>({
    title: "Your intro title",
    subtitle: "Your intro subtitle",
  });
  const [outro, setOutro] = useState<Slide>({
    title: "Your outro title",
    subtitle: "Your outro subtitle",
  });
  const [factsArray, setFactsArray] = useState<Slide[]>([
    {
      title: "Your fact no.1",
      description: "The moon is made up of cheese",
    },
  ]);
  const [titleFontSize, setTitleFontSize] = useState(80);
  const [subtitleFontSize, setSubtitleFontSize] = useState(50);
  const [titleFontColor, setTitleFontColor] = useState("white");
  const [subtitleFontColor, setSubtitleFontColor] = useState("white");
  const [previewSize, setPreviewSize] = useState(1);

  const [titlefontFamily, setTitleFontFamily] = useState("Russo");
  const [subtitleFontFamily, setSubtitleFontFamily] = useState("Russo");
  const [backgroundImage, setBackgroundImage] = useState(
    "http://localhost:3000/bgimages/colors/bg1.jpg"
  );
  const [backgroundSource, setBackgroundSource] = useState<
    "upload" | "default"
  >("default");

  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "background" | "typography" | "endpoints" | "facts" | "duration"
  >("endpoints");
  const [collapsed, setCollapsed] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  // const [autoSave, setAutoSave] = useState(false);
  const [duration, setDuration] = useState(20);

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
    setIsExporting(true);
    // console.log(backgroundImage)
    try {
      let finalImageUrl = backgroundImage;
      const origin = window.location.origin;
      if (!finalImageUrl.startsWith(origin)) {
        finalImageUrl = `${origin}${finalImageUrl}`;
      }

      const response = await fetch("/generatevideo/factstemplaterender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intro,
          outro,
          facts: factsArray,
          backgroundImage: finalImageUrl,
          fontSizeTitle: titleFontSize,
          fontSizeSubtitle: subtitleFontSize,
          fontFamilyTitle: titlefontFamily,
          fontColorTitle: titleFontColor,
          fontColorSubtitle: subtitleFontColor,
          fontFamilySubtitle: subtitleFontFamily,
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
        template="🎬 Facts Cards Template"
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
        <FactCardsSidenav
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

            {activeSection === "facts" && (
              <FactPanel
                factsArray={factsArray}
                setFactsArray={setFactsArray}
              />
            )}

            {activeSection === "endpoints" && (
              <IntroOutroPanel
                //   handleAISuggestion={handleAISuggestion}
                intro={intro}
                outro={outro}
                setIntro={setIntro}
                setOutro={setOutro}
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

            {activeSection === "typography" && (
              <TypographyPanelFactsTemplate
                setSubtitleFontColor={setSubtitleFontColor}
                setSubtitleFontFamily={setSubtitleFontFamily}
                setSubtitleFontSize={setSubtitleFontSize}
                setTitleFontColor={setTitleFontColor}
                setTitleFontFamily={setTitleFontFamily}
                setTitleFontSize={setTitleFontSize}
                subtitleFontColor={subtitleFontColor}
                subtitleFontFamily={subtitleFontFamily}
                subtitleFontSize={subtitleFontSize}
                titleFontColor={titleFontColor}
                titleFontFamily={titlefontFamily}
                titleFontSize={titleFontSize}
              />
            )}
            {activeSection === "duration" && (
              <DurationSection duration={duration} setDuration={setDuration} />
            )}

            {/* {activeSection === "template" && (
            <TemplateOptionsSection
              onEnterBatchRender={() => {
                window.location.assign(
                  "/template/factcards/mode/batchrendering"
                );
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
          )} */}
          </div>
        )}

        <FacstCardPreview
          backgroundImage={backgroundImage}
          cycleBg={cycleBg}
          facts={factsArray}
          fontColorTitle={titleFontColor}
          fontFamilyTitle={titlefontFamily}
          fontColorSubtitle={subtitleFontColor}
          fontFamilySubtitle={subtitleFontFamily}
          fontSizeSubtitle={subtitleFontSize}
          fontSizeTitle={titleFontSize}
          intro={intro}
          outro={outro}
          previewBg={previewBg}
          duration={duration}
          showSafeMargins={showSafeMargins}
          previewScale={previewSize}
          onPreviewScaleChange={setPreviewSize}
          onToggleSafeMargins={setShowSafeMargins}
        />
      </div>
    </div>
  );
};
