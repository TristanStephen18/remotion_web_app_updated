import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";

interface SaveProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, setStatus: (s: string) => void) => Promise<void>;
  initialTitle?: string;
}

export const SaveProjectModal: React.FC<SaveProjectModalProps> = ({
  open,
  onClose,
  onSave,
  initialTitle = "",
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setStatus(null);
      setError(null);
      setLoading(false);
    }
  }, [open, initialTitle]);

  const handleSaveClick = async () => {
    if (!title.trim()) {
      setError("Project name is required.");
      return;
    }
    setError(null);
    setLoading(true);
    setStatus("Starting…");

    try {
      // Pass setStatus so the caller can update the modal text (e.g. "Exporting...", "Saving...")
      await onSave(title.trim(), (s) => setStatus(s));
      // success
      setStatus("Done");
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 400); // tiny delay so user sees "Done"
    } catch (err: any) {
      console.error("Save failed:", err);
      const message =
        (err && (err.message || (err.error ?? err))) || "Failed to save project";
      setError(String(message));
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!loading) onClose();
      }}
      PaperProps={{
        sx: {
          borderRadius: "14px",
          padding: 0,
          minWidth: 360,
          maxWidth: 480,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1rem",
          fontWeight: 700,
          textAlign: "center",
          pb: 0,
        }}
      >
        Save Project
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 1 }}>
        <TextField
          label="Project name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          size="small"
          disabled={loading}
          error={!!error}
          helperText={error ?? "Give your project a descriptive name"}
          autoFocus
        />

        {/* Status / progress */}
        <Box mt={2} display="flex" alignItems="center" gap={1}>
          {loading ? (
            <CircularProgress size={18} />
          ) : (
            <Box width={18} height={18} />
          )}
          <Typography
            variant="body2"
            color={status ? "text.primary" : "text.secondary"}
          >
            {status ?? "Enter a name and click Save to this template as a project."}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ borderRadius: 1, textTransform: "none" }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSaveClick}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{
            borderRadius: 1,
            textTransform: "none",
            px: 3,
          }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
