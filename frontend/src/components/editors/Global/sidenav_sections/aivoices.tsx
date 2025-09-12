import { useRef } from "react";
import type { VoiceId } from "../../../../data/ai_voices";
import { VOICES } from "../../../../data/ai_voices";

export const AiVoiceSelector: React.FC<{
  aiVoice: string;
  setAiVoice: React.Dispatch<React.SetStateAction<string>>;
  onUpdateTemplate: () => void;
  isUpdatingTemplate: boolean;
}> = ({ aiVoice, setAiVoice, onUpdateTemplate, isUpdatingTemplate }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSelect = (voiceId: VoiceId, sample: string) => {
    if (aiVoice === voiceId) {
      // unselect if clicked again
      setAiVoice("");
    } else {
      setAiVoice(voiceId);

      // play preview
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const newAudio = new Audio(sample);
      audioRef.current = newAudio;
      newAudio.play().catch(() => {
        console.warn("Autoplay prevented by browser ❗");
      });
    }
  };

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
      <h3 style={{ marginBottom: 16, color: "#0b63ff" }}>🎙️ AI Voice</h3>

      <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
        Choose <strong>one voice</strong> for narration.
      </p>

      {/* Selected voice summary */}
      <div
        style={{
          marginBottom: 16,
          padding: "8px 12px",
          background: "#f9f9ff",
          border: "1px solid #e0e7ff",
          borderRadius: 8,
          fontSize: 13,
          color: "#333",
        }}
      >
        <p>
          <strong style={{ color: "#0b63ff" }}>Selected Voice:</strong>{" "}
          {aiVoice ? (
            <span style={{ color: "#0b63ff" }}>{aiVoice}</span>
          ) : (
            <span style={{ color: "#888" }}>Not selected</span>
          )}
        </p>
      </div>

      {/* Voices list */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
        }}
      >
        {VOICES.map((v) => {
          const selected = aiVoice === v.id;
          const borderColor = selected ? "#0b63ff" : "#ddd";
          const bgColor = selected ? "#0b63ff15" : "#fafafa";

          return (
            <div
              key={v.id}
              onClick={() => handleSelect(v.id, v.sampleVoice)}
              style={{
                position: "relative",
                padding: "12px",
                borderRadius: 10,
                border: `2px solid ${borderColor}`,
                background: bgColor,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: selected
                  ? `0 4px 10px ${borderColor}55`
                  : "0 2px 6px rgba(0,0,0,0.04)",
              }}
            >
              {selected && (
                <span
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "#0b63ff",
                    color: "#fff",
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 6,
                    fontWeight: 600,
                  }}
                >
                  Selected
                </span>
              )}

              <p
                style={{
                  fontWeight: 600,
                  color: "#222",
                  marginBottom: 4,
                  fontSize: 14,
                }}
              >
                {v.label}
              </p>
              <p style={{ fontSize: 12, color: "#555" }}>
                {selected ? "Selected ✅ (click to remove)" : "Click to preview"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Update button */}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <button
          onClick={onUpdateTemplate}
          disabled={!aiVoice || isUpdatingTemplate}
          style={{
            padding: "10px 18px",
            background: aiVoice && !isUpdatingTemplate ? "#0b63ff" : "#ccc",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            borderRadius: 8,
            cursor: aiVoice && !isUpdatingTemplate ? "pointer" : "not-allowed",
            boxShadow:
              aiVoice && !isUpdatingTemplate
                ? "0 3px 6px rgba(0,0,0,0.1)"
                : "none",
          }}
        >
          {isUpdatingTemplate ? "⏳ Updating..." : "Update Template"}
        </button>

        <p style={{ fontSize: 12, color: "#777", marginTop: 8 }}>
          After selecting your voice, click{" "}
          <strong style={{ color: aiVoice ? "#0b63ff" : "#555" }}>
            Update Template
          </strong>{" "}
          to apply changes.
        </p>
      </div>
    </div>
  );
};
