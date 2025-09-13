import type React from "react";
import { Button, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

export interface TemplateOptionsProps {
  templateName: string;
  setTemplateName: React.Dispatch<React.SetStateAction<string>>;
//   onSaveTemplate: () => void;
  onEnterBatchRender: () => void;
}

export const TemplateOptionsSection: React.FC<TemplateOptionsProps> = ({
  templateName,
  setTemplateName,
//   onSaveTemplate,
  onEnterBatchRender,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Template Options Box */}
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
          Template Options
        </h3>

        {/* Change Template Name */}
        <TextField
          label="Template Name"
          variant="outlined"
          fullWidth
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />

        {/* Save Template Button */}
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          fullWidth
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            py: 1,
            mb: 2,
            background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
          }}
        //   onClick={onSaveTemplate}
        >
          Save Template
        </Button>

        {/* Enter Batch Rendering Mode */}
        <Button
          variant="outlined"
          startIcon={<ViewModuleIcon />}
          fullWidth
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            py: 1,
            borderColor: "#1976d2",
            color: "#1976d2",
            "&:hover": {
              borderColor: "#1565c0",
              backgroundColor: "rgba(25, 118, 210, 0.04)",
            },
          }}
          onClick={onEnterBatchRender}
        >
          Enter Batch Rendering Mode
        </Button>

        <p
          style={{
            fontSize: "0.85rem",
            color: "#666",
            marginTop: "0.5rem",
          }}
        >
          Use these options to customize, save, and prepare your template for
          batch rendering. Batch mode allows generating multiple variations at
          once.
        </p>
      </div>
    </div>
  );
};
