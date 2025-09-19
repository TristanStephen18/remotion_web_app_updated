// import React, { useState, useRef, useEffect } from "react";
// // import { DisplayerModal } from "../Global/modal";
// import { SideNavTrial } from "./sidenav";
// import { QuoteSecTrial } from "./sidenav_sections/quote";
// import { BackgroundSecTrial } from "../Global/sidenav_sections/bg";
// import { OptionSectionTrial } from "../Global/sidenav_sections/options";
// // import { ExportSecTrial } from "../Global/sidenav_sections/export";
// import { QuoteSpotlightPreview } from "../../layout/EditorPreviews/QuoteTemplatePreview";
// import { TypographySectionQuote } from "./sidenav_sections/typo";
// import { defaultpanelwidth } from "../../../data/defaultvalues";
// import { TemplateOptionsSection } from "../Global/templatesettings";
// import {
//   fontSizeIndicatorQuote,
//   quoteSpotlightDurationCalculator,
// } from "../../../utils/quotespotlighthelpers";
// import type { QuoteConfigDataset } from "../../../models/QuoteSpotlight";
// import { AiSetupPanel } from "./sidenav_sections/aisetup";
// import { EditIcon, SaveIcon } from "lucide-react";
// import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import { Button, Typography } from "@mui/material";

// // import CloseIcon from "@mui/icons-material/Close";
// import { ExportModal } from "../../layout/modals/exportmodal";

// export const TopNav: React.FC<{
//   templateName: string;
//   setTemplateName: (name: string) => void;
//   onSwitchMode: () => void;
//   onSave: () => void;
//   onExport: (format: string) => void; // still used for triggering actual export
//   onOpenExport: () => void; // NEW: open export modal
// }> = ({
//   templateName,
//   setTemplateName,
//   onSwitchMode,
//   onSave,
//   onExport,
//   onOpenExport,
// }) => {
//   return (
//     <div
//       style={{
//         height: "60px",
//         background: "#fff",
//         borderBottom: "1px solid #eee",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         padding: "0 1.5rem",
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: 1000,
//       }}
//     >
//       {/* Left - Logo + Project Name */}
//       <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//         <Typography
//           variant="h6"
//           sx={{
//             fontWeight: "bold",
//             background:
//               "linear-gradient(to right, #d81b60 0%, #d81b60 70%, #42a5f5 100%)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             backgroundClip: "text",
//             textFillColor: "transparent",
//           }}
//         >
//           ViralMotion Creator
//         </Typography>

//         {/* Project name input with pencil */}
//         <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
//           <input
//             type="text"
//             value={templateName}
//             onChange={(e) => setTemplateName(e.target.value)}
//             style={{
//               border: "none",
//               borderBottom: "1px solid black",
//               fontSize: "1rem",
//               fontWeight: 500,
//               outline: "none",
//               background: "transparent",
//               minWidth: "250px",
//             }}
//           />
//           <EditIcon
//             style={{ fontSize: "1.1rem", color: "#888", cursor: "pointer" }}
//           />
//         </div>
//       </div>

//       {/* Right - Switch Mode + Save + Export + Profile */}
//       <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
//         <Button
//           variant="outlined"
//           startIcon={<SwapHorizIcon />}
//           onClick={onSwitchMode}
//           sx={{
//             borderRadius: 2,
//             textTransform: "none",
//             fontWeight: 600,
//             borderColor: "#d81b60",
//             color: "#d81b60",
//             "&:hover": { borderColor: "#42a5f5", color: "#42a5f5" },
//           }}
//         >
//           Batch Output Mode
//         </Button>

//         <Button
//           variant="outlined"
//           startIcon={<SaveIcon />}
//           onClick={onSave}
//           sx={{
//             borderRadius: 2,
//             textTransform: "none",
//             fontWeight: 600,
//             borderColor: "#d81b60",
//             color: "#d81b60",
//             "&:hover": { borderColor: "#42a5f5", color: "#42a5f5" },
//           }}
//         >
//           Save
//         </Button>

