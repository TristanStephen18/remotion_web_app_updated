import type React from "react";
import { quoteSpotlightNiches } from "../../../../data/aisetupdata";

export interface AiSetupProps {
  selectedNiches: string[];
  setSelectedNiches: React.Dispatch<React.SetStateAction<string[]>>;
  handleAiSetup: () => void;
  isSettingUp: boolean;
  aiMessage: string | null;
}

export const AiSetupPanel: React.FC<AiSetupProps> = ({
  selectedNiches,
  setSelectedNiches,
  handleAiSetup,
  isSettingUp,
  aiMessage,
}) => {
  const toggleNiche = (niche: string) => {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    );
  };

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
        AI Setup Panel
      </h3>

      {/* Niche Selection */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
          Choose Niches
        </div>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#666",
            marginBottom: "0.75rem",
          }}
        >
          Select one or more niches to guide the AI in creating a personalized
          template. You can mix and match niches for more variety.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {quoteSpotlightNiches.map((niche) => {
            const isActive = selectedNiches.includes(niche);
            return (
              <button
                key={niche}
                onClick={() => toggleNiche(niche)}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "20px",
                  border: isActive ? "2px solid #0077ff" : "1px solid #ddd",
                  background: isActive ? "#e6f2ff" : "#fafafa",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {niche}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🚀 AI Setup Button */}
      <button
        onClick={handleAiSetup}
        disabled={isSettingUp}
        style={{
          marginTop: "0.75rem",
          padding: "0.6rem 1rem",
          borderRadius: "8px",
          border: "none",
          cursor: isSettingUp ? "not-allowed" : "pointer",
          color: "white",
          fontWeight: 600,
          background: isSettingUp
            ? "#999"
            : "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          width: "100%",
          transition: "background 0.3s ease",
        }}
      >
        {isSettingUp
          ? "⚙️ Setting up template..."
          : "✨ Let AI setup my Template"}
      </button>
      {aiMessage && (
        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.9rem",
            color: "#007700",
            fontWeight: 600,
          }}
        >
          {aiMessage}
        </p>
      )}

      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.75rem" }}>
        The AI will analyze your selected niches and generate a ready-to-use
        template tailored to them.
      </p>
    </div>
  );
};
