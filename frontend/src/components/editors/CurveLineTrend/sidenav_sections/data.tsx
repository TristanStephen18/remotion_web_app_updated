import React from "react";

export interface DataPoint {
  label: number;
  value: number;
}

interface DataPanelProps {
  data: DataPoint[];
  setData: React.Dispatch<React.SetStateAction<DataPoint[]>>;
  dataType: "$" | "%" | "#" | "number";
  setDataType: React.Dispatch<
    React.SetStateAction<"$" | "%" | "#" | "number">
  >;
}

export const CurveLineTrendDataPanel: React.FC<DataPanelProps> = ({
  data,
  setData,
  dataType,
  setDataType,
}) => {
  const cardStyle: React.CSSProperties = {
    marginBottom: "1.5rem",
    padding: "1rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
    width: "100%",
    boxSizing: "border-box",
  };

  const inputStyle: React.CSSProperties = {
    padding: "0.6rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fafafa",
    fontSize: 14,
    flex: 1,
    minWidth: 0, // <-- lets flexbox shrink without overflow
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "0.5rem 0.8rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: "nowrap",
  };

  const addRow = () => {
    setData((prev) => [...prev, { label: 0, value: 0 }]);
  };

  const updateRow = (index: number, key: "label" | "value", value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [key]: value };
    setData(updated);
  };

  const deleteRow = (index: number) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Data Card */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: "1rem", color: "#0077ff" }}>Dataset</h3>

        {/* Data Type Selector */}
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.3rem",
              color: "#ff4fa3",
              fontWeight: 500,
            }}
          >
            Data Type
          </label>
          <select
            value={dataType}
            onChange={(e) =>
              setDataType(e.target.value as "$" | "%" | "#" | "number")
            }
            style={{
              ...inputStyle,
              width: "100%",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <option value="$">💲 Dollar ($)</option>
            <option value="%">📊 Percent (%)</option>
            <option value="#">🔢 Count (#)</option>
            <option value="number">🔹 Number</option>
          </select>
        </div>

        {/* Data Table */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {data.map((point, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                flexWrap: "wrap", // <-- makes it stack when container shrinks
              }}
            >
              <input
                type="text"
                value={point.label}
                onChange={(e) => updateRow(index, "label", Number(e.target.value))}
                style={{
                  ...inputStyle,
                  flex: "0 1 100px", // flexible min width, but grows
                  maxWidth: "150px",
                }}
              />
              <input
                type="number"
                value={point.value}
                onChange={(e) =>
                  updateRow(index, "value", Number(e.target.value))
                }
                style={{ ...inputStyle, flex: "1 1 auto" }}
              />
              <button
                onClick={() => deleteRow(index)}
                style={{
                  ...buttonStyle,
                  background: "#ff4fa3",
                  color: "white",
                  flex: "0 0 auto",
                }}
              >
                ✖
              </button>
            </div>
          ))}
        </div>

        {/* Add Row Button */}
        <button
          onClick={addRow}
          style={{
            ...buttonStyle,
            marginTop: "1rem",
            background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
            color: "white",
            width: "100%",
          }}
        >
          ➕ Add Data Point
        </button>
      </div>
    </div>
  );
};
