import type React from "react";
import type { Slide } from "../../../layout/EditorPreviews/FacstCardTemplate";

export interface FactPanelProps {
  factsArray: Slide[];
  setFactsArray: React.Dispatch<React.SetStateAction<Slide[]>>;
}

export const FactPanel: React.FC<FactPanelProps> = ({
  factsArray,
  setFactsArray,
}) => {
  const cardStyle: React.CSSProperties = {
    marginBottom: "1.5rem",
    padding: "1rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "1rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fafafa",
    fontSize: 16,
  };

  const handleAddFact = () => {
    setFactsArray([...factsArray, { title: "", description: "" }]);
  };

  const handleDeleteFact = (index: number) => {
    if (factsArray.length > 1) {
      const newFacts = factsArray.filter((_, i) => i !== index);
      setFactsArray(newFacts);
    }
  };

  const handleFactChange = (
    index: number,
    key: "title" | "description",
    value: string
  ) => {
    const newFacts = [...factsArray];
    newFacts[index][key] = value;
    setFactsArray(newFacts);
  };

  return (
    <div>
      {factsArray.map((fact, index) => (
        <div key={index} style={cardStyle}>
          <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
            Fact no. {index + 1}
          </h3>

          <label style={labelStyle}>
            <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
              Title
            </div>
            <input
              type="text"
              value={fact.title}
              onChange={(e) => handleFactChange(index, "title", e.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
              Description
            </div>
            <textarea
              value={fact.description}
              onChange={(e) =>
                handleFactChange(index, "description", e.target.value)
              }
              style={inputStyle}
            />
          </label>

          {factsArray.length > 1 && (
            <button
              onClick={() => handleDeleteFact(index)}
              style={{
                marginTop: "0.5rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                color: "white",
                fontWeight: 600,
                background: "#ff4fa3",
              }}
            >
              Delete Fact
            </button>
          )}
        </div>
      ))}

      <button
        onClick={handleAddFact}
        style={{
          marginTop: "0.75rem",
          padding: "0.6rem 1rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          color: "white",
          fontWeight: 600,
          background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          width: "100%",
        }}
      >
        ➕ Add Another Fact
      </button>
    </div>
  );
};
