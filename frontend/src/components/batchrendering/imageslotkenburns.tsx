import { Box, Button } from "@mui/material";
import React from "react";

export const ImageSlot: React.FC<{
  index: number;
  img: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  isRendering: boolean;
}> = ({ index, img, onUpload, onRemove, isRendering }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = ""; // reset input
  };

  const isEmpty = !img;

  return (
    <Box
      sx={{
        pointerEvents: isRendering ? "none" : "auto", // disables hover/click
        opacity: isRendering ? 0.5 : 1, // faded look
        position: "relative",
        width: "100%",
        height: 200,
        border: isEmpty ? "2px dashed #c6c9d6" : "2px solid #1976d2",
        borderRadius: 2,
        bgcolor: "#fafafa",
        backgroundImage: isEmpty ? "none" : `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <input
        type="file"
        accept="image/*"
        id={`image-upload-${index}`}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {isEmpty ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: "center",
          }}
        >
          <label
            htmlFor={`image-upload-${index}`}
            style={{
              padding: "6px 12px",
              background: "#1976d2",
              color: "white",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Upload
          </label>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={onRemove}
          >
            Remove Slot
          </Button>
        </Box>
      ) : (
        <Button
          disabled={isRendering}
          variant="contained"
          color="error"
          size="small"
          sx={{ position: "absolute", bottom: 8, right: 8 }}
          onClick={onRemove}
        >
          Remove
        </Button>
      )}
    </Box>
  );
};
