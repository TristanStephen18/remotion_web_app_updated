import React, { useState, useRef, useEffect } from "react";
import { DisplayerModal } from "../Global/modal";
import { BackgroundSecTrial } from "../Global/sidenav_sections/bg";
import { ExportSecTrial } from "../Global/sidenav_sections/export";
import { TypingTemplateSideNav } from "./sidenav";
import { TextContentSection } from "./sidenav_sections/textcontent";
// import { OptionSectionTrial } from "../Global/sidenav_sections/options";
import { SoundAndDurationSection } from "./sidenav_sections/sound_and_duration";
import { TypographySection } from "../Global/sidenav_sections/typo";
import { TextTypingTemplatePreview } from "../../layout/EditorPreviews/TextTypingPreview";
import { defaultpanelwidth } from "../../../data/defaultvalues";

export const TypingEditor: React.FC = () => {
  const [textcontent, setTextContent] = useState("Your text");
  const [previewSize, setPreviewSize] = useState(1);
  const [soundUrl, setSoundUrl] = useState(
    "/soundeffects/texttyping/keyboard1.mp3"
  );
  const [duration, setDuration] = useState(3);
  const [aiprompt, setPrompt] = useState("");
  // const [quote, setQuote] = useState("Your Quote");
  // const [author, setAuthor] = useState("Author");
  const [backgroundImage, setBackgroundImage] = useState(
    "http://localhost:3000/bgimages/colors/bg1.jpg"
  );
  const [backgroundSource, setBackgroundSource] = useState<
    "upload" | "default"
  >("default");

  // const [error, setError] = useState(null);

  const [fontFamily, setFontFamily] = useState("Russo");
  const [fontColor, setFontColor] = useState("white");
  const [fontSize, setFontSize] = useState(68);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "background" | "typography" | "options" | "export" | "text" | "sound"
  >("text");
  const [collapsed, setCollapsed] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  // const [autoSave, setAutoSave] = useState(false);

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

  const handleAISuggestion = async () => {
    if (
      !aiprompt ||
      aiprompt === "" ||
      aiprompt === "Please enter a prompt here..."
    ) {
      setPrompt("Please enter a prompt here...");
    } else {
      try {
        const response = await fetch("/api/generate-textcontent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: aiprompt,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        const data = await response.json();
        setTextContent(data.textcontent);
      } catch (error) {
        console.error("error generating ai suggestion");
        alert(error);
      }
    }
  };

  const handleExport = async (format: string) => {
    // const multiplier = (fontSize - 20) / 10 + 1;
    setIsExporting(format);
    console.log(fontSize);
    // console.log(backgroundImage)

    try {
      let finalImageUrl = backgroundImage;
      if (!finalImageUrl.startsWith("http://localhost:3000")) {
        finalImageUrl = `http://localhost:3000${finalImageUrl}`;
      }
      const response = await fetch("/generatevideo/texttypingrender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: textcontent,
          imageurl: finalImageUrl,
          fontsize: fontSize,
          fontcolor: fontColor,
          fontfamily: fontFamily,
          format: format,
          duration,
          soundurl: soundUrl,
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
    <div style={{ display: "flex", height: "100%", flex: 1}}>
      {/* modal */}
      {showModal && exportUrl && (
        <DisplayerModal exportUrl={exportUrl} setShowModal={setShowModal} />
      )}

      {/* sidenav */}
      <TypingTemplateSideNav
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
              background: "#ddd", // 👈 always visible
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
            🎬 Text Typing Template
          </h2>

          {activeSection === "text" && (
            <TextContentSection
              handleAISuggestion={handleAISuggestion}
              setTextContent={setTextContent}
              textcontent={textcontent}
              aiprompt={aiprompt}
              setPrompt={setPrompt}
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

          {activeSection === "sound" && (
            <SoundAndDurationSection
              duration={duration}
              setDuration={setDuration}
              setSoundUrl={setSoundUrl}
              soundUrl={soundUrl}
            />
          )}

          {activeSection === "typography" && (
            <TypographySection
              fontColor={fontColor}
              fontFamily={fontFamily}
              fontSize={fontSize}
              setFontColor={setFontColor}
              setFontFamily={setFontFamily}
              setFontSize={setFontSize}
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

      <TextTypingTemplatePreview
        backgroundImage={backgroundImage}
        content={textcontent}
        duration={duration}
        cycleBg={cycleBg}
        fontColor={fontColor}
        fontFamily={fontFamily}
        showSafeMargins={showSafeMargins}
        fontSize={fontSize}
        previewBg={previewBg}
        sound={soundUrl}
        fps={30}
        previewScale={previewSize}
        onPreviewScaleChange={setPreviewSize}
        onToggleSafeMargins={setShowSafeMargins}
      />
    </div>
  );
};
