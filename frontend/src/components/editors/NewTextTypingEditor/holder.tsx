import React, { useState, useRef, useEffect } from "react";
import { DisplayerModal } from "../Global/modal";
import { ExportSecTrial } from "../Global/sidenav_sections/export";

import { defaultpanelwidth } from "../../../data/defaultvalues";
import { NewTypingTemplateSideNav } from "./sidenav";
import type { Phrase } from "../../../models/TextTyping";
import { calculateDuration } from "./durationcalculator";
import { NewTypingAnimationPreview } from "../../layout/EditorPreviews/NewTextTypingPreview";
import { PhraseSideNav } from "./sidenav_sections/phrase";
import { FontSideNavTextTyping } from "./sidenav_sections/fonts";
import { BackgroundSideNav } from "./sidenav_sections/backgrounds";
import { SoundSideNav } from "./sidenav_sections/sounds";

export const NewTypingEditor: React.FC = () => {
  const defaultphrasedata = {
    lines: ["Dream big, start small", "but start today"],
    category: "wisdom",
    mood: "iconic",
  };
  const [mood, setMood] = useState(defaultphrasedata.mood);
  const [category, setCategory] = useState(defaultphrasedata.category);
  const [phrase, setPhrase] = useState<string[]>(defaultphrasedata.lines);
  const [fontIndex, setFontIndex] = useState(1);
  const [phraseData, setPhraseData] = useState<Phrase>(defaultphrasedata);
  const [backgroundIndex, setBackgroundIndex] = useState(10);
  const [soundIndex, setSoundIndex] = useState(1);
  const [duration, setDuration] = useState(
    calculateDuration(defaultphrasedata)
  );
  //   const [aiprompt, setPrompt] = useState("");
  const [previewSize, setPreviewSize] = useState(1);

  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "phrase" | "fonts" | "background" | "sound" | "export"
  >("phrase");
  const [collapsed, setCollapsed] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);

  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  // const [autoSave, setAutoSave] = useState(false);

  // 🔹 Resizable panel state
  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth); // default width
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  //   console.log(duration);
  useEffect(() => {
    console.log("changes made in phrase data");
    setDuration(calculateDuration(phraseData));
  }, [phraseData]);

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

  const handleAISuggestion = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-phrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          mood,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }
      const data = await response.json();
      console.log(data.phrase);
      setPhrase(data.phrase.toString().replaceAll("'", "").split("\n"));
      // setTextContent(data.textcontent);
    } catch (error) {
      console.error("error generating ai suggestion");
      alert(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: string) => {
    setIsExporting(format);
    // console.log(fontSize);
    try {
      const response = await fetch("/generatevideo/newtexttypingrender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: phraseData,
          backgroundIndex,
          fontIndex,
          audioIndex: soundIndex,
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
      <NewTypingTemplateSideNav
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
          {activeSection === "phrase" && (
            <PhraseSideNav
              category={category}
              handleAISuggestion={handleAISuggestion}
              mood={mood}
              phrase={phrase}
              setCategory={setCategory}
              setMood={setMood}
              setPhrase={setPhrase}
              setPhraseData={setPhraseData}
              isGenerating={isGenerating}
            />
          )}
          {activeSection === "fonts" && (
            <FontSideNavTextTyping
              fontIndex={fontIndex}
              setFontIndex={setFontIndex}
            />
          )}
          {activeSection == "background" && (
            <BackgroundSideNav
              backgroundIndex={backgroundIndex}
              setBackgroundIndex={setBackgroundIndex}
            />
          )}

          {activeSection === "sound" && (
            <SoundSideNav
              setSoundIndex={setSoundIndex}
              soundIndex={soundIndex}
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
      <NewTypingAnimationPreview
        audioIndex={soundIndex}
        backgroundIndex={backgroundIndex}
        cycleBg={cycleBg}
        duration={duration}
        fontIndex={fontIndex}
        onPreviewScaleChange={setPreviewSize}
        onToggleSafeMargins={setShowSafeMargins}
        previewBg={previewBg}
        previewScale={previewSize}
        showSafeMargins={showSafeMargins}
        phraseData={phraseData}
      />
    </div>
  );
};
