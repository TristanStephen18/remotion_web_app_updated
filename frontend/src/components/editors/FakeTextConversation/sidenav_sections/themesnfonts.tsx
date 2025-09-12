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

export const ChatStylePanel: React.FC<{
  chatTheme: "default" | "discord" | "messenger" | "whatsapp";
  setChatTheme: React.Dispatch<
    React.SetStateAction<"default" | "discord" | "messenger" | "whatsapp">
  >;
  fontFamily: string;
  setFontFamily: React.Dispatch<React.SetStateAction<string>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  fontColor: string;
  setFontColor: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  chatTheme,
  setChatTheme,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  fontColor,
  setFontColor,
}) => {
  const themes = [
    { id: "default", label: "Default", logo: null },
    { id: "discord", label: "Discord", logo: "/images/logos/discord.jpg" },
    { id: "messenger", label: "Messenger", logo: "/images/logos/messenger.webp" },
    { id: "whatsapp", label: "WhatsApp", logo: "/images/logos/whatsapp.png" },
  ];

  const fonts = [
    "Inter, sans-serif",
    "Roboto, sans-serif",
    "Open Sans, sans-serif",
    "Poppins, sans-serif",
    "Georgia, serif",
    "Courier New, monospace",
  ];

  return (
    <div
      style={{
        marginBottom: "1.5rem",
        padding: "1rem",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(12,24,48,0.06)",
        border: "1px solid #eef2ff",
      }}
    >
      <h3 style={{ marginBottom: 16, color: "#0b63ff" }}>🎨 Chat Styling</h3>

      {/* Chat Theme */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 8, fontSize: 14, color: "#222" }}>
          Chat Theme
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px",
          }}
        >
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setChatTheme(t.id as any)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "8px",
                padding: "10px",
                borderRadius: 8,
                border:
                  chatTheme === t.id ? "2px solid #0b63ff" : "2px solid #ddd",
                background:
                  chatTheme === t.id ? "#0b63ff15" : "rgba(240,240,240,0.4)",
                cursor: "pointer",
                fontWeight: 600,
                color: chatTheme === t.id ? "#0b63ff" : "#333",
                textAlign: "left",
              }}
            >
              {t.logo && (
                <img
                  src={t.logo}
                  alt={t.label}
                  style={{
                    width: 20,
                    height: 20,
                    objectFit: "contain",
                    borderRadius: 4,
                  }}
                />
              )}
              {t.label}
            </button>
          ))}
        </div>
      </div>

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
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 8, fontSize: 14, color: "#222" }}>
          Font Size
        </h4>
        <input
          type="number"
          min={12}
          max={72}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        />
        <p style={{ fontSize: 12, color: "#777", marginTop: 4 }}>
          Current: {fontSize}px
        </p>
      </div>

      {/* Font Color */}
      <div>
        <h4 style={{ marginBottom: 8, fontSize: 14, color: "#222" }}>
          Font Color
        </h4>
        <input
          type="color"
          value={fontColor || "#000000"}
          onChange={(e) => setFontColor(e.target.value)}
          style={{
            width: "100%",
            height: "40px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};
