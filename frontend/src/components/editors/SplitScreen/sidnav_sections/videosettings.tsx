import React from "react";

interface ControlsPanelProps {
  bottomHeightPercent: number;
  setBottomHeightPercent: React.Dispatch<React.SetStateAction<number>>;
  topHeightPercent: number;
  setTopHeightPercent: React.Dispatch<React.SetStateAction<number>>;
  bottomOpacity: number;
  setBottomOpacity: React.Dispatch<React.SetStateAction<number>>;
  topOpacity: number;
  setTopOpacity: React.Dispatch<React.SetStateAction<number>>;
  bottomVolume: number;
  setBottomVolume: React.Dispatch<React.SetStateAction<number>>;
  topVolume: number;
  setTopVolume: React.Dispatch<React.SetStateAction<number>>;
  swap: boolean;
  setSwap: React.Dispatch<React.SetStateAction<boolean>>;
}

export const VideoSettingsControlPanel: React.FC<ControlsPanelProps> = ({
  bottomHeightPercent,
  setBottomHeightPercent,
  topHeightPercent,
  setTopHeightPercent,
  bottomOpacity,
  setBottomOpacity,
  topOpacity,
  setTopOpacity,
  bottomVolume,
  setBottomVolume,
  topVolume,
  setTopVolume,
  swap,
  setSwap,
}) => {
  // Handlers for linked sliders
  const handleTopHeightChange = (val: number) => {
    setTopHeightPercent(val);
    setBottomHeightPercent(100 - val);
  };

  const handleBottomHeightChange = (val: number) => {
    setBottomHeightPercent(val);
    setTopHeightPercent(100 - val);
  };

  return (
    <div
      style={{
        marginBottom: "1.5rem",
        padding: "clamp(0.75rem, 2vw, 1rem)",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        border: "1px solid #eee",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          marginBottom: "1rem",
          color: "#0077ff",
          fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
        }}
      >
        🎛 Video Controls
      </h3>

      {/* Linked Height Sliders */}
      <ControlSlider
        label="Video Uploaded Height"
        value={topHeightPercent}
        setValue={handleTopHeightChange}
        min={10}
        max={90}
        unit="%"
      />
      <ControlSlider
        label="Selected Video Height"
        value={bottomHeightPercent}
        setValue={handleBottomHeightChange}
        min={10}
        max={90}
        unit="%"
      />

      {/* Independent Controls */}
      <ControlSlider
        label="Video Uploaded Opacity"
        value={topOpacity}
        setValue={setTopOpacity}
        min={0}
        max={1}
        step={0.05}
      />
      <ControlSlider
        label="Selected Video Opacity"
        value={bottomOpacity}
        setValue={setBottomOpacity}
        min={0}
        max={1}
        step={0.05}
      />
      <ControlSlider
        label="Video Uploaded Volume"
        value={topVolume}
        setValue={setTopVolume}
        min={0}
        max={1}
        step={0.05}
      />
      <ControlSlider
        label="Selected Video Volume"
        value={bottomVolume}
        setValue={setBottomVolume}
        min={0}
        max={1}
        step={0.05}
      />

      {/* Swap toggle */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "0.9rem", color: "#333" }}>Swap Video Positions</span>
        <button
          onClick={() => setSwap(!swap)}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "20px",
            border: "none",
            background: swap
              ? "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)"
              : "#eee",
            color: swap ? "white" : "#555",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {swap ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
};

// Reusable slider
const ControlSlider: React.FC<{
  label: string;
  value: number;
  setValue: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}> = ({ label, value, setValue, min, max, step = 1, unit = "" }) => (
  <div style={{ marginBottom: "1rem" }}>
    <label
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "0.4rem",
        fontSize: "0.85rem",
        color: "#333",
      }}
    >
      <span>{label}</span>
      <span style={{ color: "#0077ff", fontWeight: 600 }}>
        {value}
        {unit}
      </span>
    </label>
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => setValue(Number(e.target.value))}
      style={{
        width: "100%",
        cursor: "pointer",
        accentColor: "#0077ff",
      }}
    />
  </div>
);
