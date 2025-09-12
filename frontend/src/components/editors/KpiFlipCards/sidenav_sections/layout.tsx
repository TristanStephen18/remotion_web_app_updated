import React from "react";

export const CardsLayoutPanel: React.FC<{
  cardWidth: number;
  setCardWidth: (v: number) => void;
  cardHeight: number;
  setCardHeight: (v: number) => void;
  cardBorderRadius: number;
  setCardBorderRadius: (v: number) => void;
  cardGrid: { rows: number; cols: number };
  setCardGrid: (v: { rows: number; cols: number }) => void;
}> = ({
  cardWidth,
  setCardWidth,
  cardHeight,
  setCardHeight,
  cardBorderRadius,
  setCardBorderRadius,
  cardGrid,
  setCardGrid,
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
      <h3 style={{ marginBottom: "1rem", color: "#0077ff" }}>🃏 Cards Layout</h3>

      {/* Card Width */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
          Card Width ({cardWidth}px)
        </label>
        <input
          type="range"
          min={150}
          max={600}
          value={cardWidth}
          onChange={(e) => setCardWidth(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* Card Height */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
          Card Height ({cardHeight}px)
        </label>
        <input
          type="range"
          min={100}
          max={500}
          value={cardHeight}
          onChange={(e) => setCardHeight(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* Border Radius */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
          Card Border Radius ({cardBorderRadius}px)
        </label>
        <input
          type="range"
          min={0}
          max={80}
          value={cardBorderRadius}
          onChange={(e) => setCardBorderRadius(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* Grid */}
      <div>
        <label style={{ color: "#ff4fa3", fontWeight: 600 }}>Card Grid</label>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <div style={{ flex: 1 }}>
            Rows
            <input
              type="number"
              min={1}
              max={5}
              value={cardGrid.rows}
              onChange={(e) =>
                setCardGrid({ ...cardGrid, rows: Number(e.target.value) })
              }
              style={{ width: "100%", padding: "0.4rem", borderRadius: "6px" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            Columns
            <input
              type="number"
              min={1}
              max={5}
              value={cardGrid.cols}
              onChange={(e) =>
                setCardGrid({ ...cardGrid, cols: Number(e.target.value) })
              }
              style={{ width: "100%", padding: "0.4rem", borderRadius: "6px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
