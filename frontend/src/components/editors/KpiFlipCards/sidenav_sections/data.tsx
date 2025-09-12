import React from "react";
import type { CardData } from "../../../remotion_compositions/KpiFlipCards";
// import { CardData } from "../../remotion_compositions/KpiFlipCards";

export const CardDataPanel: React.FC<{
  cardsData: CardData[];
  setCardsData: (v: CardData[]) => void;
}> = ({ cardsData, setCardsData }) => {
  const updateCard = (i: number, key: "front" | "back", field: string, value: string) => {
    const newCards = [...cardsData];
    (newCards[i] as any)[key][field] = value;
    setCardsData(newCards);
  };

  const addCard = () => {
    setCardsData([
      ...cardsData,
      {
        front: { label: "New Label", value: "Value", color: "#0077ff" },
        back: { label: "Back Label", value: "Value", color: "#ff4fa3" },
      },
    ]);
  };

  const removeCard = (i: number) => {
    setCardsData(cardsData.filter((_, idx) => idx !== i));
  };

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
      <h3 style={{ marginBottom: "1rem", color: "#0077ff" }}>📊 Cards Data</h3>

      {cardsData.map((card, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ddd",
            padding: "0.8rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            background: "#fafafa",
          }}
        >
          <strong style={{ color: "#ff4fa3" }}>Card {i + 1}</strong>

          {/* Front */}
          <div style={{ marginTop: "0.5rem" }}>
            <label>Front Label</label>
            <input
              type="text"
              value={card.front.label}
              onChange={(e) => updateCard(i, "front", "label", e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
            <label>Front Value</label>
            <input
              type="text"
              value={card.front.value}
              onChange={(e) => updateCard(i, "front", "value", e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
            <label>Front Color</label>
            <input
              type="color"
              value={card.front.color}
              onChange={(e) => updateCard(i, "front", "color", e.target.value)}
              style={{ width: "100%", height: "35px" }}
            />
          </div>

          {/* Back */}
          <div style={{ marginTop: "0.5rem" }}>
            <label>Back Label</label>
            <input
              type="text"
              value={card.back.label}
              onChange={(e) => updateCard(i, "back", "label", e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
            <label>Back Value</label>
            <input
              type="text"
              value={card.back.value}
              onChange={(e) => updateCard(i, "back", "value", e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
            <label>Back Color</label>
            <input
              type="color"
              value={card.back.color}
              onChange={(e) => updateCard(i, "back", "color", e.target.value)}
              style={{ width: "100%", height: "35px" }}
            />
          </div>

          <button
            onClick={() => removeCard(i)}
            style={{
              marginTop: "0.5rem",
              background: "#ff4fa3",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addCard}
        style={{
          background: "linear-gradient(90deg,#0077ff,#00c6ff)",
          color: "white",
          border: "none",
          padding: "0.6rem 1rem",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        ➕ Add Card
      </button>
    </div>
  );
};
