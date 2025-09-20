import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, Typography, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import React, { useEffect, useRef, useState } from "react";

export const TopNavWithSave: React.FC<{
  templateName?: string;
  setTemplateName?: (name: string) => void;
  onSave: () => void;
  onExport: (format: string) => void;
  onOpenExport: () => void;
  template: string;
  isSaving?: boolean;
  isExporting?: boolean;
}> = ({ onSave, onOpenExport, template, isSaving = false, isExporting = false }) => {
  const savingMessages = [
    "Saving...",
    "Hang tight, almost done...",
    "Crunching data...",
    "Optimizing your template...",
    "Just a moment, making magic...",
    "Finalizing changes..."
  ];
  const [messageIndex, setMessageIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSaving) {
      setMessageIndex(0);
      intervalRef.current = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % savingMessages.length);
      }, 20000);
    } else {
      setMessageIndex(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isSaving]);

  return (
    <div
      style={{
        height: "60px",
        background: "#fff",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            background:
              "linear-gradient(to right, #d81b60 0%, #d81b60 70%, #42a5f5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {template}
        </Typography>
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button
          variant="outlined"
          startIcon={
            isSaving ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          onClick={onSave}
          disabled={isSaving}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "transparent",
            color: "#d81b60",
            "&:hover": { borderColor: "#42a5f5", color: "#42a5f5" },
          }}
        >
          {isSaving ? savingMessages[messageIndex] : "Save"}
        </Button>

        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={onOpenExport}
          disabled={isSaving || isExporting}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "transparent",
            color: "#d81b60",
            "&:hover": { borderColor: "#42a5f5", color: "#42a5f5" },
          }}
        >
          Export
        </Button>
      </div>
    </div>
  );
};
