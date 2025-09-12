import React from "react";
import { Player } from "@remotion/player";
// import { FactsCardTemplate } from "../../remotion_compositions/FactsCardTemplate";
import { FactsCardVideo } from "../../remotion_compositions/FactCardsTemplate";
import type { FactsCardVideoProps } from "../../remotion_compositions/FactCardsTemplate";

export type Slide = {
  title: string;
  subtitle?: string;
  description?: string;
};

export const RemotionFacstCardPlayer: React.FC<
  FactsCardVideoProps & {
    width?: number;
    height?: number;
    autoPlay?: boolean;
    controls?: boolean;
    loop?: boolean;
  }
> = ({
  intro,
  outro,
  facts,
  backgroundImage,
  fontSizeTitle,
  fontSizeSubtitle,
  fontFamilyTitle,
  fontColorTitle,
  fontColorSubtitle,
  fontFamilySubtitle,
  duration,
  width = 270,
  height = 480,
  autoPlay = true,
  controls = true,
  loop = true,
  // showSafeMargins
}) => {
  // const totalFrames = facts.length + 2;

  return (
    <Player
      component={FactsCardVideo}
      inputProps={{
        intro,
        outro,
        facts,
        backgroundImage,
        fontSizeTitle,
        fontSizeSubtitle,
        fontFamilyTitle,
        fontColorTitle,
        fontColorSubtitle,
        fontFamilySubtitle,
        duration,
      }}
      durationInFrames={30 * duration}
      compositionWidth={1080} // native size
      compositionHeight={1920}
      fps={30}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      style={{
        width, // directly fit into preview frame
        height,
        display: "block",
      }}
    />
  );
};

export const FacstCardPreview: React.FC<
  FactsCardVideoProps & {
    previewBg: string;
    cycleBg: () => void;
    previewScale: number;
    showSafeMargins: boolean;
    onPreviewScaleChange: (value: number) => void;
    onToggleSafeMargins: (value: boolean) => void;
  }
> = ({
  intro,
  outro,
  facts,
  backgroundImage,
  fontSizeTitle,
  fontSizeSubtitle,
  fontFamilyTitle,
  fontColorTitle,
  fontColorSubtitle,
  fontFamilySubtitle,
  duration,
  previewBg,
  cycleBg,
  showSafeMargins,
  previewScale,
  onPreviewScaleChange,
  onToggleSafeMargins,
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

      <div
        style={{
          transform: `scale(${previewScale})`, // ⭐ scale dynamically
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
          <RemotionFacstCardPlayer
            intro={intro}
            outro={outro}
            facts={facts}
            backgroundImage={backgroundImage}
            fontSizeTitle={fontSizeTitle}
            fontSizeSubtitle={fontSizeSubtitle}
            fontFamilyTitle={fontFamilyTitle}
            fontColorTitle={fontColorTitle}
            fontColorSubtitle={fontColorSubtitle}
            fontFamilySubtitle={fontFamilySubtitle}
            duration={duration}
            // showSafeMargins={showSafeMargins}
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
