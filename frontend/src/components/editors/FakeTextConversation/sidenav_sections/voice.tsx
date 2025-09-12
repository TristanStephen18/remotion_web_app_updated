import { useRef } from "react";
import type { VoiceId } from "../../../../data/ai_voices";
import { VOICES } from "../../../../data/ai_voices";

export const VoiceSelector: React.FC<{
  voice1: string;
  setVoice1: React.Dispatch<React.SetStateAction<string>>;
  voice2: string;
  setVoice2: React.Dispatch<React.SetStateAction<string>>;
  onUpdateTemplate: () => void;
  isUpdatingTemplate: boolean; // ✅ new prop
}> = ({
  voice1,
  setVoice1,
  voice2,
  setVoice2,
  onUpdateTemplate,
  isUpdatingTemplate,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSelect = (voiceId: VoiceId, sample: string) => {
    if (voice1 === voiceId) {
      setVoice1("");
      return;
    }
    if (voice2 === voiceId) {
      setVoice2("");
      return;
    }

    if (!voice1) {
      setVoice1(voiceId);
    } else if (!voice2) {
      setVoice2(voiceId);
    } else {
      setVoice2(voiceId);
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const newAudio = new Audio(sample);
    audioRef.current = newAudio;
    newAudio.play().catch(() => {
      console.warn("Autoplay prevented by browser ❗");
    });
  };

  const getRole = (id: VoiceId): "voice1" | "voice2" | null => {
    if (id === voice1) return "voice1";
    if (id === voice2) return "voice2";
    return null;
  };

  const colorMap = {
    voice1: "#0b63ff", // blue
    voice2: "#ff4fa3", // pink
  };

  const bothSelected = !!voice1 && !!voice2;

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
      <h3 style={{ marginBottom: 16, color: "#0b63ff" }}>🎙️ Voice Selection</h3>

      <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
        Choose <strong>two voices</strong> for your project.
        <br />
        <span style={{ color: "#0b63ff", fontWeight: 600 }}>Blue</span> =
        Voice&nbsp;1,&nbsp;
        <span style={{ color: "#ff4fa3", fontWeight: 600 }}>Pink</span> =
        Voice&nbsp;2.
      </p>

      {/* Selected voices summary */}
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
          <strong style={{ color: "#0b63ff" }}>Voice 1:</strong>{" "}
          {voice1 ? (
            <span style={{ color: "#0b63ff" }}>{voice1}</span>
          ) : (
            <span style={{ color: "#888" }}>Not selected</span>
          )}
        </p>
        <p>
          <strong style={{ color: "#ff4fa3" }}>Voice 2:</strong>{" "}
          {voice2 ? (
            <span style={{ color: "#ff4fa3" }}>{voice2}</span>
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
          const role = getRole(v.id);
          const selected = role !== null;
          const borderColor = role ? colorMap[role] : "#ddd";
          const bgColor = role ? `${colorMap[role]}15` : "#fafafa";

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
              {role && (
                <span
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: colorMap[role],
                    color: "#fff",
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 6,
                    fontWeight: 600,
                  }}
                >
                  {role === "voice1" ? "Voice 1" : "Voice 2"}
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
                {selected
                  ? "Selected ✅ (click to remove)"
                  : "Click to preview"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Update button */}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <button
          onClick={onUpdateTemplate}
          disabled={!bothSelected || isUpdatingTemplate}
          style={{
            padding: "10px 18px",
            background:
              bothSelected && !isUpdatingTemplate ? "#0b63ff" : "#ccc",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            borderRadius: 8,
            cursor:
              bothSelected && !isUpdatingTemplate ? "pointer" : "not-allowed",
            boxShadow:
              bothSelected && !isUpdatingTemplate
                ? "0 3px 6px rgba(0,0,0,0.1)"
                : "none",
          }}
        >
          {isUpdatingTemplate ? "⏳ Updating..." : "Update Template"}
        </button>

        <p style={{ fontSize: 12, color: "#777", marginTop: 8 }}>
          After selecting your voices, click{" "}
          <strong style={{ color: bothSelected ? "#0b63ff" : "#555" }}>
            Update Template
          </strong>{" "}
          to apply changes.
        </p>
      </div>
    </div>
  );
};
