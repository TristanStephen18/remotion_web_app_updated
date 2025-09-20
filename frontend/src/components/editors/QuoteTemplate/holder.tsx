import React, { useState, useRef, useEffect } from "react";
import { SideNavTrial } from "./sidenav";
import { QuoteSecTrial } from "./sidenav_sections/quote";
import { BackgroundSecTrial } from "../Global/sidenav_sections/bg";
import { QuoteSpotlightPreview } from "../../layout/EditorPreviews/QuoteTemplatePreview";
import { TypographySectionQuote } from "./sidenav_sections/typo";
import { defaultpanelwidth } from "../../../data/defaultvalues";
import {
  fontSizeIndicatorQuote,
  quoteSpotlightDurationCalculator,
} from "../../../utils/quotespotlighthelpers";
import type { QuoteConfigDataset } from "../../../models/QuoteSpotlight";
import { AiSetupPanel } from "./sidenav_sections/aisetup";
import { ExportModal } from "../../layout/modals/exportmodal";
// import { TopNavWithoutBatchrendering } from "../../navigations/single_editors/withoutswitchmodesbutton";
import { useProjectSave } from "../../../hooks/saveproject";
import { useParams } from "react-router-dom";
import { TopNavWithSave } from "../../navigations/single_editors/withsave";
import { LoadingOverlay } from "../../layout/modals/loadingprojectmodal";
import { SaveProjectModal } from "../../layout/modals/savemodal";

