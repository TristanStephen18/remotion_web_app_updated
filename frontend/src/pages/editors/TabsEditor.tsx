import React, { useState } from "react";
import { QuoteComposition } from "../../components/remotion_compositions/QuoteTemplate";

export const QuoteEditorTabs: React.FC = () => {
  const [quote, setQuote] = useState("The best way to predict the future is to invent it.");
  const [author, setAuthor] = useState("Alan Kay");
  const [backgroundImage, setBackgroundImage] = useState("https://picsum.photos/1080/1920");
  const [fontFamily, setFontFamily] = useState("Cormorant Garamond, serif");
  const [fontColor, setFontColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(20);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<"quote" | "background" | "typography" | "options">("quote");

  // Cycle preview background
  const cycleBg = () => setPreviewBg(previewBg === "dark" ? "light" : "dark");

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fafafa" }}>
      {/* Panel */}
      <div style={{ width: "420px", display: "flex", flexDirection: "column", background: "#fff", borderRight: "1px solid #eee" }}>
        
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #eee" }}>
          {["quote", "background", "typography", "options"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                flex: 1,
                padding: "1rem",
                cursor: "pointer",
                background: activeTab === tab ? "#f5f5f5" : "transparent",
                border: "none",
                borderBottom: activeTab === tab ? "3px solid #0077ff" : "3px solid transparent",
                fontWeight: 600
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {activeTab === "quote" && (
            <>
              <h3>Quote</h3>
              <textarea value={quote} onChange={(e) => setQuote(e.target.value)} style={{ width: "100%" }} />
              <input value={author} onChange={(e) => setAuthor(e.target.value)} style={{ width: "100%", marginTop: "0.5rem" }} />
            </>
          )}
          {activeTab === "background" && (
            <>
              <h3>Background</h3>
              <input value={backgroundImage} onChange={(e) => setBackgroundImage(e.target.value)} style={{ width: "100%" }} />
            </>
          )}
          {activeTab === "typography" && (
            <>
              <h3>Typography</h3>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} style={{ width: "100%" }}>
                <option value="Cormorant Garamond, serif">Cormorant Garamond</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Lora, serif">Lora</option>
              </select>
              <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} style={{ width: "100%", marginTop: "0.5rem" }} />
              <input type="range" min={12} max={48} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={{ width: "100%", marginTop: "0.5rem" }} />
            </>
          )}
          {activeTab === "options" && (
            <>
              <h3>Options</h3>
              <label>
                <input type="checkbox" checked={showSafeMargins} onChange={(e) => setShowSafeMargins(e.target.checked)} />
                Show Safe Margins
              </label>
            </>
          )}
        </div>
      </div>

      {/* Preview */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", background: previewBg === "dark" ? "#000" : "#f0f0f0", transition: "0.3s" }}>
        <button onClick={cycleBg} style={{ position: "absolute", bottom: "20px", right: "20px" }}>
          {previewBg === "dark" ? "🌞 Light" : "🌙 Dark"}
        </button>
        <div style={{ width: "270px", height: "480px", borderRadius: "24px", overflow: "hidden" }}>
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
