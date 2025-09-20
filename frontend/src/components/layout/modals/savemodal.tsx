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

const progressMessages = [
  "Still working on saving your project…",
  "Crunching data, almost there…",
  "Polishing up the final details…",
  "Hang tight, just a little longer…",
  "Making sure everything is perfect…",
];

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

  // 🔹 Index for rotating messages
  const [messageIndex, setMessageIndex] = useState(0);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setStatus(null);
      setError(null);
      setLoading(false);
      setMessageIndex(0);
    }
  }, [open, initialTitle]);

  // 🔹 Rotate messages every 20 seconds while loading
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % progressMessages.length);
      setStatus(progressMessages[messageIndex]);
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, [loading, messageIndex]);

  const handleSaveClick = async () => {
    if (!title.trim()) {
      setError("Project name is required.");
      return;
    }
    setError(null);
    setLoading(true);
    setStatus("Starting…");
    setMessageIndex(0);

    try {
      // Pass setStatus so caller can override status messages too
      await onSave(title.trim(), (s) => setStatus(s));
      // success
      setStatus("Done");
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 400);
    } catch (err: any) {
      console.error("Save failed:", err);
      const message =
        (err && (err.message || (err.error ?? err))) || "Failed to save template";
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
        Save this Template?
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 1 }}>
        <TextField
          label="Give your template a name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          size="small"
          disabled={loading}
          error={!!error}
          helperText={error ?? "Give your template a descriptive name"}
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
            {status ?? "Enter a name and click Save to save this template. "}
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
          {loading ? "Saving template..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
