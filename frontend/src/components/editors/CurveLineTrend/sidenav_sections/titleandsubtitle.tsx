import React from "react";
import { fontOptions } from "../../../../data/fonts";

interface TextPanelProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  subtitle: string;
  setSubtitle: React.Dispatch<React.SetStateAction<string>>;
  titleFontSize: number;
  setTitleFontSize: React.Dispatch<React.SetStateAction<number>>;
  subtitleFontSize: number;
  setSubtitleFontSize: React.Dispatch<React.SetStateAction<number>>;
  fontFamily: string;
  setFontFamily: React.Dispatch<React.SetStateAction<string>>;
}

export const CurveLineTextPanel: React.FC<TextPanelProps> = ({
  title,
  setTitle,
  subtitle,
  setSubtitle,
  titleFontSize,
  setTitleFontSize,
  subtitleFontSize,
  setSubtitleFontSize,
  setFontFamily,
  fontFamily,
}) => {
  const cardStyle: React.CSSProperties = {
    marginBottom: "1.5rem",
    padding: "1rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
    width: "100%",
    boxSizing: "border-box",
  };

  const cardStyleFont = (active: boolean): React.CSSProperties => ({
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

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "1rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fafafa",
    fontSize: 16,
    resize: "none" as const,
    boxSizing: "border-box",
  };

  const numberInputStyle: React.CSSProperties = {
    ...inputStyle,
    width: "100%",
    fontSize: 15,
  };

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      {/* Title Card */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>Title</h3>

        <label style={labelStyle}>
          <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>Text</div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
            Font Size
          </div>
          <input
            type="number"
            value={titleFontSize}
            onChange={(e) => setTitleFontSize(Number(e.target.value))}
            style={numberInputStyle}
          />
        </label>
      </div>

      {/* Subtitle Card */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>Subtitle</h3>

        <label style={labelStyle}>
          <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>Text</div>
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            style={{ ...inputStyle, minHeight: "80px" }}
          />
        </label>

        <label style={labelStyle}>
          <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
            Font Size
          </div>
          <input
            type="number"
            value={subtitleFontSize}
            onChange={(e) => setSubtitleFontSize(Number(e.target.value))}
            style={numberInputStyle}
          />
        </label>
      </div>
      {/* Font Family Selection */}
      <div style={cardStyle}>
        <div
          style={{ marginBottom: "0.75rem", color: "#ff4fa3", fontWeight: 600 }}
        >
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
              style={cardStyleFont(fontFamily === font.value)}
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
    </div>
  );
};
