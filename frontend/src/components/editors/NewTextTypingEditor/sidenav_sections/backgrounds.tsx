import React from "react";
// import { BACKGROUNDS } from "../data";
import { BACKGROUNDS } from '../assets/configs';

interface BackgroundSideNavProps {
  backgroundIndex: number;
  setBackgroundIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const BackgroundSideNav: React.FC<BackgroundSideNavProps> = ({
  backgroundIndex,
  setBackgroundIndex,
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
      <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
        Theme Selection
      </h3>
      <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
        Choose a theme for your typing animation.  
        Each option shows a live preview of its gradient or effect.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "1rem",
        }}
      >
        {BACKGROUNDS.map((bg, idx) => {
          const isSelected = backgroundIndex === idx;
          return (
            <button
              key={bg.id}
              onClick={() => setBackgroundIndex(idx)}
              style={{
                border: isSelected ? "2px solid #0077ff" : "1px solid #ddd",
                borderRadius: "12px",
                background: "#fafafa",
                padding: "0.5rem",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                boxShadow: isSelected
                  ? "0 4px 12px rgba(0, 119, 255, 0.25)"
                  : "0 2px 6px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Preview Box */}
              <div
                style={{
                  width: "100%",
                  height: "70px",
                  borderRadius: "8px",
                  background: bg.backgroundColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: bg.textColor,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  overflow: "hidden",
                  boxShadow: "inset 0 0 8px rgba(0,0,0,0.1)",
                }}
              >
                {bg.mood.charAt(0).toUpperCase() + bg.mood.slice(1)}
              </div>

              {/* Label */}
              <span
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.8rem",
                  color: isSelected ? "#0077ff" : "#333",
                  fontWeight: isSelected ? 600 : 400,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                {bg.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected background name */}
      <p
        style={{
          fontSize: "0.85rem",
          color: "#666",
          marginTop: "1rem",
          textAlign: "center",
        }}
      >
        Selected background:{" "}
        <span style={{ color: "#ff4fa3", fontWeight: 600 }}>
          {BACKGROUNDS[backgroundIndex]?.name}
        </span>
      </p>
    </div>
  );
};
