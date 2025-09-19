import React, { useState, useEffect } from "react";
import { Button, Typography, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export const ExportModal: React.FC<{
  showExport: boolean;
  setShowExport: (val: boolean) => void;
  isExporting: boolean;
  exportUrl: string | null;
  onExport: (format: string) => void;
}> = ({ setShowExport, isExporting, exportUrl, onExport }) => {
  const [format, setFormat] = useState("mp4"); // for next export
  const [previewFormat, setPreviewFormat] = useState<string | null>(null); // for last completed export

  // 🔹 Detect export format from URL when new export finishes
  useEffect(() => {
    if (exportUrl) {
      const ext = exportUrl.split(".").pop()?.toLowerCase();
      if (ext === "gif" || ext === "mp4" || ext === "webm") {
        setPreviewFormat(ext); // ✅ only update when new file comes
      }
    }
  }, [exportUrl]);

  const handleExport = () => {
    onExport(format);
  };

  // const suggestedFilename = `export.${format}`;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setShowExport(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1999,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "60px",
          right: "40px",
          width: "360px",
          background: "#fff",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
          borderRadius: "10px",
          zIndex: 2000,
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Export Project
          </Typography>
          <CloseIcon
            onClick={() => setShowExport(false)}
            style={{ cursor: "pointer", color: "#666" }}
          />
        </div>

        {/* Format Selector */}
        <Typography
          variant="body2"
          style={{ marginBottom: "0.5rem", fontWeight: 500 }}
        >
          Choose format:
        </Typography>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="mp4">MP4 (Video)</option>
          <option value="gif">GIF</option>
          <option value="webm">WebM</option>
        </select>

        {/* Export Button */}
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={isExporting}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            mb: 2,
            background: "#1976d2",
            "&:hover": { background: "#1565c0" },
          }}
        >
          {isExporting ? "Exporting..." : "Start Export"}
        </Button>

        {/* Success message */}
        {!isExporting && exportUrl && (
          <Typography
            variant="body2"
            color="success.main"
            style={{ marginBottom: "0.5rem", fontWeight: 600 }}
          >
            🎉 Your export is ready!
          </Typography>
        )}

        {/* File Preview Area */}
        <div
          style={{
            flex: 1,
            marginTop: "0.5rem",
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "9 / 16",
              maxHeight: 100,
              borderRadius: "6px",
              overflow: "hidden",
              background: "#f9f9f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isExporting ? (
              <CircularProgress size={32} sx={{ color: "#1976d2" }} />
            ) : exportUrl ? (
              previewFormat === "gif" ? (
                <img
                  src={exportUrl}
                  alt="Exported GIF"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <video
                  key={exportUrl}
                  controls
                  src={exportUrl}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    background: "#000",
                  }}
                />
              )
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                style={{
                  textAlign: "center",
                  padding: "0.5rem",
                  fontSize: "0.85rem",
                }}
              >
                📹 Your export will appear here
              </Typography>
            )}
          </div>
        </div>

        {exportUrl && (
          <div
            style={{
              marginTop: "0.75rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              component="a"
              href={exportUrl ?? "#"}
              download={exportUrl.replaceAll("http://localhost:3000/videos/", "")}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!exportUrl || isExporting}
              startIcon={<FileDownloadIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                background: "#1976d2",
                "&:hover": { background: "#1565c0" },
              }}
            >
              Download
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
