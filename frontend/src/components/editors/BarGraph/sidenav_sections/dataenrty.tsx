import type React from "react";
import type { BargraphData } from "../../../remotion_compositions/BarGraphTemplate";
// import { duration } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

export interface DataPanelProps {
  data: BargraphData[];
  setData: React.Dispatch<React.SetStateAction<BargraphData[]>>;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}

export const DataPanel: React.FC<DataPanelProps> = ({
  data,
  setData,
  setDuration,
}) => {
  const calculateTotatDuration = (numberofbars: number) => {
    let incrementer = 3;
    if (numberofbars > 5) {
      incrementer = 2;
    }

    const TotalDurationSeconds = numberofbars + incrementer;
    setDuration(TotalDurationSeconds);
    return TotalDurationSeconds;
  };
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
  };

  const handleAddItem = () => {
    // console.log(data.entries)
    setData([...data, { name: ``, value: 0 }]);
    // console.log(data.length)
    console.log(calculateTotatDuration(data.length + 1));
  };

  const handleDeleteItem = (index: number) => {
    if (data.length > 1) {
      const newData = data.filter((_, i) => i !== index);
      setData(newData);
      calculateTotatDuration(newData.length);
    }
  };

  const handleItemChange = (
    index: number,
    key: "name" | "value",
    value: string
  ) => {
    const newData = [...data];

    if (key === "value") {
      // Allow only numbers and convert to number type
      const numericValue = value.replace(/[^0-9.]/g, "");
      newData[index][key] = numericValue === "" ? 0 : parseFloat(numericValue);
    } else {
      newData[index][key] = value;
    }

    setData(newData);
  };

  return (
    <div>
      {data.map((item, index) => (
        <div key={index} style={cardStyle}>
          <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
            Item {index + 1}
          </h3>

          <label style={labelStyle}>
            <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
              Item Name
            </div>
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleItemChange(index, "name", e.target.value)}
              style={inputStyle}
              placeholder="Enter item name"
            />
          </label>

          <label style={labelStyle}>
            <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
              Quantity/Value
            </div>
            <input
              type="number"
              value={item.value}
              onChange={(e) => handleItemChange(index, "value", e.target.value)}
              style={inputStyle}
              placeholder="Enter numeric value"
              min="0"
              step="1"
            />
          </label>

          {data.length > 1 && (
            <button
              onClick={() => handleDeleteItem(index)}
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
              Delete Item
            </button>
          )}
        </div>
      ))}

      <button
        onClick={handleAddItem}
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
        ➕ Add Another Item
      </button>
    </div>
  );
};
