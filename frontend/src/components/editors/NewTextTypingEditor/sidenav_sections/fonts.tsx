import React from "react";
// import { FONTS } from "../data";
import { FONTS } from '../assets/configs';

interface FontSideNavProps {
  fontIndex: number;
  setFontIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const FontSideNavTextTyping: React.FC<FontSideNavProps> = ({
  fontIndex,
  setFontIndex,
}) => {
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
      <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>Font Selection</h3>
      <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
        Pick a font style for your typing animation. Each option previews the
        actual font.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {FONTS.map((font, idx) => {
          const isSelected = fontIndex === idx;
          return (
            <button
              key={font.id}
              onClick={() => setFontIndex(idx)}
              style={{
                padding: "1rem",
                borderRadius: "12px",
                border: isSelected ? "2px solid #0077ff" : "1px solid #ddd",
                background: isSelected ? "#e6f0ff" : "#fafafa",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: isSelected
                  ? "0 4px 12px rgba(0, 119, 255, 0.2)"
                  : "0 2px 6px rgba(0,0,0,0.05)",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontFamily: font.family,
                  fontWeight: font.weight,
                  fontSize: "1rem",
                  color: isSelected ? "#0077ff" : "#333",
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {font.name}
              </span>
            </button>
          );
        })}
      </div>

      <p
        style={{
          fontSize: "0.85rem",
          color: "#666",
          marginTop: "1rem",
          textAlign: "center",
        }}
      >
        Selected font:{" "}
        <span style={{ color: "#ff4fa3", fontWeight: 600 }}>
          {FONTS[fontIndex]?.name}
        </span>
      </p>
    </div>
  );
};
