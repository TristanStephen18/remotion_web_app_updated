import type React from "react";

interface BarGraphControlsPanelProps {
  barHeight: number;
  setBarHeight: React.Dispatch<React.SetStateAction<number>>;
  barGap: number;
  setBarGap: React.Dispatch<React.SetStateAction<number>>;
  barLabelFontSize: number;
  setBarLabelFontSize: React.Dispatch<React.SetStateAction<number>>;
  barValueFontSize: number;
  setBarValueFontSize: React.Dispatch<React.SetStateAction<number>>;
}

export const BarGraphControlsPanel: React.FC<BarGraphControlsPanelProps> = ({
  barHeight,
  setBarHeight,
  barGap,
  setBarGap,
  barLabelFontSize,
  setBarLabelFontSize,
  barValueFontSize,
  setBarValueFontSize,
}) => {
  const panelStyle: React.CSSProperties = {
    padding: "1.25rem",
    background: "linear-gradient(145deg, #ffffff 0%, #fafbff 100%)",
    borderRadius: "16px",
    boxShadow: `
      0 4px 20px rgba(0, 119, 255, 0.06),
      0 2px 8px rgba(255, 79, 163, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.8)
    `,
    border: "1px solid rgba(0, 119, 255, 0.1)",
    marginBottom: "1.25rem",
  };

  const headerStyle: React.CSSProperties = {
    color: "#0077ff",
    fontSize: "1.1rem",
    fontWeight: 700,
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    textShadow: "0 1px 2px rgba(0, 119, 255, 0.1)",
  };

  const controlsGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.25rem",
  };

  const controlGroupStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 255, 0.6) 100%)",
    padding: "1rem",
    borderRadius: "14px",
    border: "1.5px solid rgba(0, 119, 255, 0.1)",
    boxShadow: "0 2px 10px rgba(0, 119, 255, 0.05)",
  };

  const controlLabelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "0.75rem",
    color: "#ff4fa3",
    fontWeight: 600,
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    alignItems: "center",
    gap: "0.5rem",
  };

  const sliderContainerStyle: React.CSSProperties = {
    position: "relative",
    marginBottom: "0.5rem",
  };

  const sliderStyle: React.CSSProperties = {
    width: "100%",
    height: "6px",
    borderRadius: "3px",
    background: "linear-gradient(90deg, rgba(255, 79, 163, 0.2) 0%, rgba(138, 77, 255, 0.2) 50%, rgba(0, 119, 255, 0.2) 100%)",
    outline: "none",
    WebkitAppearance: "none",
    appearance: "none",
  };

  const valueDisplayStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#0077ff",
    fontWeight: 600,
    fontSize: "0.9rem",
    background: "linear-gradient(135deg, rgba(0, 119, 255, 0.1) 0%, rgba(138, 77, 255, 0.05) 100%)",
    padding: "0.4rem 0.75rem",
    borderRadius: "8px",
    marginTop: "0.5rem",
    display: "inline-block",
  };

