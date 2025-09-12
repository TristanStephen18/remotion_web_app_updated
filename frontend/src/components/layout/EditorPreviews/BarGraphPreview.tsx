import React from "react";
import { Player } from "@remotion/player";
import { BarGraph } from "../../remotion_compositions/BarGraphTemplate";
import type { BarGraphProps } from "../../remotion_compositions/BarGraphTemplate";
// import { duration } from '@mui/material';

const BarGraphComponent: React.FC<BarGraphProps> = ({
  data,
  title,
  titleFontColor,
  backgroundImage,
  accent,
  subtitle,
  currency,
  titleFontSize = 40, // Scaled down from 90
  subtitleFontSize = 22, // Scaled down from 50
  subtitleColor = "#a5b4fc",
  barHeight = 40, // Scaled down from 90
  barGap = 15, // Scaled down from 34
  barLabelFontSize = 14, // Scaled down from 34
  barValueFontSize = 14, // Scaled down from 34
  fontFamily,
}) => {
  return (
    <BarGraph
      data={data}
      title={title}
      titleFontColor={titleFontColor}
      backgroundImage={backgroundImage}
      accent={accent}
      subtitle={subtitle}
      currency={currency}
      titleFontSize={titleFontSize}
      subtitleFontSize={subtitleFontSize}
      subtitleColor={subtitleColor}
      barHeight={barHeight}
      barGap={barGap}
      barLabelFontSize={barLabelFontSize}
      barValueFontSize={barValueFontSize}
      fontFamily={fontFamily}
    />
  );
};

const RemotionBarGraphPlayer: React.FC<
  BarGraphProps & {
    width?: number;
    height?: number;
    autoPlay?: boolean;
    controls?: boolean;
    loop?: boolean;
    fps?: number;
    duration: number;
  }
> = ({
  data,
  title,
  titleFontColor,
  backgroundImage,
  accent,
  subtitle,
  currency,
  titleFontSize = 40,
  subtitleFontSize = 22,
  subtitleColor = "#a5b4fc",
  barHeight = 40,
  barGap = 15,
  barLabelFontSize = 14,
  barValueFontSize = 14,
  autoPlay = true,
  controls = true,
  loop = true,
  fontFamily,
  duration,
}) => {
  return (
    <Player
      component={BarGraphComponent}
      inputProps={{
        data,
        title,
        titleFontColor,
        backgroundImage,
        accent,
        subtitle,
        currency,
        titleFontSize,
        subtitleFontSize,
        subtitleColor,
        barHeight,
        barGap,
        barLabelFontSize,
        barValueFontSize,
        fontFamily,
      }}
      durationInFrames={30 * duration}
      compositionWidth={1080} // Native large size
      compositionHeight={1920} // Native large size
      fps={30}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export const BarGraphTemplatePreview: React.FC<
  BarGraphProps & {
    previewBg: string;
    cycleBg: () => void;
    fps?: number;
    previewScale: number;
    duration: number;
    showSafeMargins: boolean;
    onPreviewScaleChange: (value: number) => void;
    onToggleSafeMargins: (value: boolean) => void;
  }
> = ({
  data,
  title,
  titleFontColor,
  backgroundImage,
  accent,
  subtitle,
  currency,
  titleFontSize = 40,
  subtitleFontSize = 22,
  subtitleColor = "#a5b4fc",
  barHeight = 40,
  barGap = 15,
  barLabelFontSize = 14,
  barValueFontSize = 14,
  previewBg,
  cycleBg,
  fontFamily,
  previewScale,
  duration,
  showSafeMargins,
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
          <RemotionBarGraphPlayer
            data={data}
            title={title}
            titleFontColor={titleFontColor}
            backgroundImage={backgroundImage}
            accent={accent}
            subtitle={subtitle}
            currency={currency}
            titleFontSize={titleFontSize}
            subtitleFontSize={subtitleFontSize}
            subtitleColor={subtitleColor}
            barHeight={barHeight}
            barGap={barGap}
            barLabelFontSize={barLabelFontSize}
            barValueFontSize={barValueFontSize}
            fontFamily={fontFamily}
            duration={duration}
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
