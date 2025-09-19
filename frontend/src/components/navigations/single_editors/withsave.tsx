import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, Typography, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

export const TopNavWithSave: React.FC<{
  templateName?: string;
  setTemplateName?: (name: string) => void;
  onSave: () => void;
  onExport: (format: string) => void;
  onOpenExport: () => void;
  template: string;
  isSaving?: boolean;
}> = ({ onSave, onOpenExport, template, isSaving = false }) => {
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
          {isSaving ? "Saving..." : "Save"}
        </Button>

        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={onOpenExport}
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