export const QuoteTemplateEditor: React.FC = () => {
  const { id } = useParams();
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const [aiSetupData, setAiSetupData] = useState<QuoteConfigDataset>();
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewSize, setPreviewSize] = useState(1);
  const [templateName, setTemplateName] = useState(
    "My Quote Spotlight Template"
  );

  const [quote, setQuote] = useState("Your Quote");
  const [author, setAuthor] = useState("Author");
  const [backgroundImage, setBackgroundImage] = useState(
    `/bgimages/colors/bg1.jpg`
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
    "quote" | "background" | "typography" | "ai"
  >("quote");
  const [collapsed, setCollapsed] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  // const [autoSave, setAutoSave] = useState(false);

  // 🔹 Resizable panel state
  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth); // default width
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(9);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    const saved = localStorage.getItem("quoteTemplateEditorState");

    if (id) {
      // 🟢 Load project from backend
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
          // restore from backend
          setQuote(data.props.quote);
          setAuthor(data.props.author);
          setBackgroundImage(data.props.imageurl);
          setFontFamily(data.props.fontfamily ?? "Cormorant Garamond, serif");
          setFontColor(data.props.fontcolor ?? "white");
          setFontSize(data.props.fontsize ?? 1);
          setDuration(data.props.duration);

          // 🟢 Overlay any unsaved local edits
          if (saved) {
            const parsed = JSON.parse(saved);
            Object.entries(parsed).forEach(([key, value]) => {
              if (value !== undefined) {
                // @ts-ignore safely apply matching state
                if (
                  typeof eval(
                    `set${key.charAt(0).toUpperCase() + key.slice(1)}`
                  ) === "function"
                ) {
                  eval(
                    `set${key.charAt(0).toUpperCase() + key.slice(1)}(value)`
                  );
                }
              }
            });
          }

          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    } else if (saved) {
      // 🟢 No project, just restore from localStorage
      const parsed = JSON.parse(saved);
      setQuote(parsed.quote);
      setAuthor(parsed.author);
      setBackgroundImage(parsed.backgroundImage);
      setFontFamily(parsed.fontFamily);
      setFontColor(parsed.fontColor);
      setFontSize(parsed.fontSize);
      setDuration(parsed.duration);
      setTemplateName(parsed.templateName ?? "My Quote Spotlight Template");
      setPreviewBg(parsed.previewBg ?? "dark");
      setPreviewSize(parsed.previewSize ?? 1);
      setCollapsed(parsed.collapsed ?? false);
      setActiveSection(parsed.activeSection ?? "quote");
      setShowSafeMargins(parsed.showSafeMargins ?? true);
    }
  }, [id]);

  const cycleBg = () => {
    if (previewBg === "dark") setPreviewBg("light");
    else if (previewBg === "light") setPreviewBg("grey");
    else setPreviewBg("dark");
  };

  useEffect(() => {
    setDuration(quoteSpotlightDurationCalculator(quote.length));
    console.log(duration);
  }, [quote]);

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

  const handleAiSetup = async () => {
    // setIsSettingUp(true);
    setAiMessage(null);

    if (selectedNiches.length === 0) {
      // aiMessage = "";
      setAiMessage("You must select a niche first");
      return;
    } else {
      setIsSettingUp(true);
      try {
        const response = await fetch("/api/setup/quotetemplate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            preferences: selectedNiches,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        const result = await response.json();
        const configdata: QuoteConfigDataset = result.data;
        setAiSetupData(configdata);

        // Simulate AI stepping through panels
        const steps: { section: typeof activeSection; action: () => void }[] = [
          {
            section: "quote",
            action: () => {
              setFontSize(fontSizeIndicatorQuote(configdata.quote.length));
              setQuote(configdata.quote);
              setAuthor(configdata.author);
            },
          },
          {
            section: "background",
            action: () => {
              setBackgroundImage(configdata.backgroundImage);
              setBackgroundSource("default");
            },
          },
          {
            section: "typography",
            action: () => {
              setFontFamily(configdata.fontFamily);
              setFontColor(configdata.fontColor);
            },
          },
        ];

        let stepIndex = 0;
        const interval = setInterval(() => {
          if (stepIndex < steps.length) {
            const { section, action } = steps[stepIndex];
            setActiveSection(section);
            action();
            stepIndex++;
          } else {
            clearInterval(interval);
            setActiveSection("ai");
            setAiMessage(
              "✅ AI has completed setting up your template based on your selected niches!"
            );
            setIsSettingUp(false);
          }
        }, 1500); // 1.5s delay between each panel
      } catch (err: any) {
        console.error(err.message);
        setIsSettingUp(false);
      }
    }
  };

  const handleAISuggestion = async () => {
    setIsGenerating(true);
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
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: string) => {
    // const multiplier = (fontSize - 100) / 10 + 1;
    setIsExporting(true);
    // console.log(backgroundImage)

    try {
      let finalImageUrl = backgroundImage;
      const origin = `${window.location.origin}`;
      if (!finalImageUrl.startsWith(origin)) {
        finalImageUrl = `${origin}${finalImageUrl}`;
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
      console.log(data.job);
      console.log(data.url);
      setExportUrl(data.url);
      setShowModal(true);
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Export failed: ${error || "Please try again."}`);
    } finally {
      setIsExporting(false);
    }
  };

  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "⏳ Preparing your template...",

    "🙇 Sorry for the wait, still working on it...",
    "🚀 Almost there, thanks for your patience!",
  ];

  // 🟢 Cycle loader messages every 10s
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [isLoading]);

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
    templateId: 1,
    buildProps: () => ({
      quote,
      author,
      imageurl: backgroundImage.startsWith("http")
        ? backgroundImage
        : `${window.location.origin}${backgroundImage}`,

      fontsize: fontSize,
      fontcolor: fontColor,
      fontfamily: fontFamily,
      duration,
    }),
    videoEndpoint: "/generatevideo/quotetemplatewchoices",
  });
  // 🟢 Build one object representing ALL state you want persisted locally
  const editorState = {
    templateName,
    quote,
    author,
    backgroundImage,
    backgroundSource,
    fontFamily,
    fontColor,
    fontSize,
    showSafeMargins,
    previewBg,
    activeSection,
    collapsed,
    previewSize,
    duration,
  };
  

  // 🟢 Sync to localStorage on every change
  useEffect(() => {
    localStorage.setItem(
      "quoteTemplateEditorState",
      JSON.stringify(editorState)
    );
  }, [editorState]);

  return (
    <div style={{ display: "flex", height: "100%", flex: 1 }}>
      {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

      {/* modal */}
      <TopNavWithSave
        templateName={templateName}
        // onSwitchMode={onSwitchMode}
        onSave={handleSave}
        onExport={handleExport}
        setTemplateName={setTemplateName}
        onOpenExport={() => setShowModal(true)}
        template="🎬 Quote Spotlight Template"
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
              padding: "1rem",
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

            {activeSection === "quote" && (
              <QuoteSecTrial
                author={author}
                quote={quote}
                setAuthor={setAuthor}
                setQuote={setQuote}
                handleAISuggestion={handleAISuggestion}
                isGenerating={isGenerating}
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

            {activeSection === "ai" && (
              <AiSetupPanel
                handleAiSetup={handleAiSetup}
                isSettingUp={isSettingUp}
                selectedNiches={selectedNiches}
                setSelectedNiches={setSelectedNiches}
                aiMessage={aiMessage}
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
          duration={duration}
        />
      </div>
    </div>
  );
};
