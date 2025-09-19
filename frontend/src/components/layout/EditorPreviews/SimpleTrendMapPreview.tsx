import React from "react";
import { Player } from "@remotion/player";
import {
  SimpleTrendGraph,
  type SimpleGraphProps,
} from "../../remotion_compositions/Curvelinetrend/SimplifiedTemplateHolder";
// import { SimpleTrendGraph, SimpleGraphProps } from "../../remotion_compositions/SimpleTrendGraph";

// ⭐ 1. Simple wrapper for Player inputProps
const SimpleTrendGraphComponent: React.FC<SimpleGraphProps> = (props) => {
  return <SimpleTrendGraph {...props} />;
};

// ⭐ 2. Remotion player instance
const RemotionSimpleGraphPlayer: React.FC<
  SimpleGraphProps & { duration: number }
> = ({ duration, ...props }) => {
  return (
    <Player
      component={SimpleTrendGraphComponent}
      inputProps={props}
      durationInFrames={30 * duration}
      compositionWidth={1080}
      compositionHeight={1920}
      fps={30}
      controls={true}
      autoPlay={true}
      loop={true}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

// ⭐ 3. Preview frame UI
export const SimpleTrendGraphPreview: React.FC<
  SimpleGraphProps & {
    duration: number;
    previewBg: string;
    cycleBg: () => void;
    showSafeMargins: boolean;
    previewScale: number;
      onPreviewScaleChange: (value: number) => void; 
  onToggleSafeMargins: (value: boolean) => void; 
  }
> = ({
  duration,
  showSafeMargins,
  previewBg,
  cycleBg,
  previewScale,
  onPreviewScaleChange,
  onToggleSafeMargins,
  ...props
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
      {/* Background cycle button */}
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
            onPreviewScaleChange(Math.min(previewScale + 0.05, 1.1))
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

      {/* Phone-like preview container */}
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
          <RemotionSimpleGraphPlayer duration={duration} {...props} />
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