//         <Button
//           variant="outlined"
//           startIcon={<FileDownloadIcon />}
//           onClick={onOpenExport} // ✅ now just opens parent modal
//           sx={{
//             borderRadius: 2,
//             textTransform: "none",
//             fontWeight: 600,
//             borderColor: "#d81b60",
//             color: "#d81b60",
//             "&:hover": { borderColor: "#42a5f5", color: "#42a5f5" },
//           }}
//         >
//           Export
//         </Button>

//         <div
//           style={{
//             width: "32px",
//             height: "32px",
//             borderRadius: "50%",
//             background: "#ccc",
//           }}
//         />
//       </div>
//     </div>
//   );
// };




// export const QuoteTemplateEditor2: React.FC = () => {
//   // 🔹 State
//   const [aiMessage, setAiMessage] = useState<string | null>(null);
//   const [aiSetupData, setAiSetupData] = useState<QuoteConfigDataset>();
//   const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
//   const [isSettingUp, setIsSettingUp] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [previewSize, setPreviewSize] = useState(1);
//   const [templateName, setTemplateName] = useState(
//     "🎬 Quote Spotlight Template"
//   );
//   const [quote, setQuote] = useState("Your Quote");
//   const [author, setAuthor] = useState("Author");
//   const [backgroundImage, setBackgroundImage] = useState(
//     "http://localhost:3000/bgimages/colors/bg1.jpg"
//   );
//   const [backgroundSource, setBackgroundSource] = useState<
//     "upload" | "default"
//   >("default");
//   const [fontFamily, setFontFamily] = useState("Cormorant Garamond, serif");
//   const [fontColor, setFontColor] = useState("white");
//   const [fontSize, setFontSize] = useState(1);
//   const [showSafeMargins, setShowSafeMargins] = useState(true);
//   const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
//   const [activeSection, setActiveSection] = useState<
//     | "quote"
//     | "background"
//     | "typography"
//     | "ai"
   
//   >("quote");
//   const [collapsed, setCollapsed] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportUrl, setExportUrl] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState(false);

//   const [autoSave, setAutoSave] = useState(false);
//   const [panelWidth, setPanelWidth] = useState(defaultpanelwidth);
//   const [isResizing, setIsResizing] = useState(false);
//   const panelRef = useRef<HTMLDivElement | null>(null);
//   const [duration, setDuration] = useState(9);

//   // 🔹 Drag handling
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isResizing) return;
//       const newWidth =
//         e.clientX - (panelRef.current?.getBoundingClientRect().left || 0);
//       if (newWidth > 200 && newWidth < 600) {
//         setPanelWidth(newWidth);
//       }
//     };
//     const handleMouseUp = () => setIsResizing(false);
//     if (isResizing) {
//       window.addEventListener("mousemove", handleMouseMove);
//       window.addEventListener("mouseup", handleMouseUp);
//     }
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isResizing]);

//   // 🔹 Duration calc
//   useEffect(() => {
//     setDuration(quoteSpotlightDurationCalculator(quote.length));
//   }, [quote]);

//   // 🔹 Actions
//   const onSwitchMode = () => {
//     console.log("Entering Batch Rendering Mode");
//     window.location.assign("/template/quotetemplate/mode/batchrendering");
//   };
//   const handleSave = () => {
//     alert("✅ Project saved!");
//   };

//   const handleExport = async (format: string) => {
//     setIsExporting(true);
//     try {
//       let finalImageUrl = backgroundImage;
//       const origin = window.location.origin;
//       if (!finalImageUrl.startsWith(origin)) {
//         finalImageUrl = `${origin}${finalImageUrl}`;
//       }

//       const response = await fetch("/generatevideo/quotetemplatewchoices", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           quote,
//           author,
//           imageurl: finalImageUrl,
//           fontsize: fontSize,
//           fontcolor: fontColor,
//           fontfamily: fontFamily,
//           format,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(await response.text());
//       }

