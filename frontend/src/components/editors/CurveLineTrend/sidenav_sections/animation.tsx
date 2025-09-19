import React from "react";

interface AnimationPanelProps {
  animationSpeed: "slow" | "normal" | "fast";
  setAnimationSpeed: React.Dispatch<
    React.SetStateAction<"slow" | "normal" | "fast">
  >;
  minimalMode: boolean;
  setMinimalMode: React.Dispatch<React.SetStateAction<boolean>>;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}

export const AnimationPanel: React.FC<AnimationPanelProps> = ({
  animationSpeed,
  setAnimationSpeed,
  minimalMode,
  setMinimalMode,
  setDuration,
}) => {
  const cardStyle: React.CSSProperties = {
    marginBottom: "1.5rem",
    padding: "1rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fafafa",
    fontSize: 14,
  };

  const toggleStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  return (
    <div>
      {/* Animation Speed */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: "0.75rem", color: "#ff4fa3" }}>
          Animation Speed
        </h3>
        <select
          value={animationSpeed}
          onChange={(e) => {
            const increment = 4;
            // slow = 13
            // normal = 7 
            // fast = 4
            setAnimationSpeed(e.target.value as "slow" | "normal" | "fast");
            switch(e.target.value){
              case "slow":
                setDuration(13 + increment);
                break;
              case "fast":
                setDuration(4 + increment);
                break;
              default:
                setDuration(7 + increment);
                break;
            }

          }}
          style={inputStyle}
        >
          <option value="slow">🐢 Slow</option>
          <option value="normal">⚖️ Normal</option>
          <option value="fast">⚡ Fast</option>
        </select>
      </div>

      {/* Minimal Mode */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: "0.75rem", color: "#ff4fa3" }}>
          Minimal Mode
        </h3>
        <div style={toggleStyle}>
          <input
            type="checkbox"
            checked={minimalMode}
            onChange={(e) => setMinimalMode(e.target.checked)}
          />
          <span style={{ color: "#333", fontSize: "0.95rem" }}>
            {minimalMode ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>
    </div>
  );
};
