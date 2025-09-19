import React from "react";
import { fontOptions } from "../../../../data/fonts";

 const cardStyle = (active: boolean): React.CSSProperties => ({
    flex: "1 1 calc(33% - 1rem)",
    minWidth: "140px",
    padding: "0.8rem",
    borderRadius: "10px",
    border: active ? "2px solid #0077ff" : "1px solid #ddd",
    background: active
      ? "linear-gradient(135deg, #0077ff22, #ffffff)"
      : "#fafafa",
    cursor: "pointer",
    boxShadow: active
      ? "0 4px 10px rgba(0, 119, 255, 0.2)"
      : "0 2px 6px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease",
    textAlign: "center",
  });

export const RedditTypoGraphy: React.FC<{
  fontFamily: string;
  setFontFamily: React.Dispatch<React.SetStateAction<string>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  fontColor: string;
  setFontColor: React.Dispatch<React.SetStateAction<string>>;
  sentenceBgColor: string;
  setSentenceBgColor: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  fontColor,
  setFontColor,
  sentenceBgColor,
  setSentenceBgColor,
}) => {
  const isNone = sentenceBgColor === "transparent";

  return (
    <div
      style={{
        padding: "1rem",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(12,24,48,0.06)",
        border: "1px solid #eef2ff",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        // height: "100%",
        boxSizing: "border-box",
        marginBottom: '1rem'
      }}
    >
      <h3 style={{ marginBottom: 8, color: "#0b63ff" }}>🖌️ Style Settings</h3>

      <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ marginBottom: "0.75rem", color: "#ff4fa3", fontWeight: 600 }}>
                Font Family
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                {fontOptions.map((font) => (
                  <div
                    key={font.value}
                    onClick={() => setFontFamily(font.value)}
                    style={cardStyle(fontFamily === font.value)}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontFamily: font.value,
                        fontSize: "1rem",
                        fontWeight: 600,
                      }}
                    >
                      {font.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

      {/* Font Size */}
      <div>
        <label
          style={{ display: "block", fontSize: 13, marginBottom: 6, color: "#333" }}
        >
          Font Size ({fontSize}px)
        </label>
        <input
          type="range"
          min={16}
          max={72}
          step={1}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* Font Color */}
      <div>
        <label
          style={{ display: "block", fontSize: 13, marginBottom: 6, color: "#333" }}
        >
          Font Color
        </label>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
          style={{
            width: "100%",
            height: 40,
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        />
      </div>

      {/* Sentence Background Color */}
      <div>
        <label
          style={{ display: "block", fontSize: 13, marginBottom: 6, color: "#333" }}
        >
          Sentence Background
        </label>

        {/* Radio buttons to switch modes */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
          <label style={{ fontSize: 13, color: "#333" }}>
            <input
              type="radio"
              name="sentenceBg"
              checked={!isNone}
              onChange={() => {
                if (isNone) {
                  // default to orange when switching back
                  setSentenceBgColor("#ff8c00");
                }
              }}
              style={{ marginRight: 6 }}
            />
            Custom Color
          </label>

          <label style={{ fontSize: 13, color: "#333" }}>
            <input
              type="radio"
              name="sentenceBg"
              checked={isNone}
              onChange={() => setSentenceBgColor("transparent")}
              style={{ marginRight: 6 }}
            />
            None
          </label>
        </div>

        {/* Color picker (disabled when "None" is selected) */}
        <input
          type="color"
          value={isNone ? "#ffffff" : sentenceBgColor}
          disabled={isNone}
          onChange={(e) => setSentenceBgColor(e.target.value)}
          style={{
            width: "100%",
            height: 40,
            border: "none",
            borderRadius: 8,
            cursor: isNone ? "not-allowed" : "pointer",
            opacity: isNone ? 0.5 : 1,
          }}
        />
      </div>
    </div>
  );
};
