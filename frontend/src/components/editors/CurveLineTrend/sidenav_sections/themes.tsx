import React from "react";
export const graphThemes = {
  dark: {
    bgGradient: "linear-gradient(135deg, #1e293b, #0f172a)",
    dot: "#38bdf8",
    labelText: "#f1f5f9",
    axisText: "#94a3b8",
    accent: "#e2e8f0",
  },
  light: {
    bgGradient: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    dot: "#2563eb",
    labelText: "#0f172a",
    axisText: "#475569",
    accent: "#1e293b",
  },
  corporate: {
    bgGradient: "linear-gradient(135deg, #0f172a, #334155)",
    dot: "#14b8a6",
    labelText: "#f8fafc",
    axisText: "#94a3b8",
    accent: "#f8fafc",
  },
  playful: {
    bgGradient: "linear-gradient(135deg, #f472b6, #facc15)",
    dot: "#f97316",
    labelText: "#ffffff",
    axisText: "#1f2937",
    accent: "#ffffff",
  },

  // Professional darker themes
  midnight: {
    bgGradient: "linear-gradient(135deg, #0f172a, #1e293b)",
    dot: "#60a5fa",
    labelText: "#f1f5f9",
    axisText: "#64748b",
    accent: "#cbd5e1",
  },
  slate: {
    bgGradient: "linear-gradient(135deg, #1e293b, #334155)",
    dot: "#38bdf8",
    labelText: "#e2e8f0",
    axisText: "#94a3b8",
    accent: "#cbd5e1",
  },
  aurora: {
    bgGradient: "linear-gradient(135deg, #1e293b, #0f766e)",
    dot: "#2dd4bf",
    labelText: "#ecfdf5",
    axisText: "#5eead4",
    accent: "#a7f3d0",
  },
  prestige: {
    bgGradient: "linear-gradient(135deg, #312e81, #1e1b4b)",
    dot: "#818cf8",
    labelText: "#eef2ff",
    axisText: "#c7d2fe",
    accent: "#a5b4fc",
  },
  graphite: {
    bgGradient: "linear-gradient(135deg, #111827, #1f2937)",
    dot: "#9ca3af",
    labelText: "#f9fafb",
    axisText: "#6b7280",
    accent: "#d1d5db",
  },
  horizon: {
    bgGradient: "linear-gradient(135deg, #1e293b, #2563eb)",
    dot: "#93c5fd",
    labelText: "#f1f5f9",
    axisText: "#bfdbfe",
    accent: "#dbeafe",
  },

  // New Green / Yellow / Red themes
  emerald: {
    bgGradient: "linear-gradient(135deg, #064e3b, #065f46)",
    dot: "#34d399",
    labelText: "#ecfdf5",
    axisText: "#6ee7b7",
    accent: "#a7f3d0",
  },
  amber: {
    bgGradient: "linear-gradient(135deg, #78350f, #92400e)",
    dot: "#fbbf24",
    labelText: "#fef3c7",
    axisText: "#fcd34d",
    accent: "#fde68a",
  },
  crimson: {
    bgGradient: "linear-gradient(135deg, #7f1d1d, #991b1b)",
    dot: "#f87171",
    labelText: "#fee2e2",
    axisText: "#fecaca",
    accent: "#fca5a5",
  },
  moss: {
    bgGradient: "linear-gradient(135deg, #14532d, #166534)",
    dot: "#86efac",
    labelText: "#ecfdf5",
    axisText: "#bbf7d0",
    accent: "#4ade80",
  },
  sunset: {
    bgGradient: "linear-gradient(135deg, #7c2d12, #9a3412)",
    dot: "#fb923c",
    labelText: "#fff7ed",
    axisText: "#fdba74",
    accent: "#fed7aa",
  },
  ruby: {
    bgGradient: "linear-gradient(135deg, #450a0a, #991b1b)",
    dot: "#ef4444",
    labelText: "#fee2e2",
    axisText: "#fecaca",
    accent: "#f87171",
  },
};



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