//       const data = await response.json();
//       setExportUrl(data.url);
//       setShowModal(true); // auto-open on export complete
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert(`Export failed: ${error || "Please try again."}`);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flex: 1,
//         height: "100%",
//       }}
//     >
//       {/* 🔹 Top Navigation */}
//       <TopNav
//         templateName={templateName}
//         onSwitchMode={onSwitchMode}
//         onSave={handleSave}
//         onExport={handleExport}
//         setTemplateName={setTemplateName}
//         onOpenExport={() => setShowModal(true)}
//       />

//       <div style={{ display: "flex", flex: 1, marginTop: "60px" }}>
//         {/* modal */}
//         {showModal && (
//           <ExportModal
//             showExport={showModal}
//             setShowExport={setShowModal}
//             isExporting={isExporting}
//             exportUrl={exportUrl}
//             onExport={handleExport}
//           />
//         )}

//         {/* sidenav */}
//         <SideNavTrial
//           activeSection={activeSection}
//           collapsed={collapsed}
//           setActiveSection={setActiveSection}
//           setCollapsed={setCollapsed}
//         />

//         {/* Controls Panel */}
//         {!collapsed && (
//           <div
//             ref={panelRef}
//             style={{
//               width: `${panelWidth}px`,
//               padding: "2rem",
//               overflowY: "auto",
//               background: "#fff",
//               borderRight: "1px solid #eee",
//               position: "relative",
//               transition: isResizing ? "#add" : "width 0.2s",
//             }}
//           >
//             {/* Drag Handle */}
//             <div
//               onMouseDown={() => setIsResizing(true)}
//               style={{
//                 position: "absolute",
//                 right: 0,
//                 top: 0,
//                 bottom: 0,
//                 width: "6px",
//                 cursor: "col-resize",
//                 background: "#ddd",
//               }}
//             />

//             {/* Sections */}
//             {activeSection === "quote" && (
//               <QuoteSecTrial
//                 author={author}
//                 quote={quote}
//                 setAuthor={setAuthor}
//                 setQuote={setQuote}
//                 handleAISuggestion={() => {}}
//                 isGenerating={isGenerating}
//               />
//             )}
//             {activeSection === "background" && (
//               <BackgroundSecTrial
//                 backgroundImage={backgroundImage}
//                 backgroundSource={backgroundSource}
//                 handleFileUpload={() => {}}
//                 isUploading={isUploading}
//                 setBackgroundImage={setBackgroundImage}
//                 setBackgroundSource={setBackgroundSource}
//               />
//             )}
//             {activeSection === "typography" && (
//               <TypographySectionQuote
//                 fontColor={fontColor}
//                 fontFamily={fontFamily}
//                 fontSize={fontSize}
//                 setFontColor={setFontColor}
//                 setFontFamily={setFontFamily}
//                 setFontSize={setFontSize}
//               />
//             )}
            
//             {activeSection === "ai" && (
//               <AiSetupPanel
//                 handleAiSetup={() => {}}
//                 isSettingUp={isSettingUp}
//                 selectedNiches={selectedNiches}
//                 setSelectedNiches={setSelectedNiches}
//                 aiMessage={aiMessage}
//               />
//             )}
            
//           </div>
//         )}

//         <QuoteSpotlightPreview
//           quote={quote}
//           author={author}
//           backgroundImage={backgroundImage}
//           fontSize={fontSize}
//           fontFamily={fontFamily}
//           fontColor={fontColor}
//           showSafeMargins={showSafeMargins}
//           previewBg={previewBg}
//           cycleBg={() => {}}
//           previewScale={previewSize}
//           onPreviewScaleChange={setPreviewSize}
//           onToggleSafeMargins={setShowSafeMargins}
//           duration={duration}
//         />
//       </div>
//     </div>
//   );
// };
