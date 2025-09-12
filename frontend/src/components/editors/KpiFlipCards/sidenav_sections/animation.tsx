import React from "react";

export const AnimationSettingsPanel: React.FC<{
  delayStart: number;
  setDelayStart: (v: number) => void;
  delayStep: number;
  setDelayStep: (v: number) => void;
}> = ({ delayStart, setDelayStart, delayStep, setDelayStep }) => {
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
        ⏱️ Animation Settings
      </h3>

      {/* Delay Start */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
          Start Delay ({delayStart}s)
        </label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={delayStart}
          onChange={(e) => setDelayStart(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* Delay Step */}
      <div>
        <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
          Step Delay per Card ({delayStep}s)
        </label>
        <input
          type="range"
          min={0.2}
          max={3}
          step={0.1}
          value={delayStep}
          onChange={(e) => setDelayStep(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};
