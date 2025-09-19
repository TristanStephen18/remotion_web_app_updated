import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
// import EditIcon from "@mui/icons-material/Edit";


export const TopNav: React.FC<{
  templateName: string;
  setTemplateName: (name: string) => void;
  onSwitchMode: () => void;
  onSave: () => void;
  onExport: (format: string) => void; 
  onOpenExport: () => void; 
  template: string;
}> = ({
  onSwitchMode,
  onSave,
  onOpenExport,
  template
}) => {
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
      {/* Left - Logo + Project Name */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            background:
              "linear-gradient(to right, #d81b60 0%, #d81b60 70%, #42a5f5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textFillColor: "transparent",
          }}
        >
          {template}
        </Typography>
      </div>

      {/* Right - Switch Mode + Save + Export + Profile */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button
          variant="outlined"
          startIcon={<SwapHorizIcon />}
          onClick={onSwitchMode}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#d81b60",
            color: "#d81b60",
            "&:hover": { borderColor: "#42a5f5", color: "#42a5f5" },
          }}
        >
          Batch Output Mode
        </Button>

        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={onSave}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "transparent",
            color: "#d81b60",
            "&:hover": { borderColor: "#42a5f5", color: "#42a5f5" },
          }}
        >
          Save
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
