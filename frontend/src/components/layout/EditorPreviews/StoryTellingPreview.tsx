import React from "react";
import { Player } from "@remotion/player";
import { StoryTellingVideo } from "../../remotion_compositions/StoryTellingTemplate";

// ------------------ Wrapper ------------------
const StoryTellingComponent: React.FC<{
  script: any;
  voiceoverPath: string;
  duration: number;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  sentenceBgColor?: string;
  backgroundOverlayColor?: string;
  backgroundMusicPath?: string;
  backgroundVideo: string;
  musicVolume?: number;
}> = ({
  script,
  voiceoverPath,
  duration,
  fontSize,
  fontFamily,
  fontColor,
  sentenceBgColor,
  backgroundOverlayColor,
  backgroundMusicPath,
  backgroundVideo,
  musicVolume,
}) => {
  return (
    <StoryTellingVideo
      script={script}
      voiceoverPath={voiceoverPath}
      duration={duration}
      fontSize={fontSize ?? 68}
      fontFamily={
        fontFamily ??
        '"Comic Neue", "Comic Sans MS", "Poppins", sans-serif'
      }
      fontColor={fontColor ?? "white"}
      sentenceBgColor={sentenceBgColor ?? "#FF8C00"}
      backgroundOverlayColor={backgroundOverlayColor ?? "rgba(0,0,0,0.6)"}
      backgroundMusicPath={backgroundMusicPath}
      backgroundVideo={backgroundVideo}
      musicVolume={musicVolume ?? 0.15}
    />
  );
};

// ------------------ Player Wrapper ------------------
const RemotionRedditPlayer: React.FC<{
  script: any;
  voiceoverPath: string;
  duration: number;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  sentenceBgColor?: string;
  backgroundOverlayColor?: string;
  backgroundMusicPath?: string;
  backgroundVideo: string;
  musicVolume?: number;
}> = (props) => {
  return (
    <Player
      component={StoryTellingComponent}
      inputProps={props}
      durationInFrames={30 * props.duration}
      compositionWidth={1080}
      compositionHeight={1920}
      fps={30}
      controls
      alwaysShowControls
      autoPlay
      loop
      initiallyMuted
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

// ------------------ Final Preview Component ------------------
export const StoryTellingPreview: React.FC<{
  duration: number;
  previewBg: string;
  cycleBg: () => void;
  previewScale: number;

  showSafeMargins:boolean;

  // forward all props you want live controlled
  script: any;
  voiceoverPath: string;
  backgroundVideo: string;
  backgroundMusicPath?: string;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  sentenceBgColor?: string;
  backgroundOverlayColor?: string;
  musicVolume?: number;
    onPreviewScaleChange: (value: number) => void; 
  onToggleSafeMargins: (value: boolean) => void; 
}> = ({
  duration,
  previewBg,
  cycleBg,
  previewScale,
  script,
  voiceoverPath,
  backgroundVideo,
  backgroundMusicPath,
  fontSize,
  fontFamily,
  fontColor,
  sentenceBgColor,
  backgroundOverlayColor,
  musicVolume,
  showSafeMargins,
  onPreviewScaleChange,
  onToggleSafeMargins
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          previewBg === "dark"
            ? "#000"
            : previewBg === "light"
            ? "#f0f0f0"
            : "#ccc",
        transition: "background 0.3s",
        position: "relative",
      }}
    >
      {/* Background toggle button */}
      <button
        onClick={cycleBg}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          padding: "0.6rem 1rem",
          borderRadius: "30px",
          border: "none",
          cursor: "pointer",
          color: "white",
          fontWeight: 600,
          background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        {previewBg === "dark"
          ? "🌞 Light"
          : previewBg === "light"
          ? "⬜ Grey"
          : "🌙 Dark"}
      </button>

      {/* Checkbox for Safe Margins */}
      <label
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          color: "#fff",
          fontSize: "0.85rem",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={showSafeMargins}
          onChange={(e) => onToggleSafeMargins(e.target.checked)}
        />
        Show margins
      </label>

      {/* Scale controls (+ / - buttons) */}
      <div
        style={{
          position: "absolute",
          bottom: "70px", // just above the theme toggle button
          right: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <button
          title="Increase Live Preview Size"
          onClick={() =>
            onPreviewScaleChange(Math.min(previewScale + 0.05, 1.2))
          }
          style={{
            width: "30px",
            height: "30px",
            border: "none",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            background: "white",
            color: "black",
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
          }}
        >
          +
        </button>
        <button
          title="Decrease Live Preview Size"
          onClick={() =>
            onPreviewScaleChange(Math.max(previewScale - 0.05, 0.5))
          }
          style={{
            width: "30px",
            height: "30px",
            border: "none",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            background: "white",
            color: "black",
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
          }}
        >
          –
        </button>
      </div>

      {/* Phone-like preview frame */}
      <div
        style={{
          transform: `scale(${previewScale})`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            width: "270px",
            height: "480px",
            border: "3px solid #222",
            borderRadius: "24px",
            overflow: "hidden",
            background: "#000",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          }}
        >
          <RemotionRedditPlayer
            script={script}
            voiceoverPath={voiceoverPath}
            duration={duration}
            backgroundVideo={backgroundVideo}
            backgroundMusicPath={backgroundMusicPath}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fontColor={fontColor}
            sentenceBgColor={sentenceBgColor}
            backgroundOverlayColor={backgroundOverlayColor}
            musicVolume={musicVolume}
          />

           {showSafeMargins && (
          <div
            style={{
              position: "absolute",
              inset: "5%",
              border: "2px dashed rgba(255,255,255,0.25)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}
        </div>
      </div>
    </div>
  );
};
