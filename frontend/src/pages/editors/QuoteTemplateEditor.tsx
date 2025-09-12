import React, { useState } from "react";
import { QuoteComposition } from "../../components/remotion_compositions/QuoteTemplate";

export const QuoteEditor: React.FC = () => {
  const [quote, setQuote] = useState(
    "The best way to predict the future is to invent it."
  );
  const [author, setAuthor] = useState("Alan Kay");
  const [backgroundImage, setBackgroundImage] = useState(
    "https://picsum.photos/1080/1920"
  );
  const [fontFamily, setFontFamily] = useState("Cormorant Garamond, serif");
  const [fontColor, setFontColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(20);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [panelWidth, setPanelWidth] = useState(420);

  // Preview background options
//   const backgrounds: Array<"dark" | "light"> = ["dark", "light"];
const [previewBg, setPreviewBg] = useState<"dark" | "light">("dark");

  // Resizing logic
  const [isResizing, setIsResizing] = useState(false);
  const startResizing = () => setIsResizing(true);
  const stopResizing = () => setIsResizing(false);
  const resize = (e: MouseEvent) => {
    if (isResizing) {
      setPanelWidth(Math.min(Math.max(e.clientX, 300), 600));
    }
  };
  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  // Cycle background colors
  const cycleBg = () => {
  setPreviewBg(previewBg === "dark" ? "light" : "dark");
};

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fafafa" }}>
      {/* 🎛️ Controls Panel */}
      <div
        style={{
          width: `${panelWidth}px`,
          padding: "2rem",
          background: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          overflowY: "auto",
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
          🎬 Quote Editor
        </h2>

        {/* Quote Section */}
        {/* --- Quote Section --- */}
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
          <label style={{ display: "block", marginBottom: "0.75rem" }}>
            <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
              Quote
            </div>
            <textarea
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: "#fafafa",
                fontSize: "0.95rem",
              }}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
            />
          </label>
          <label style={{ display: "block" }}>
            <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
              Author
            </div>
            <input
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: "#fafafa",
                fontSize: "0.95rem",
              }}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </label>
        </div>

        {/* --- Background Section --- */}
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
          <label style={{ display: "block" }}>
            <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
              Image URL
            </div>
            <input
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: "#fafafa",
              }}
              value={backgroundImage}
              onChange={(e) => setBackgroundImage(e.target.value)}
            />
          </label>
        </div>

        {/* --- Typography Section --- */}
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
            Typography
          </h3>

          {/* Font Family */}
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
              <option value="Playfair Display, serif">Playfair Display</option>
              <option value="Merriweather, serif">Merriweather</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Open Sans, sans-serif">Open Sans</option>
              <option value="Lora, serif">Lora</option>
            </select>
          </label>

          {/* Font Color */}
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

          {/* Font Size */}
          <label style={{ display: "block" }}>
            <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
              Font Size ({fontSize}px)
            </div>
            <input
              type="range"
              min={12}
              max={48}
              step={1}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </label>
        </div>

        {/* --- Options --- */}
        <div
          style={{
            padding: "1rem",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            border: "1px solid #eee",
          }}
        >
          <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>Options</h3>
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
      </div>

      {/* Resize Handle */}
      <div
        style={{
          width: "6px",
          cursor: "col-resize",
          background: isResizing ? "#0077ff" : "#eee",
        }}
        onMouseDown={startResizing}
      />

      {/* 🎥 Preview */}
      <div
  style={{
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: previewBg === "dark" ? "#000" : "#f0f0f0",
    transition: "background 0.3s",
    position: "relative",
  }}
>
  {/* Floating Toggle for Background Modes */}
  <button
    onClick={cycleBg}
    style={{
      position: "absolute",
      bottom: "20px",
      right: "20px",
      padding: "0.6rem 1rem",
      borderRadius: "30px",
      border: "none",
      cursor: "pointer",
      color: "white",
      fontWeight: 600,
      background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    }}
  >
    {previewBg === "dark" ? "🌞 Light" : "🌙 Dark"}
  </button>


        {/* Phone Frame */}
        <div
          style={{
            width: "270px",
            height: "480px",
            background: "#000",
            border: "3px solid #222",
            borderRadius: "24px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <QuoteComposition
            quote={quote}
            author={author}
            backgroundImage={backgroundImage}
            baseFontScale={fontSize / 20}
            fontFamilyOverride={fontFamily}
            fontColor={fontColor}
            showSafeMargins={showSafeMargins}
          />
        </div>
      </div>
    </div>
  );
};
