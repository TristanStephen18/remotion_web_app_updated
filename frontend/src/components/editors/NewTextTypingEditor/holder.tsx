import React, { useState, useRef, useEffect } from "react";
import { defaultpanelwidth } from "../../../data/defaultvalues";
import { NewTypingTemplateSideNav } from "./sidenav";
import type { Phrase } from "../../../models/TextTyping";
import { calculateDuration } from "./durationcalculator";
import { NewTypingAnimationPreview } from "../../layout/EditorPreviews/NewTextTypingPreview";
import { PhraseSideNav } from "./sidenav_sections/phrase";
import { FontSideNavTextTyping } from "./sidenav_sections/fonts";
import { BackgroundSideNav } from "./sidenav_sections/backgrounds";
import { SoundSideNav } from "./sidenav_sections/sounds";
import { ExportModal } from "../../layout/modals/exportmodal";
import { TopNavWithSave } from "../../navigations/single_editors/withsave";
import { useProjectSave } from "../../../hooks/saveproject";
import { SaveProjectModal } from "../../layout/modals/savemodal";
import { LoadingOverlay } from "../../layout/modals/loadingprojectmodal";
import { useParams } from "react-router-dom";

export const NewTypingEditor: React.FC = () => {
  const { id } = useParams();
  const defaultphrasedata: Phrase = {
    lines: ["Dream big, start small", "but start today"],
    category: "wisdom",
    mood: "iconic",
  };

  const [templateName, setTemplateName] = useState("My Text Typing Template");

  const [mood, setMood] = useState(defaultphrasedata.mood);
  const [category, setCategory] = useState(defaultphrasedata.category);
  const [phrase, setPhrase] = useState<string[]>(defaultphrasedata.lines);
  const [phraseData, setPhraseData] = useState<Phrase>(defaultphrasedata);

  const [fontIndex, setFontIndex] = useState(1);
  const [backgroundIndex, setBackgroundIndex] = useState(10);
  const [soundIndex, setSoundIndex] = useState(1);
  const [duration, setDuration] = useState(calculateDuration(defaultphrasedata));

  const [previewSize, setPreviewSize] = useState(1);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "phrase" | "fonts" | "background" | "sound"
  >("phrase");
  const [collapsed, setCollapsed] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
        "⏳ Preparing your template...",

    "🙇 Sorry for the wait, still working on it...",
    "🚀 Almost there, thanks for your patience!",
  ];

  // 🟢 Auto recalc duration when phraseData changes
  useEffect(() => {
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

  // 🟢 Cycle loader messages every 10s
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // 🟢 Load project if opened from /projects/:id/editor
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

          setPhraseData(data.props.phrase ?? defaultphrasedata);
          setCategory(data.props.phrase?.category ?? "wisdom");
          setMood(data.props.phrase?.mood ?? "iconic");
          setPhrase(data.props.phrase?.lines ?? defaultphrasedata.lines);

          setFontIndex(data.props.fontIndex ?? 1);
          setBackgroundIndex(data.props.backgroundIndex ?? 10);
          setSoundIndex(data.props.audioIndex ?? 1);
          setDuration(data.props.duration);

          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    } else {
      // 🟢 fallback: load from localStorage
      const saved = localStorage.getItem("newTypingEditorState");
      if (saved) {
        const parsed = JSON.parse(saved);
        setPhraseData(parsed.phraseData ?? defaultphrasedata);
        setCategory(parsed.category);
        setMood(parsed.mood);
        setPhrase(parsed.phrase);
        setFontIndex(parsed.fontIndex);
        setBackgroundIndex(parsed.backgroundIndex);
        setSoundIndex(parsed.soundIndex);
        setDuration(parsed.duration);
        lastSavedProps.current = parsed;
      }
    }
  }, [id]);

  const cycleBg = () => {
    if (previewBg === "dark") setPreviewBg("light");
    else if (previewBg === "light") setPreviewBg("grey");
    else setPreviewBg("dark");
  };

  const handleAISuggestion = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-phrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, mood }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! ${response.status}, ${errorText}`);
      }
      const data = await response.json();
      setPhrase(data.phrase);
    } catch (error) {
      console.error("error generating ai suggestion");
      alert(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);
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
        throw new Error(`HTTP error! ${response.status}, ${errorText}`);
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

  // 🟢 Hook for saving/updating projects
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
    templateId: 2, // 👈 unique ID for text typing template
    buildProps: () => ({
      phrase: phraseData,
      backgroundIndex,
      fontIndex,
      audioIndex: soundIndex,
      duration,
    }),
    videoEndpoint: "/generatevideo/newtexttypingrender",
  });

  // 🟢 Persist state in localStorage
  useEffect(() => {
    const currentProps = {
      phraseData,
      category,
      mood,
      phrase,
      fontIndex,
      backgroundIndex,
      soundIndex,
      duration,
    };
    localStorage.setItem("newTypingEditorState", JSON.stringify(currentProps));

    if (projectId) {
      localStorage.setItem("projectId", projectId.toString());
    }
  }, [
    phraseData,
    category,
    mood,
    phrase,
    fontIndex,
    backgroundIndex,
    soundIndex,
    duration,
    projectId,
  ]);

  return (
    <div style={{ display: "flex", height: "100%", flex: 1 }}>
      {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

      <TopNavWithSave
        templateName={templateName}
        onSave={handleSave}
        onExport={handleExport}
        setTemplateName={setTemplateName}
        onOpenExport={() => setShowModal(true)}
        template="🎬 Text Typing Template"
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

        {/* Side Nav */}
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
              padding: "1rem",
              overflowY: "auto",
              background: "#fff",
              borderRight: "1px solid #eee",
              position: "relative",
              transition: isResizing ? "none" : "width 0.2s",
            }}
          >
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
            {activeSection === "background" && (
              <BackgroundSideNav
                backgroundIndex={backgroundIndex}
                setBackgroundIndex={setBackgroundIndex}
              />
            )}
            {activeSection === "sound" && (
              <SoundSideNav setSoundIndex={setSoundIndex} soundIndex={soundIndex} />
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
    </div>
  );
};
