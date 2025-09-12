import React from "react";

export const ProportionsPanel: React.FC<{
  cardWidthRatio: number;
  setCardWidthRatio: React.Dispatch<React.SetStateAction<number>>;
  cardHeightRatio: number;
  setCardHeightRatio: React.Dispatch<React.SetStateAction<number>>;
}> = ({ cardWidthRatio, setCardWidthRatio, cardHeightRatio, setCardHeightRatio }) => {
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
      <h3 style={{ marginBottom: 16, color: "#0b63ff" }}>📐 Image Size Settings</h3>

      <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
        Adjust the width and height ratios of your images.  
        Use the sliders to find the balance that works best for your layout.
      </p>

      {/* Width Ratio */}
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
            fontWeight: 600,
            fontSize: 14,
            color: "#333",
          }}
        >
          <span>Width Ratio</span>
          <span style={{ color: "#0b63ff" }}>{cardWidthRatio.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.01"
          value={cardWidthRatio}
          onChange={(e) => setCardWidthRatio(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* Height Ratio */}
      <div>
        <label
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
            fontWeight: 600,
            fontSize: 14,
            color: "#333",
          }}
        >
          <span>Height Ratio</span>
          <span style={{ color: "#0b63ff" }}>{cardHeightRatio.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.01"
          value={cardHeightRatio}
          onChange={(e) => setCardHeightRatio(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};
