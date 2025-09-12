import React from "react";
import { fontOptions } from "../../../../data/fonts";

export const CardStylingPanel: React.FC<{
  cardBorderColor: string;
  setCardBorderColor: (v: string) => void;
  cardFrontColor: string;
  setCardFrontColor: (v: string) => void;
  cardBackColor: string;
  setCardBackColor: (v: string) => void;
  cardLabelColor: string;
  setCardLabelColor: (v: string) => void;
  cardLabelFontSize: number;
  setCardLabelFontSize: (v: number) => void;
  cardContentFontFamily: string;
  setCardContentFontFamily: (v: string) => void;
  valueFontSize: number;
  setValueFontSize: (v: number) => void;
}> = ({
  cardBorderColor,
  setCardBorderColor,
  cardFrontColor,
  setCardFrontColor,
  cardBackColor,
  setCardBackColor,
  cardLabelColor,
  setCardLabelColor,
  cardLabelFontSize,
  setCardLabelFontSize,
  cardContentFontFamily,
  setCardContentFontFamily,
  valueFontSize,
  setValueFontSize,
}) => {

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
    textAlign: "center",
    transition: "all 0.2s ease",
  });

  return (
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
      <h3 style={{ marginBottom: "1rem", color: "#0077ff" }}>🎨 Card Styling</h3>

      {/* Border Color */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#ff4fa3", fontWeight: 600 }}>Border Color</label>
        <input
          type="color"
          value={cardBorderColor}
          onChange={(e) => setCardBorderColor(e.target.value)}
          style={{ width: "100%", height: "40px", borderRadius: "6px" }}
        />
      </div>

      {/* Front Color */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#ff4fa3", fontWeight: 600 }}>Front Color</label>
        <input
          type="color"
          value={cardFrontColor}
          onChange={(e) => setCardFrontColor(e.target.value)}
          style={{ width: "100%", height: "40px", borderRadius: "6px" }}
        />
      </div>

      {/* Back Color */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#ff4fa3", fontWeight: 600 }}>Back Color</label>
        <input
          type="color"
          value={cardBackColor}
          onChange={(e) => setCardBackColor(e.target.value)}
          style={{ width: "100%", height: "40px", borderRadius: "6px" }}
        />
      </div>

      {/* Label Color */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#ff4fa3", fontWeight: 600 }}>Label Color</label>
        <input
          type="color"
          value={cardLabelColor}
          onChange={(e) => setCardLabelColor(e.target.value)}
          style={{ width: "100%", height: "40px", borderRadius: "6px" }}
        />
      </div>

      {/* Label Font Size */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
          Label Size ({cardLabelFontSize}px)
        </label>
        <input
          type="range"
          min={10}
          max={48}
          value={cardLabelFontSize}
          onChange={(e) => setCardLabelFontSize(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* Value Font Size */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
          Value Size ({valueFontSize}px)
        </label>
        <input
          type="range"
          min={16}
          max={96}
          value={valueFontSize}
          onChange={(e) => setValueFontSize(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* Content Font Family */}
      <div>
        <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
          Content Font
        </label>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginTop: "0.5rem",
          }}
        >
          {fontOptions.map((font) => (
            <div
              key={font.value}
              onClick={() => setCardContentFontFamily(font.value)}
              style={cardStyle(cardContentFontFamily === font.value)}
            >
              <p style={{ margin: 0, fontFamily: font.value }}>{font.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
