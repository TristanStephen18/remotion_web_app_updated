import React, { useRef, useState } from "react";

export const MusicSelector: React.FC<{
  musicAudio: string;
  setMusicAudio: React.Dispatch<React.SetStateAction<string>>;
}> = ({ musicAudio, setMusicAudio }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  const tracks = Array.from(
    { length: 11 },
    (_, i) => `/soundeffects/bgmusic/bg${i + 1}.mp3`
  );

  const handlePreview = (src: string) => {
    if (playing === src && audioRef.current) {
      // ⏸️ Pause if same track is already playing
      audioRef.current.pause();
      setPlaying(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const newAudio = new Audio(src);
    audioRef.current = newAudio;
    newAudio.play().then(() => setPlaying(src)).catch(() => {
      console.warn("Autoplay prevented ❗");
    });

    newAudio.onended = () => setPlaying(null);
  };

  const handleSelect = (src: string) => {
    if (musicAudio === src) {
      // 🔄 Unselect if already selected
      setMusicAudio("");
    } else {
      setMusicAudio(src);
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
      <h3 style={{ marginBottom: 16, color: "#0b63ff" }}>🎵 Background Music</h3>

      <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
        Select a <strong>background track</strong> for your conversation.  
        You can <em>Preview</em> before selecting.  
        Click again to unselect or pause.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px",
        }}
      >
        {tracks.map((src, idx) => {
          const selected = musicAudio === src;
          const isPlaying = playing === src;

          return (
            <div
              key={src}
              style={{
                padding: "10px",
                borderRadius: 10,
                border: `2px solid ${selected ? "#0b63ff" : "#ddd"}`,
                background: selected ? "#0b63ff15" : "#fafafa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "6px",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  margin: 0,
                  color: selected ? "#0b63ff" : "#333",
                }}
              >
                Track {idx + 1}
              </p>

              <button
                onClick={() => handlePreview(src)}
                style={{
                  fontSize: 12,
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                {isPlaying ? "⏸️ Pause" : "▶️ Preview"}
              </button>

              <button
                onClick={() => handleSelect(src)}
                style={{
                  fontSize: 12,
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "none",
                  background: selected ? "#ff4fa3" : "#0b63ff",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {selected ? "❌ Unselect" : "Select"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
