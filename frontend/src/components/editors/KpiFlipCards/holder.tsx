import React, { useState, useRef, useEffect } from "react";
import { DisplayerModal } from "../Global/modal";
import { BackgroundSecTrial } from "../Global/sidenav_sections/bg";
import { OptionSectionTrial } from "../Global/sidenav_sections/options";
import { ExportSecTrial } from "../Global/sidenav_sections/export";
import { KpiFlipSideNav } from "./sidenav";
import type { CardData } from "../../remotion_compositions/KpiFlipCards";
import { KpiFlipCardsPreview } from "../../layout/EditorPreviews/KpiFlipCardsPreview";
import { TextSettingsPanel } from "./sidenav_sections/text";
import { CardsLayoutPanel } from "./sidenav_sections/layout";
import { CardStylingPanel } from "./sidenav_sections/cardstyling";
import { AnimationSettingsPanel } from "./sidenav_sections/animation";
import { CardDataPanel } from "./sidenav_sections/data";
import { defaultpanelwidth } from "../../../data/defaultvalues";

export const KpiFlipCardEditor: React.FC = () => {
  //   const [quote, setQuote] = useState("Your Quote");
  //   const [author, setAuthor] = useState("Author");
  const [backgroundImage, setBackgroundImage] = useState(
    "http://localhost:3000/bgimages/colors/bg1.jpg"
  );
  const [backgroundSource, setBackgroundSource] = useState<
    "upload" | "default"
  >("default");

  const [title, setTitle] = useState("Performance\nDashboard");
  const [titleFontSize, setTitleFontSize] = useState(96);
  const [titleFontColor, setTitleFontColor] = useState("#FFFFFF");
  const [titleFontFamily, setTitleFontFamily] = useState(
    "Inter, system-ui, sans-serif"
  );

  const [subtitle, setSubtitle] = useState("Real-time Analytics");
  const [subtitleFontSize, setSubtitleFontSize] = useState(36);
  const [subtitleFontColor, setSubtitleFontColor] = useState("#E5E7EB");
  const [subtitleFontFamily, setSubtitleFontFamily] = useState(
    "Inter, system-ui, sans-serif"
  );

  const [cardWidth, setCardWidth] = useState(360);
  const [cardHeight, setCardHeight] = useState(220);
  const [cardBorderRadius, setCardBorderRadius] = useState(28);

  const [cardGrid, setCardGrid] = useState<{ rows: number; cols: number }>({
    rows: 2,
    cols: 2,
  });

  const [cardBorderColor, setCardBorderColor] = useState("#000000");
  const [cardLabelColor, setCardLabelColor] = useState("#6B7280");
  const [cardLabelFontSize, setCardLabelFontSize] = useState(28);
  const [cardBackColor, setCardColorBack] = useState("#FFFF");
  const [cardFrontColor, setCardFrontColor] = useState("#ffff");
  const [valueFontSize, setValueFontSzie] = useState(46);
  const [cardContentFontFamily, setCardContentFontFamily] = useState(
    "Inter, system-ui, sans-serif"
  );
  const [previewSize, setPreviewSize] = useState(1);

  /** === 📊 Card Data === */
  const [cardsData, setCardsData] = useState<CardData[]>([
    {
      front: { label: "CTR", value: "12.5%", color: "#3B82F6" },
      back: { label: "Clicks", value: "2.4K", color: "#10B981" },
    },
    {
      front: { label: "CPA", value: "$24", color: "#8B5CF6" },
      back: { label: "ROAS", value: "4.2x", color: "#F59E0B" },
    },
    {
      front: { label: "CR", value: "8.7%", color: "#EF4444" },
      back: { label: "AOV", value: "$156", color: "#06B6D4" },
    },
    {
      front: { label: "CPC", value: "$1.92", color: "#84CC16" },
      back: { label: "CPM", value: "$12.5", color: "#F97316" },
    },
  ]);

  const [delayStart, setDelayStart] = useState(0.5);
  const [delayStep, setDelayStep] = useState(1);

  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    | "text"
    | "layout"
    | "style"
    | "data"
    | "animation"
    | "background"
    | "options"
    | "export"
  >("text");
  const [collapsed, setCollapsed] = useState(false);
  const [duration, setDuration] = useState(13);

  const [isUploading, setIsUploading] = useState(false);
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
    // console.log(backgroundImage)
    try {
      let finalImageUrl = backgroundImage;
      if (!finalImageUrl.startsWith("http://localhost:3000")) {
        finalImageUrl = `http://localhost:3000${finalImageUrl}`;
      }
      const response = await fetch("/generatevideo/kpiflipcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          backgroundImage: finalImageUrl,
          title,
          titleFontSize,
          titleFontColor,
          titleFontFamily,
          subtitle,
          subtitleFontSize,
          subtitleFontColor,
          subtitleFontFamily,
          cardsData,
          cardWidth,
          cardHeight,
          cardBorderRadius,
          cardBorderColor,
          cardLabelColor,
          cardLabelFontSize,
          cardContentFontFamily,
          cardGrid,
          delayStart,
          delayStep,
          cardColorBack: cardBackColor,
          cardColorFront: cardFrontColor,
          valueFontSize,
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
      <KpiFlipSideNav
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
            🎬 Kpi Flip Cards Template
          </h2>

          {activeSection === "text" && (
            <TextSettingsPanel
              title={title}
              setTitle={setTitle}
              titleFontSize={titleFontSize}
              setTitleFontSize={setTitleFontSize}
              titleFontColor={titleFontColor}
              setTitleFontColor={setTitleFontColor}
              titleFontFamily={titleFontFamily}
              setTitleFontFamily={setTitleFontFamily}
              subtitle={subtitle}
              setSubtitle={setSubtitle}
              subtitleFontSize={subtitleFontSize}
              setSubtitleFontSize={setSubtitleFontSize}
              subtitleFontColor={subtitleFontColor}
              setSubtitleFontColor={setSubtitleFontColor}
              subtitleFontFamily={subtitleFontFamily}
              setSubtitleFontFamily={setSubtitleFontFamily}
            />
          )}

          {activeSection === "layout" && (
            <CardsLayoutPanel
              cardWidth={cardWidth}
              setCardWidth={setCardWidth}
              cardHeight={cardHeight}
              setCardHeight={setCardHeight}
              cardBorderRadius={cardBorderRadius}
              setCardBorderRadius={setCardBorderRadius}
              cardGrid={cardGrid}
              setCardGrid={setCardGrid}
            />
          )}
          {activeSection === "style" && (
            <CardStylingPanel
              cardBorderColor={cardBorderColor}
              setCardBorderColor={setCardBorderColor}
              cardLabelColor={cardLabelColor}
              setCardLabelColor={setCardLabelColor}
              cardLabelFontSize={cardLabelFontSize}
              setCardLabelFontSize={setCardLabelFontSize}
              cardContentFontFamily={cardContentFontFamily}
              setCardContentFontFamily={setCardContentFontFamily}
              cardBackColor={cardBackColor}
              cardFrontColor={cardFrontColor}
              setCardBackColor={setCardColorBack}
              setCardFrontColor={setCardFrontColor}
              valueFontSize={valueFontSize}
              setValueFontSize={setValueFontSzie}
            />
          )}

          {activeSection === "animation" && (
            <AnimationSettingsPanel
              delayStart={delayStart}
              setDelayStart={setDelayStart}
              delayStep={delayStep}
              setDelayStep={setDelayStep}
            />
          )}

          {activeSection === "data" && (
            <CardDataPanel cardsData={cardsData} setCardsData={setCardsData} />
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

      <KpiFlipCardsPreview
        backgroundImage={backgroundImage}
        cardBorderColor={cardBorderColor}
        cardBorderRadius={cardBorderRadius}
        cardContentFontFamily={cardContentFontFamily}
        cardGrid={cardGrid}
        cardHeight={cardHeight}
        cardLabelColor={cardLabelColor}
        cardLabelFontSize={cardLabelFontSize}
        cardWidth={cardWidth}
        cardsData={cardsData}
        cycleBg={cycleBg}
        delayStart={delayStart}
        delayStep={delayStep}
        fps={30}
        previewBg={previewBg}
        subtitle={subtitle}
        subtitleFontColor={subtitleFontColor}
        subtitleFontFamily={subtitleFontFamily}
        subtitleFontSize={subtitleFontSize}
        title={title}
        titleFontColor={titleFontColor}
        titleFontFamily={titleFontFamily}
        titleFontSize={titleFontSize}
        cardColorBack={cardBackColor}
        cardColorFront={cardFrontColor}
        valueFontSize={valueFontSize}
        previewScale={previewSize}
        showSafeMargins={showSafeMargins}
        onPreviewScaleChange={setPreviewSize}
        onToggleSafeMargins={setShowSafeMargins}
      />
      {/* 
      <QuoteSpotlightPreview
        quote={quote}
        author={author}
        backgroundImage={backgroundImage}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontColor={fontColor}
        showSafeMargins={showSafeMargins}
        previewBg={previewBg}
        cycleBg={cycleBg}
      /> */}
    </div>
  );
};
