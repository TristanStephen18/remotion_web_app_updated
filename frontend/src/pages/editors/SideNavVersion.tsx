import React, { useState } from "react";
// import { QuoteComposition } from "../../components/remotion_compositions/QuoteTemplate";

// ✅ MUI Icons
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ImageIcon from "@mui/icons-material/Image";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import SettingsIcon from "@mui/icons-material/Settings";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PlayerDisplay from "../../components/layout/PreviewPanel";

export const QuoteEditorSideNav: React.FC = () => {
  const [quote, setQuote] = useState("Your Quote");
  const [author, setAuthor] = useState("Author");
  const [backgroundImage, setBackgroundImage] = useState(
    "https://picsum.photos/1080/1920"
  );
  const [backgroundSource, setBackgroundSource] = useState<"url" | "upload">(
    "url"
  );

  const [fontFamily, setFontFamily] = useState("Cormorant Garamond, serif");
  const [fontColor, setFontColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(20);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "quote" | "background" | "typography" | "options" | "export"
  >("quote");
  const [collapsed, setCollapsed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Cycle preview background
  const cycleBg = () => {
    if (previewBg === "dark") setPreviewBg("light");
    else if (previewBg === "light") setPreviewBg("grey");
    else setPreviewBg("dark");
  };

  const [isExporting, setIsExporting] = useState(false);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/generatevideo/upload-image", {
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

  const handleExportMP4 = async () => {
    const multiplier = (fontSize - 20) / 10 + 1;
    setIsExporting(true);

    try {
      const response = await fetch("/generatevideo/quotetemplate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote,
          author,
          imageurl: backgroundImage,
          fontsize: multiplier,
          fontcolor: fontColor,
          fontfamily: fontFamily,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Video exported successfully:", data.url);

      // 🎬 show modal with video preview
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
    <div style={{ display: "flex", height: "100vh", background: "#fafafa" }}>
      {showModal && exportUrl && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "1.5rem",
              borderRadius: "12px",
              width: "430px", // 🔹 smaller modal
              maxWidth: "95%",
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <h2
              style={{
                marginBottom: "1rem",
                color: "#0077ff",
                fontSize: "1.2rem",
              }}
            >
              🎉 Your Video is Ready!
            </h2>

            <video
              src={exportUrl}
              controls
              style={{
                width: "100%",
                maxHeight: "50vh", // 🔹 smaller video height
                borderRadius: "8px",
                marginBottom: "1rem",
                background: "#000",
                objectFit: "contain",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
              }}
            >
              <a
                href={exportUrl}
                download="quote-video.mp4"
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
                  color: "#fff",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                }}
              >
                ⬇️ Download
              </a>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ccc",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                ✖ Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          width: collapsed ? "60px" : "180px",
          background: "#fff",
          borderRight: "1px solid #eee",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            padding: "0.75rem",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </button>

        {/* Nav Items */}
        {[
          { key: "quote", label: "Quote", icon: <FormatQuoteIcon /> },
          { key: "background", label: "Background", icon: <ImageIcon /> },
          { key: "typography", label: "Typography", icon: <TextFieldsIcon /> },
          { key: "options", label: "Options", icon: <SettingsIcon /> },
          { key: "export", label: "Export", icon: <FileDownloadIcon /> },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key as any)}
            style={{
              padding: "1rem",
              textAlign: "left",
              border: "none",
              background: activeSection === key ? "#f5f5f5" : "transparent",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: collapsed ? "0" : "0.5rem",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            {icon}
            {!collapsed && label}
          </button>
        ))}
      </div>

      {/* Controls Panel */}
      {!collapsed && (
        <div
          style={{
            width: "320px",
            padding: "2rem",
            overflowY: "auto",
            background: "#fff",
            borderRight: "1px solid #eee",
          }}
        >
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

          {/* --- Quote Section --- */}
          {activeSection === "quote" && (
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                border: "1px solid #eee",
              }}
            >
              <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
                Quote Content
              </h3>
              <label style={{ display: "block", marginBottom: "1rem" }}>
                <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
                  Quote
                </div>
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    background: "#fafafa",
                  }}
                />
              </label>
              <label style={{ display: "block", marginBottom: "1rem" }}>
                <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
                  Author
                </div>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    background: "#fafafa",
                  }}
                />
              </label>

              {/* 🚀 Generate AI Quote Button */}
              <button
                onClick={() => {
                  // placeholder: replace with your AI logic
                  setQuote("Your limitation—it’s only your imagination.");
                  setAuthor("Unknown");
                }}
                style={{
                  marginTop: "0.75rem",
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  fontWeight: 600,
                  background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  width: "100%",
                }}
              >
                ✨ Generate Quote using AI
              </button>
            </div>
          )}

          {/* --- Background Section --- */}
          {activeSection === "background" && (
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                border: "1px solid #eee",
              }}
            >
              <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
                Background
              </h3>

              {/* Choice Toggle */}
              <div
                style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="radio"
                    checked={backgroundSource === "url"}
                    onChange={() => setBackgroundSource("url")}
                  />
                  Use URL
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="radio"
                    checked={backgroundSource === "upload"}
                    onChange={() => setBackgroundSource("upload")}
                  />
                  Upload
                </label>
              </div>

              {/* URL input */}
              {backgroundSource === "url" && (
                <label style={{ display: "block" }}>
                  <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
                    Image URL
                  </div>
                  <input
                    value={backgroundImage}
                    onChange={(e) => setBackgroundImage(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      background: "#fafafa",
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                </label>
              )}

              {/* Upload input */}
              {backgroundSource === "upload" && (
                <>
                  <label
                    style={{
                      display: "block",
                      padding: "0.6rem 1rem",
                      borderRadius: "8px",
                      cursor: isUploading ? "not-allowed" : "pointer",
                      color: "white",
                      fontWeight: 600,
                      background: isUploading
                        ? "#ccc"
                        : "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      textAlign: "center",
                      opacity: isUploading ? 0.7 : 1,
                    }}
                  >
                    {isUploading
                      ? "🔄 Uploading..."
                      : "📤 Upload Background Image"}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      disabled={isUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file);
                        }
                      }}
                    />
                  </label>

                  {/* Show current image preview */}
                  {backgroundImage &&
                    !backgroundImage.startsWith("https://picsum.photos") && (
                      <div style={{ marginTop: "1rem" }}>
                        <div
                          style={{
                            marginBottom: "0.3rem",
                            color: "#ff4fa3",
                            fontSize: "0.9rem",
                          }}
                        >
                          Current Image:
                        </div>
                        <img
                          src={backgroundImage}
                          alt="Background preview"
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                          }}
                        />
                      </div>
                    )}
                </>
              )}
            </div>
          )}

          {activeSection === "typography" && (
            <div
              style={{
                padding: "1rem",
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                border: "1px solid #eee",
              }}
            >
              <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
                Typography
              </h3>
              <label style={{ display: "block", marginBottom: "1rem" }}>
                <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
                  Font Family
                </div>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    background: "#fafafa",
                  }}
                >
                  <option value="Cormorant Garamond, serif">
                    Cormorant Garamond
                  </option>
                  <option value="Playfair Display, serif">
                    Playfair Display
                  </option>
                  <option value="Merriweather, serif">Merriweather</option>
                  <option value="Roboto, sans-serif">Roboto</option>
                  <option value="Open Sans, sans-serif">Open Sans</option>
                  <option value="Lora, serif">Lora</option>
                </select>
              </label>
              <label style={{ display: "block", marginBottom: "1rem" }}>
                <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
                  Font Color
                </div>
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </label>
              <label style={{ display: "block" }}>
                <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
                  Font Size ({fontSize}px)
                </div>
                <input
                  type="range"
                  min={20}
                  max={48}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </label>
            </div>
          )}

          {activeSection === "options" && (
            <div
              style={{
                padding: "1rem",
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                border: "1px solid #eee",
              }}
            >
              <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
                Options
              </h3>
              <label
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <input
                  type="checkbox"
                  checked={showSafeMargins}
                  onChange={(e) => setShowSafeMargins(e.target.checked)}
                />
                Show Safe Margins
              </label>
            </div>
          )}

          {activeSection === "export" && (
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                border: "1px solid #eee",
              }}
            >
              <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
                Export
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <button
                  onClick={handleExportMP4}
                  disabled={isExporting}
                  style={{
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "none",
                    background: isExporting
                      ? "#ccc"
                      : "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
                    color: "white",
                    fontWeight: 600,
                    cursor: isExporting ? "not-allowed" : "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    transition: "transform 0.2s",
                    opacity: isExporting ? 0.7 : 1,
                  }}
                  onMouseDown={(e) =>
                    !isExporting &&
                    (e.currentTarget.style.transform = "scale(0.96)")
                  }
                  onMouseUp={(e) =>
                    !isExporting &&
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {isExporting ? "🔄 Exporting..." : "🎥 Export as MP4"}
                </button>

                <button
                  onClick={() => alert("Exporting as GIF...")}
                  style={{
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "#ff4fa3",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    transition: "transform 0.2s",
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.96)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  🖼️ Export as GIF
                </button>

                <button
                  onClick={() => alert("Exporting as WebM...")}
                  style={{
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "#0077ff",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    transition: "transform 0.2s",
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.96)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  🌐 Export as WebM
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {
        <PlayerDisplay
          quote={quote}
          author={author}
          backgroundImage={backgroundImage}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fontColor={fontColor}
          showSafeMargins={showSafeMargins}
          previewBg={previewBg}
          cycleBg={cycleBg}
        />
      }
    </div>
  );
};
