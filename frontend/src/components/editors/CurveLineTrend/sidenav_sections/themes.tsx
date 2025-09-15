import React from "react";
import { graphThemes } from "../../../../data/curvelinethemes";

export type GraphThemeKey = keyof typeof graphThemes;
export type GraphTheme = (typeof graphThemes)[GraphThemeKey];

interface PresetPanelProps {
  preset: GraphThemeKey;
  setPreset: React.Dispatch<React.SetStateAction<GraphThemeKey>>;
}

export const PresetPanel: React.FC<PresetPanelProps> = ({
  preset,
  setPreset,
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

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "0.75rem",
    color: "#ff4fa3",
    fontWeight: 500,
  };

  const optionStyle = (active: boolean): React.CSSProperties => ({
    border: active ? "2px solid #0077ff" : "1px solid #ddd",
    borderRadius: "10px",
    overflow: "hidden",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.2s",
  });

  const swatchStyle = (theme: GraphTheme): React.CSSProperties => ({
    height: "60px",
    background: theme.bgGradient,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  });

  const dotStyle = (color: string): React.CSSProperties => ({
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: color,
    border: "2px solid #fff",
    boxShadow: "0 0 4px rgba(0,0,0,0.3)",
  });

  return (
    <div style={cardStyle}>
      <h3 style={{ marginBottom: "1rem", color: "#0077ff" }}>Theme Preset</h3>

      <label style={labelStyle}>Choose a style</label>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {(Object.keys(graphThemes) as GraphThemeKey[]).map((p) => {
          const theme = graphThemes[p];
          return (
            <div
              key={p}
              style={optionStyle(preset === p)}
              onClick={() => setPreset(p)}
            >
              {/* Swatch Preview */}
              <div style={swatchStyle(theme)}>
                <div style={dotStyle(theme.dot)} />
              </div>
              {/* Label */}
              <div
                style={{
                  textAlign: "center",
                  padding: "0.5rem",
                  fontWeight: 600,
                  fontSize: "13px",
                  background: "#fafafa",
                }}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
