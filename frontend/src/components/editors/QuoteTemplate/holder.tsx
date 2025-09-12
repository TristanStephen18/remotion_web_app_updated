import React, { useState, useRef, useEffect } from "react";
import { DisplayerModal } from "../Global/modal";
import { SideNavTrial } from "./sidenav";
import { QuoteSecTrial } from "./sidenav_sections/quote";
import { BackgroundSecTrial } from "../Global/sidenav_sections/bg";
import { OptionSectionTrial } from "../Global/sidenav_sections/options";
import { ExportSecTrial } from "../Global/sidenav_sections/export";
// import { TypographySection } from "../Global/sidenav_sections/typo";
import { QuoteSpotlightPreview } from "../../layout/EditorPreviews/QuoteTemplatePreview";
import { TypographySectionQuote } from "./sidenav_sections/typo";
import { defaultpanelwidth } from "../../../data/defaultvalues";

export const QuoteTemplateEditor: React.FC = () => {
    const [previewSize, setPreviewSize] = useState(1);
  
  const [quote, setQuote] = useState("Your Quote");
  const [author, setAuthor] = useState("Author");
  const [backgroundImage, setBackgroundImage] = useState(
    "http://localhost:3000/bgimages/colors/bg1.jpg"
  );
  const [backgroundSource, setBackgroundSource] = useState<
    "upload" | "default"
  >("default");

  const [fontFamily, setFontFamily] = useState("Cormorant Garamond, serif");
  const [fontColor, setFontColor] = useState("white");
  const [fontSize, setFontSize] = useState(1);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "quote" | "background" | "typography" | "options" | "export"
  >("quote");
  const [collapsed, setCollapsed] = useState(false);

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

  const handleAISuggestion = async () => {
    try {
      const response = await fetch("/api/generate-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      setAuthor(data.author);
      setQuote(data.quote);
    } catch (error) {
      console.error("error generating ai suggestion");
      alert(error);
    }
  };

  const handleExport = async (format: string) => {
    // const multiplier = (fontSize - 100) / 10 + 1;
    setIsExporting(format);
    // console.log(backgroundImage)

    try {
      let finalImageUrl = backgroundImage;
      if (!finalImageUrl.startsWith("http://localhost:3000")) {
        finalImageUrl = `http://localhost:3000${finalImageUrl}`;
      }
      const response = await fetch("/generatevideo/quotetemplatewchoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote,
          author,
          imageurl: finalImageUrl,
          fontsize: fontSize,
          fontcolor: fontColor,
          fontfamily: fontFamily,
          format: format,
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
      <SideNavTrial
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
              background:"#ddd",
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
            🎬 Quote Spotlight Template
          </h2>

          {activeSection === "quote" && (
            <QuoteSecTrial
              author={author}
              quote={quote}
              setAuthor={setAuthor}
              setQuote={setQuote}
              handleAISuggestion={handleAISuggestion}
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
            <TypographySectionQuote
              fontColor={fontColor}
              fontFamily={fontFamily}
              fontSize={fontSize}
              setFontColor={setFontColor}
              setFontFamily={setFontFamily}
              setFontSize={setFontSize}
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
        previewScale={previewSize}
        onPreviewScaleChange={setPreviewSize}
        onToggleSafeMargins={setShowSafeMargins}
      />
    </div>
  );
};
