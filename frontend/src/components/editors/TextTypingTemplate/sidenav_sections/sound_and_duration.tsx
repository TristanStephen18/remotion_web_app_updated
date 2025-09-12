import React, { useRef, useState } from "react";

interface SoundAndDurationProps {
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  soundUrl: string;
  setSoundUrl: React.Dispatch<React.SetStateAction<string>>;
}

const SoundEffectData = [
  { soundname: "Keyboard 1", soundlocation: "/soundeffects/texttyping/keyboard1.mp3" },
  { soundname: "Keyboard 2", soundlocation: "/soundeffects/texttyping/keyboard2.mp3" },
  { soundname: "Keyboard 3", soundlocation: "/soundeffects/texttyping/keyboard3.mp3" },
  { soundname: "Typewriter 1", soundlocation: "/soundeffects/texttyping/typewriter1.mp3" },
  { soundname: "Typewriter 2", soundlocation: "/soundeffects/texttyping/typewriter2.mp3" },
  { soundname: "Typewriter 3", soundlocation: "/soundeffects/texttyping/typewriter3.mp3" },
];

export const SoundAndDurationSection: React.FC<SoundAndDurationProps> = ({
  duration,
  setDuration,
  soundUrl,
  setSoundUrl,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [pendingSoundUrl, setPendingSoundUrl] = useState<string | null>(null);

  const handlePlaySound = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play();
    setIsPaused(false);

    setPendingSoundUrl(url);
  };

  const togglePause = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  };

  const applySound = () => {
    if (pendingSoundUrl) {
      setSoundUrl(pendingSoundUrl);
      setPendingSoundUrl(null);
      audioRef.current!.pause();
      setIsPaused(true);
    }
  };

  const cardStyle = (isApplied: boolean, isPreview: boolean): React.CSSProperties => ({
    minWidth: "160px",
    padding: "1rem",
    borderRadius: "10px",
    border: isApplied
      ? "2px solid #28a745"
      : isPreview
      ? "2px solid #0077ff"
      : "1px solid #ddd",
    background: isApplied
      ? "linear-gradient(135deg, #28a74522, #ffffff)"
      : isPreview
      ? "linear-gradient(135deg, #0077ff22, #ffffff)"
      : "#fafafa",
    cursor: "pointer",
    boxShadow: isApplied || isPreview
      ? "0 4px 10px rgba(0, 119, 255, 0.2)"
      : "0 2px 6px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease",
    textAlign: "center",
  });

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
      <h3 style={{ marginBottom: "1rem", color: "#0077ff" }}>
        🎶 Sound & ⏱️ Duration
      </h3>

      {/* Sound Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "0.75rem",
        }}
      >
        {SoundEffectData.map((sound) => {
          const isApplied = soundUrl === sound.soundlocation;
          const isPreview = pendingSoundUrl === sound.soundlocation && !isApplied;

          return (
            <div
              key={sound.soundlocation}
              onClick={() => !isApplied && handlePlaySound(sound.soundlocation)}
              style={cardStyle(isApplied, isPreview)}
            >
              <p style={{ margin: 0, fontWeight: 600 }}>{sound.soundname}</p>
              <small style={{ color: "#666" }}>
                {sound.soundlocation.split("/").pop()}
              </small>

              {isPreview && (
                <div style={{ marginTop: "0.5rem" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePause();
                    }}
                    style={{
                      marginRight: "0.5rem",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.85rem",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      background: "#0077ff",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    {isPaused ? "▶ Play" : "⏸ Pause"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      applySound();
                    }}
                    style={{
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.85rem",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      background: "#28a745",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    ✅ Apply
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1.5rem" }}>
        Click on a sound card to preview it. Use the <strong>Pause</strong> /
        <strong>Resume</strong> button to control playback. Hit{" "}
        <strong>Apply</strong> to lock in your chosen sound effect.
      </p>

      {/* Duration editor */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <label
          style={{
            fontWeight: 600,
            color: "#444",
          }}
        >
          Duration (seconds):
        </label>
        <input
          type="number"
          min={1}
          value={duration}
          onChange={(e) => {
            const value = e.target.value;
            setDuration(value === "" || Number(value) < 1 ? 1 : Number(value));
          }}
          onBlur={(e) => {
            if (e.target.value === "" || Number(e.target.value) < 1) {
              setDuration(1);
            }
          }}
          style={{
            width: "120px",
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            textAlign: "center",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
          }}
        />
      </div>
      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
        Set how long this effect should last. Duration is measured in seconds,
        and must be at least <strong>1</strong>.
      </p>
    </div>
  );
};
