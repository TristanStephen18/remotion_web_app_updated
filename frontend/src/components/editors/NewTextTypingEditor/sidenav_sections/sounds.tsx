import React, { useRef, useState } from "react";
import { AUDIO_FILES } from "../assets/configs";

interface SoundSideNavProps {
  soundIndex: number;
  setSoundIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const SoundSideNav: React.FC<SoundSideNavProps> = ({
  soundIndex,
  setSoundIndex,
}) => {
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const handlePlay = (idx: number) => {
    // Stop all other sounds first
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== idx) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    const audio = audioRefs.current[idx];
    if (audio) {
      if (audio.paused) {
        audio.play();
        setPlayingIndex(idx); // mark as playing
        // Reset state when audio ends
        audio.onended = () => setPlayingIndex(null);
      } else {
        audio.pause();
        audio.currentTime = 0;
        setPlayingIndex(null);
      }
    }
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
        Sound Selection
      </h3>
      <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
        Choose a typing sound effect for your animation. Preview each option to
        find the one that fits best.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1rem",
        }}
      >
        {AUDIO_FILES.map((sound, idx) => {
          const isSelected = soundIndex === idx;
          const isPlaying = playingIndex === idx;

          return (
            <button
              key={sound.id}
              onClick={() => setSoundIndex(idx)}
              style={{
                border: isSelected ? "2px solid #0077ff" : "1px solid #ddd",
                borderRadius: "12px",
                background: "#fafafa",
                padding: "0.75rem",
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
              {/* Name */}
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginBottom: "0.25rem",
                  color: isSelected ? "#0077ff" : "#333",
                }}
              >
                {sound.name}
              </span>

              {/* Mood tag */}
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#666",
                  marginBottom: "0.5rem",
                }}
              >
                {sound.mood}
              </span>

              {/* Play preview button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // prevent selecting when just previewing
                  handlePlay(idx);
                }}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "20px",
                  border: "none",
                  background: isPlaying
                    ? "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)"
                    : "#eee",
                  color: isPlaying ? "#fff" : "#333",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  boxShadow: isPlaying
                    ? "0 3px 8px rgba(0,0,0,0.2)"
                    : "inset 0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                {isPlaying ? "⏹ Stop" : "🔊 Preview"}
              </button>

              {/* Hidden audio element */}
              <audio
                ref={(el) => {
                  audioRefs.current[idx] = el;
                }}
                src={`${sound.filename}`}
              />
            </button>
          );
        })}
      </div>

      {/* Selected sound display */}
      <p
        style={{
          fontSize: "0.85rem",
          color: "#666",
          marginTop: "1rem",
          textAlign: "center",
        }}
      >
        Selected sound:{" "}
        <span style={{ color: "#ff4fa3", fontWeight: 600 }}>
          {AUDIO_FILES[soundIndex]?.name}
        </span>
      </p>
    </div>
  );
};
