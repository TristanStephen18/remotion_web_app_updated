import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { LinearProgress } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import BurstModeIcon from "@mui/icons-material/BurstMode";
import DownloadIcon from "@mui/icons-material/Download";

import Filter9PlusIcon from "@mui/icons-material/Filter9Plus";
import MenuIcon from "@mui/icons-material/Menu";
import DatasetIcon from "@mui/icons-material/Dataset";

import ViewModuleIcon from "@mui/icons-material/ViewModule";

import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import { kenBurnsProportions } from "../../data/kenburnsproportions";
import {
  kenBurnsDurationCalculator,
  kenBurnsProportionHelper,
} from "../../utils/kenburnshelper";
import { ImageSlot } from "../../components/batchrendering/imageslotkenburns";
import NavItem from "../../components/navigations/batchrendering/NavItems";

export const KenBurnsSwipeBatchRendering: React.FC = () => {
  // const [jobId, setJobId] = useState("");
  const [userImages, setUserImages] = useState<string[]>([]);
  const [imageQuantities, setImageQuantities] = useState<number[]>();
  const [selectedProportions, setSelectedProportions] = useState<string[]>();
  const [renderQueue, setRenderQueue] = useState<number[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "images" | "quantity" | "proportions" | "outputs"
  >("images");
  //   const [loading, setLoading] = useState(false);
  const [showProgressCard, setShowProgressCard] = useState(true);

  const [combinations, setCombinations] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleExportForCombination = async (combo: any, index: number) => {
    updateCombination(index, { status: "exporting" });
    try {
      const response = await fetch("/generatevideo/kenburnsswipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: combo.images,
          cardHeightRatio: kenBurnsProportionHelper(combo.proportion).height,
          cardWidthRatio: kenBurnsProportionHelper(combo.proportion).width,
          duration: kenBurnsDurationCalculator(combo.images.length),
          format: "mp4",
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      updateCombination(index, { status: "ready", exportUrl: data.url });
    } catch (err) {
      console.error("Export failed:", err);
      updateCombination(index, { status: "error" });
    }
  };

  const handleGenerateBatch = () => {
    setShowProgressCard(true);
    if (
      !userImages.length ||
      !imageQuantities?.length ||
      !selectedProportions?.length
    ) {
      alert(
        "Please upload images, select quantities, and proportions before generating."
      );
      return;
    }

    const combos: any[] = [];

    imageQuantities.forEach((qty) => {
      // loop through sliding windows of size qty
      for (let i = 0; i <= userImages.length - qty; i++) {
        const imgSet = userImages
          .slice(i, i + qty)
          .map((url) =>
            url.startsWith("http://localhost:3000")
              ? url
              : `http://localhost:3000${url}`
          );

        selectedProportions.forEach((prop) => {
          combos.push({
            images: imgSet, // array of image urls
            proportion: prop, // selected proportion
            status: "pending", // initial render state
            exportUrl: null, // placeholder for rendered result
          });
        });
      }
    });

    console.log("Generated combos:", combos);

    setCombinations(combos);
    setRenderQueue(combos.map((_, i) => i));
    setActiveSection("outputs");
    setIsRendering(true);
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (!isRendering || currentIndex === null) return;

    const combo = combinations[currentIndex];
    if (!combo) return;

    const renderNext = async () => {
      await handleExportForCombination(combo, currentIndex);

      // move to next index
      setCurrentIndex((prev) => {
        if (prev === null) return null;
        if (prev + 1 < renderQueue.length) {
          return prev + 1;
        } else {
          setIsRendering(false); // ✅ finished
          return null;
        }
      });
    };

    renderNext();
  }, [isRendering, currentIndex]);

  const updateCombination = (index: number, updates: Partial<any>) => {
    setCombinations((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...updates } : c))
    );
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#fafafa" }}>
      <Box
        sx={{
          width: collapsed ? 72 : 260,
          flexShrink: 0,
          bgcolor: "#fff",
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* top title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            p: 2,
            borderBottom: "1px solid #eee",
          }}
        >
          {collapsed ? (
            <IconButton onClick={() => setCollapsed(false)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{
                background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              🎬 Ken Burns Carousel Batch Rendering
            </Typography>
          )}
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <NavItem
            icon={<BurstModeIcon />}
            label="Images"
            collapsed={collapsed}
            active={activeSection === "images"}
            onClick={() => setActiveSection("images")}
          />
          <NavItem
            icon={<Filter9PlusIcon />}
            label="Image Counts"
            collapsed={collapsed}
            active={activeSection === "quantity"}
            onClick={() => setActiveSection("quantity")}
          />
          <NavItem
            icon={<PhotoSizeSelectLargeIcon />}
            label="Proportions"
            collapsed={collapsed}
            active={activeSection === "proportions"}
            onClick={() => setActiveSection("proportions")}
          />
          <NavItem
            icon={<ViewModuleIcon />}
            label="Batch Outputs"
            collapsed={collapsed}
            active={activeSection === "outputs"}
            onClick={() => setActiveSection("outputs")}
          />
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #eee",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {/* Switch Mode */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<SwapHorizIcon />}
            disabled={isRendering}
            onClick={() => window.location.assign("/template/kenburnscarousel")}
            sx={{
              borderRadius: 2,
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Single Output Mode
          </Button>

          {/* Generate Batch */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<DatasetIcon />}
            onClick={handleGenerateBatch}
            disabled={isRendering}
            sx={{
              borderRadius: 2,
              py: 1.5,
              textTransform: "none",
              fontWeight: 700,
              background: "linear-gradient(90deg,#1976d2,#42a5f5)",
            }}
          >
            🚀 Generate Batch
          </Button>
        </Box>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {showProgressCard &&
            (isRendering ||
              (currentIndex === null && combinations.length > 0)) && (
              <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1300 }}>
                <Paper
                  elevation={4}
                  sx={{
                    px: 2,
                    py: 1.5,
                    minWidth: 240,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {isRendering ? (
                    <>
                      {/* Header */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          Rendering...
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {currentIndex !== null ? currentIndex + 1 : 0}/
                          {renderQueue.length}
                        </Typography>
                      </Box>

                      {/* Progress Bar */}
                      <LinearProgress
                        variant="determinate"
                        value={((currentIndex ?? 0) / renderQueue.length) * 100}
                        sx={{ height: 8, borderRadius: 5 }}
                      />

                      {/* Percentage */}
                      <Typography
                        variant="caption"
                        align="right"
                        sx={{ mt: 0.5, color: "text.secondary" }}
                      >
                        {Math.round(
                          ((currentIndex ?? 0) / renderQueue.length) * 100
                        )}
                        %
                      </Typography>
                    </>
                  ) : (
                    <>
                      {/* Finished UI */}
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ mb: 1 }}
                      >
                        🎉 Rendering Finished
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setActiveSection("outputs")}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => setShowProgressCard(false)} // ✅ only hides card
                        >
                          Dismiss
                        </Button>
                      </Box>
                    </>
                  )}
                </Paper>
              </Box>
            )}
          {/* images Section */}
          {activeSection === "images" && (
            <Box>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Images Upload
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {userImages.map((img, i) => (
                  <ImageSlot
                    key={i}
                    index={i}
                    img={img}
                    isRendering={isRendering}
                    onUpload={async (file: any) => {
                      const formData = new FormData();
                      formData.append("image", file);

                      try {
                        const res = await fetch(
                          "/uploadhandler/upload-kenburns-image",
                          {
                            method: "POST",
                            body: formData,
                          }
                        );
                        const data = await res.json();
                        if (res.ok) {
                          setUserImages((prev) => {
                            const newArr = [...prev];
                            newArr[i] = data.url;
                            return newArr;
                          });
                        } else {
                          alert(
                            "Upload failed: " + (data.error || "Unknown error")
                          );
                        }
                      } catch (err) {
                        console.error("Upload failed:", err);
                        alert("Upload failed");
                      }
                    }}
                    onRemove={() =>
                      setUserImages((prev) =>
                        prev.filter((_, idx) => idx !== i)
                      )
                    }
                  />
                ))}

                {/* Add single image button */}
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    id="add-image-upload"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploading(true);
                      setUploadError(null);

                      const formData = new FormData();
                      formData.append("image", file);

                      try {
                        const res = await fetch(
                          "/uploadhandler/upload-kenburns-image",
                          {
                            method: "POST",
                            body: formData,
                          }
                        );
                        const data = await res.json();
                        if (res.ok) {
                          setUserImages((prev) => [...prev, data.url]);
                        } else {
                          setUploadError(
                            data.error || "Upload failed. Please try again."
                          );
                        }
                      } catch (err) {
                        console.error("Upload failed:", err);
                        setUploadError("Unexpected error during upload.");
                      } finally {
                        setIsUploading(false);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />

                  <Box
                    onClick={() =>
                      !isUploading &&
                      document.getElementById("add-image-upload")?.click()
                    }
                    sx={{
                      height: 200,
                      border: "2px dashed #1976d2",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: isUploading ? "not-allowed" : "pointer",
                      fontSize: 40,
                      fontWeight: 700,
                      color: "#1976d2",
                      bgcolor: isUploading ? "#e0e0e0" : "#f9fbff",
                      "&:hover": {
                        bgcolor: isUploading ? "#e0e0e0" : "#eef5ff",
                      },
                      position: "relative",
                    }}
                  >
                    {isUploading ? (
                      <CircularProgress size={32} color="primary" />
                    ) : (
                      "+"
                    )}
                  </Box>

                  {uploadError && (
                    <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                      {uploadError}
                    </Typography>
                  )}
                </Box>

                {/* Add folder upload button */}
                <Box>
                  <input
                    type="file"
                    id="add-folder-upload"
                    style={{ display: "none" }}
                    // @ts-ignore directory upload attributes
                    webkitdirectory="true"
                    directory="true"
                    multiple
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      setIsUploading(true);
                      setUploadError(null);

                      const formData = new FormData();
                      Array.from(files).forEach((file) => {
                        formData.append("images", file);
                      });

                      try {
                        const res = await fetch(
                          "/uploadhandler/upload-kenburns-folder",
                          {
                            method: "POST",
                            body: formData,
                          }
                        );
                        const data = await res.json();
                        if (res.ok) {
                          setUserImages((prev) => [
                            ...prev,
                            ...data.images.map((img: any) => img.url),
                          ]);
                        } else {
                          setUploadError(data.error || "Folder upload failed.");
                        }
                      } catch (err) {
                        console.error("Folder upload failed:", err);
                        setUploadError(
                          "Unexpected error during folder upload."
                        );
                      } finally {
                        setIsUploading(false);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />

                  <Box
                    onClick={() =>
                      !isUploading &&
                      document.getElementById("add-folder-upload")?.click()
                    }
                    sx={{
                      height: 200,
                      border: "2px dashed #388e3c",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: isUploading ? "not-allowed" : "pointer",
                      fontSize: 32,
                      fontWeight: 700,
                      color: "#388e3c",
                      bgcolor: isUploading ? "#e0e0e0" : "#f1fff4",
                      "&:hover": {
                        bgcolor: isUploading ? "#e0e0e0" : "#e6ffea",
                      },
                      position: "relative",
                    }}
                  >
                    {isUploading ? (
                      <CircularProgress size={32} color="success" />
                    ) : (
                      "📂"
                    )}
                  </Box>

                  {uploadError && (
                    <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                      {uploadError}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}
          {/* Image Quantity Section*/}
          {activeSection === "quantity" && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h5" fontWeight={700}>
                  Number of Images per Video
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={isRendering}
                    onClick={() => {
                      if (userImages.length > 1) {
                        const allOptions = Array.from(
                          { length: userImages.length - 1 },
                          (_, i) => i + 2
                        );
                        setImageQuantities(allOptions);
                      }
                    }}
                  >
                    Select All
                  </Button>
                  <Button
                    disabled={isRendering}
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => setImageQuantities([])}
                  >
                    Clear All
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {userImages.length > 1 ? (
                  Array.from({ length: userImages.length - 1 }, (_, i) => {
                    const qty = i + 2; // start at 2
                    const isSelected = imageQuantities?.includes(qty);

                    return (
                      <Box
                        key={qty}
                        onClick={() => {
                          setImageQuantities((prev) => {
                            if (!prev) return [qty];
                            return prev.includes(qty)
                              ? prev.filter((x) => x !== qty)
                              : [...prev, qty];
                          });
                        }}
                        sx={{
                          pointerEvents: isRendering ? "none" : "auto",
                          opacity: isRendering ? 0.5 : 1,
                          border: isSelected
                            ? "2px solid #1976d2"
                            : "2px dashed #c6c9d6",
                          borderRadius: 2,
                          p: 2,
                          cursor: "pointer",
                          bgcolor: isSelected ? "#e3f2fd" : "#fafafa",
                          transition: "0.2s",
                          "&:hover": {
                            border: "2px solid #1976d2",
                            bgcolor: "#f0f7ff",
                          },
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        {/* Stacked container visualization */}
                        <Box
                          sx={{
                            position: "relative",
                            width: 60,
                            height: 80,
                            display: "flex",
                            alignItems: "flex-end", // so label sits at bottom
                            justifyContent: "center",
                          }}
                        >
                          {Array.from({ length: qty }, (_, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                position: "absolute",
                                top: idx * 3,
                                left: idx * 3,
                                width: "100%",
                                height: "90%",
                                borderRadius: 1,
                                border: "1px solid #aaa",
                                bgcolor: "white",
                                zIndex: qty - idx,
                                boxShadow: 1,
                              }}
                            />
                          ))}

                          {/* Number label overlay */}
                          <Typography
                            variant="caption"
                            fontWeight={700}
                            sx={{
                              position: "absolute",
                              bottom: 4, // or "top: 4" if you prefer it above
                              left: "50%",
                              transform: "translateX(-50%)",
                              bgcolor: "rgba(25,118,210,0.9)",
                              color: "white",
                              px: 1,
                              py: 0.2,
                              borderRadius: 1,
                              fontSize: "0.75rem",
                              zIndex: qty + 5, // 👈 make sure it's above all stacked boxes
                            }}
                          >
                            {qty}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Typography color="text.secondary">
                    Upload at least 2 images to enable this section.
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          {/* Proportions */}
          {activeSection === "proportions" && (
            <Box>
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h5" fontWeight={700}>
                  Image Proportions
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    disabled={isRendering}
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      setSelectedProportions([...kenBurnsProportions])
                    }
                  >
                    Select All
                  </Button>
                  <Button
                    disabled={isRendering}
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => setSelectedProportions([])}
                  >
                    Clear All
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {kenBurnsProportions.map((prop) => {
                  const isSelected = selectedProportions?.includes(prop);

                  // Hardcoded sizes
                  let shapeStyle = { width: 60, height: 80 }; // fallback
                  switch (prop) {
                    case "large square":
                      shapeStyle = { width: 100, height: 100 };
                      break;
                    case "normal square":
                      shapeStyle = { width: 70, height: 70 };
                      break;
                    case "large rectangle":
                      shapeStyle = { width: 70, height: 110 };
                      break;
                    case "normal rectangle":
                      shapeStyle = { width: 60, height: 90 };
                      break;
                    case "small rectangle":
                      shapeStyle = { width: 50, height: 70 };
                      break;
                  }

                  return (
                    <Box
                      key={prop}
                      onClick={() => {
                        setSelectedProportions((prev) => {
                          if (!prev) return [prop];
                          return prev.includes(prop)
                            ? prev.filter((p) => p !== prop)
                            : [...prev, prop];
                        });
                      }}
                      sx={{
                        pointerEvents: isRendering ? "none" : "auto", // disables hover/click
                        opacity: isRendering ? 0.5 : 1, // faded look
                        border: isSelected
                          ? "2px solid #1976d2"
                          : "2px dashed #c6c9d6",
                        borderRadius: 2,
                        p: 2,
                        cursor: "pointer",
                        bgcolor: isSelected ? "#e3f2fd" : "#fafafa",
                        transition: "0.2s",
                        "&:hover": {
                          border: "2px solid #1976d2",
                          bgcolor: "#f0f7ff",
                        },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {/* Shape visualization */}
                      <Box
                        sx={{
                          ...shapeStyle,
                          bgcolor: "#1976d2",
                          borderRadius: 1,
                        }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        sx={{ textAlign: "center" }}
                      >
                        {prop}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
          {/* Batch Outputs Section */}
          {activeSection === "outputs" && (
            <Box>
              {/* Title + Download button row */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ flexGrow: 1 }}>
                  Batch Outputs ({combinations.length})
                </Typography>

                {/* Show only when rendering is done and at least one video is ready */}
                {!isRendering && combinations.some((c) => c.exportUrl) && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={() => {
                      combinations.forEach((c, i) => {
                        if (c.exportUrl) {
                          const link = document.createElement("a");
                          link.href = c.exportUrl;
                          console.log(c.exportUrl);
                          link.download = `batch_output_${i + 1}.mp4`;
                          link.click();
                        }
                      });
                    }}
                  >
                    Download All
                  </Button>
                )}
              </Box>

              {combinations.length === 0 ? (
                <Typography color="text.secondary">
                  No batch generated yet.
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, 1fr)",
                      sm: "repeat(3, 1fr)",
                      md: "repeat(4, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  {combinations.map((c, i) => (
                    <Box
                      key={i}
                      sx={{
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        p: 1,
                      }}
                    >
                      {/* Video or Placeholder */}
                      <Box
                        sx={{
                          width: "100%",
                          aspectRatio: "9 / 16",
                          maxHeight: 300,
                          borderRadius: 2,
                          overflow: "hidden",
                          bgcolor: "#f9f9f9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {c.exportUrl ? (
                          <video
                            controls
                            src={c.exportUrl}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : c.status === "exporting" ? (
                          <CircularProgress size={32} />
                        ) : c.status === "error" ? (
                          <Typography color="error" fontSize="0.85rem">
                            ❌ Export failed
                          </Typography>
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              textAlign: "center",
                              p: 1,
                              fontSize: "0.85rem",
                            }}
                          >
                            📹 Waiting to render...
                          </Typography>
                        )}
                      </Box>

                      {/* Meta Info */}
                      <Box sx={{ mt: 0.5, textAlign: "center" }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{ fontSize: "0.85rem" }}
                        >
                          — {c.images.length} images
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", fontSize: "0.75rem" }}
                        >
                          Proportion {c.proportion}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};
