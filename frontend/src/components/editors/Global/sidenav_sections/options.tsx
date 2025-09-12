import type React from "react";
import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

export interface OptionsProps {
  showSafeMargins: boolean;
  setShowSafeMargins: React.Dispatch<React.SetStateAction<boolean>>;
  autoSave: boolean;
  setAutoSave: React.Dispatch<React.SetStateAction<boolean>>;
  previewSize: number; // ⭐ new prop
  setPreviewSize: React.Dispatch<React.SetStateAction<number>>; // ⭐ new prop
}

export const OptionSectionTrial: React.FC<OptionsProps> = ({
  setShowSafeMargins,
  showSafeMargins,
  autoSave,
  setAutoSave,
  previewSize, // ⭐
  setPreviewSize, // ⭐
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* View Options Box */}
      <div
        style={{
          padding: "1rem",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          border: "1px solid #eee",
        }}
      >
        <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
          View Options
        </h3>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={showSafeMargins}
            onChange={(e) => setShowSafeMargins(e.target.checked)}
          />
          Show Safe Margins
        </label>
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
          Safe margins help ensure that important content stays visible across
          different screen sizes.
        </p>
      </div>

      {/* Project Options Box */}
      <div
        style={{
          padding: "1rem",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          border: "1px solid #eee",
        }}
      >
        <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
          Project Options
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <span>Auto Save</span>
          <label
            style={{
              position: "relative",
              display: "inline-block",
              width: "44px",
              height: "24px",
            }}
          >
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            {/* Track */}
            <span
              style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: autoSave ? "#4caf50" : "#ccc",
                borderRadius: "24px",
                transition: "0.3s",
              }}
            />
            {/* Knob */}
            <span
              style={{
                position: "absolute",
                height: "18px",
                width: "18px",
                left: autoSave ? "22px" : "4px",
                bottom: "3px",
                backgroundColor: "white",
                borderRadius: "50%",
                transition: "0.3s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
          </label>
        </div>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          fullWidth
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            py: 1,
            background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
          }}
          onClick={() => console.log("Save clicked")}
        >
          Save Project
        </Button>

        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
          Use this button to manually save your project settings. Auto Save will
          keep your progress safe in the background, but manual save ensures you
          don’t miss a beat.
        </p>
      </div>

      {/* Live Preview Settings Box */}
      <div
        style={{
          padding: "1rem",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          border: "1px solid #eee",
        }}
      >
        <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
          Live Preview Settings
        </h3>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          <span>
            Live Preview Size: <strong>{previewSize * 100}%</strong>
          </span>
          <input
            type="range"
            min="0.5"
            max="1.2"
            step={0.001}
            value={previewSize}
            onChange={(e) => setPreviewSize(Number(e.target.value))}
          />
        </label>
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
          Adjust the live preview size to better fit your workspace. Smaller
          previews take less space, while larger ones help you see more detail.
        </p>
      </div>
    </div>
  );
};
