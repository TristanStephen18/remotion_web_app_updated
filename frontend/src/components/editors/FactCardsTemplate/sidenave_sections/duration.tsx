import React from "react";

interface DurationSectionProps {
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}

export const DurationSection: React.FC<DurationSectionProps> = ({
  duration,
  setDuration,
}) => {
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
        ⏱️ Video Duration
      </h3>

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
            if (value === "" || Number(value) < 3) {
              setDuration(3);
            } else {
              setDuration(Number(value));
            }
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
    </div>
  );
};