//   const rangeThumbStyle: React.CSSProperties = {
//     WebkitAppearance: "none",
//     appearance: "none",
//     width: "18px",
//     height: "18px",
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #ff4fa3 0%, #8a4dff 50%, #0077ff 100%)",
//     cursor: "pointer",
//     boxShadow: "0 2px 8px rgba(0, 119, 255, 0.3)",
//     border: "2px solid white",
//   };

  return (
    <div style={panelStyle}>
      <h3 style={headerStyle}>
        <span style={{
          background: "linear-gradient(135deg, #ff4fa3, #8a4dff, #0077ff)",
          color: "white",
          width: "26px",
          height: "26px",
          borderRadius: "7px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.8rem",
          fontWeight: 700,
          boxShadow: "0 2px 6px rgba(0, 119, 255, 0.25)",
        }}>
          📊
        </span>
        BAR GRAPH STYLING
      </h3>

      <div style={controlsGridStyle}>
        {/* Bar Height Control */}
        <div style={controlGroupStyle}>
          <label style={controlLabelStyle}>
            <span>📏</span>
            BAR HEIGHT
          </label>
          <div style={sliderContainerStyle}>
            <input
              type="range"
              min="30"
              max="150"
              value={barHeight}
              onChange={(e) => setBarHeight(Number(e.target.value))}
              style={{
                ...sliderStyle,
                background: `linear-gradient(90deg, rgba(255, 79, 163, 0.3) 0%, rgba(255, 79, 163, 0.3) ${(barHeight - 30) / 120 * 100}%, rgba(0, 119, 255, 0.1) ${(barHeight - 30) / 120 * 100}%, rgba(0, 119, 255, 0.1) 100%)`
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.height = "8px";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.height = "6px";
              }}
            />
          </div>
          <div style={valueDisplayStyle}>{barHeight}px</div>
        </div>

        {/* Bar Gap Control */}
        <div style={controlGroupStyle}>
          <label style={controlLabelStyle}>
            <span>↕️</span>
            BAR GAP
          </label>
          <div style={sliderContainerStyle}>
            <input
              type="range"
              min="10"
              max="80"
              value={barGap}
              onChange={(e) => setBarGap(Number(e.target.value))}
              style={{
                ...sliderStyle,
                background: `linear-gradient(90deg, rgba(138, 77, 255, 0.3) 0%, rgba(138, 77, 255, 0.3) ${(barGap - 10) / 70 * 100}%, rgba(0, 119, 255, 0.1) ${(barGap - 10) / 70 * 100}%, rgba(0, 119, 255, 0.1) 100%)`
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.height = "8px";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.height = "6px";
              }}
            />
          </div>
          <div style={valueDisplayStyle}>{barGap}px</div>
        </div>

        {/* Label Font Size Control */}
        <div style={controlGroupStyle}>
          <label style={controlLabelStyle}>
            <span>🔤</span>
            LABEL FONT
          </label>
          <div style={sliderContainerStyle}>
            <input
              type="range"
              min="16"
              max="60"
              value={barLabelFontSize}
              onChange={(e) => setBarLabelFontSize(Number(e.target.value))}
              style={{
                ...sliderStyle,
                background: `linear-gradient(90deg, rgba(0, 119, 255, 0.3) 0%, rgba(0, 119, 255, 0.3) ${(barLabelFontSize - 16) / 44 * 100}%, rgba(0, 119, 255, 0.1) ${(barLabelFontSize - 16) / 44 * 100}%, rgba(0, 119, 255, 0.1) 100%)`
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.height = "8px";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.height = "6px";
              }}
            />
          </div>
          <div style={valueDisplayStyle}>{barLabelFontSize}px</div>
        </div>

        {/* Value Font Size Control */}
        <div style={controlGroupStyle}>
          <label style={controlLabelStyle}>
            <span>🔢</span>
            VALUE FONT
          </label>
          <div style={sliderContainerStyle}>
            <input
              type="range"
              min="16"
              max="60"
              value={barValueFontSize}
              onChange={(e) => setBarValueFontSize(Number(e.target.value))}
              style={{
                ...sliderStyle,
                background: `linear-gradient(90deg, rgba(255, 79, 163, 0.3) 0%, rgba(255, 79, 163, 0.3) ${(barValueFontSize - 16) / 44 * 100}%, rgba(0, 119, 255, 0.1) ${(barValueFontSize - 16) / 44 * 100}%, rgba(0, 119, 255, 0.1) 100%)`
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.height = "8px";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.height = "6px";
              }}
            />
          </div>
          <div style={valueDisplayStyle}>{barValueFontSize}px</div>
        </div>
      </div>

      <style>
        {`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff4fa3 0%, #8a4dff 50%, #0077ff 100%);
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 119, 255, 0.3);
            border: 2px solid white;
            transition: all 0.2s ease;
          }

          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 3px 12px rgba(0, 119, 255, 0.4);
          }

          input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff4fa3 0%, #8a4dff 50%, #0077ff 100%);
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 119, 255, 0.3);
            border: 2px solid white;
            transition: all 0.2s ease;
          }

          input[type="range"]::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 3px 12px rgba(0, 119, 255, 0.4);
          }
        `}
      </style>
    </div>
  );
};