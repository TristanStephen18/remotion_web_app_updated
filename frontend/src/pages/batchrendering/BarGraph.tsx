import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  CircularProgress,
  Paper,
} from "@mui/material";
import { LinearProgress } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CloudIcon from "@mui/icons-material/Cloud";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import MenuIcon from "@mui/icons-material/Menu";
import DatasetIcon from "@mui/icons-material/Dataset";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
// import ColorLensIcon from "@mui/icons-material/ColorLens";
import { barGraphImages, serverImages } from "../../data/backgroundimages";
import { fontFamilies } from "../../data/fontfamilies";
// import { fontsSelections1 } from "../../data/fontcolors";
import type { BarGraphDataset } from "../../models/BarGraph";
import { barGraphConfig } from "../../data/defaultvalues";
import { calculateDurationBarGraph, titleAndSubtitleFontSizeIndicator } from "../../utils/bargraphhelpers";
// import { fontSizeIndicatorQuote } from "../../utils/quotespotlighthelpers";

export const BarGraphBatchRendering: React.FC = () => {
  const [barGraphData, setBarGraphData] = useState<BarGraphDataset[]>([]);
  const [renderQueue, setRenderQueue] = useState<number[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  //   const [selectedFontColors, setSelectedFontColors] = useState<string[]>([]);

  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "dataset" | "backgrounds" | "fonts" | "outputs"
  >("dataset");

  const [datasetQuantity, setDatasetQuantity] = useState<number>(5);
  //   const [quotes, setQuotes] = useState<{ text: string; author: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProgressCard, setShowProgressCard] = useState(true);

  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([]);
  const [selectedFonts, setSelectedFonts] = useState<string[]>([]);

  const [combinations, setCombinations] = useState<any[]>([]);

  const fetchAIDataset = async (quantity: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate/bargraphdataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      console.log(data.data);
      setBarGraphData(data.data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportForCombination = async (combo: any, index: number) => {
    updateCombination(index, { status: "exporting" });
    const fontsizeindicator = titleAndSubtitleFontSizeIndicator(combo.bar.title);
    try {
      let finalImageUrl = combo.bg;
      if (!finalImageUrl.startsWith("http://localhost:3000")) {
        finalImageUrl = `http://localhost:3000${finalImageUrl}`;
      }
      const response = await fetch("/generatevideo/bargraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: combo.bar.data,
          title: combo.bar.title,
          titleFontColor: barGraphConfig.titleFontColor,
          backgroundImage: finalImageUrl,
          accent: barGraphConfig.accent,
          subtitle: combo.bar.subtitle,
          currency: "",
          titleFontSize: fontsizeindicator.titlefontsize,
          subtitleFontSize: fontsizeindicator.subtitlefontsize,
          subtitleColor: barGraphConfig.subtitleColor,
          barHeight: barGraphConfig.barHeight,
          barGap: barGraphConfig.barGap,
          barLabelFontSize: barGraphConfig.barLabelFontSize,
          barValueFontSize: barGraphConfig.barValueFontSize,
          fontFamily: combo.font,
          duration: calculateDurationBarGraph(combo.bar.data.length),
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

  const generateDataset = async () => {
    await fetchAIDataset(datasetQuantity);
  };

  // background/font selection helpers
  const toggleBackground = (bg: string) =>
    setSelectedBackgrounds((prev) =>
      prev.includes(bg) ? prev.filter((b) => b !== bg) : [...prev, bg]
    );
  const toggleFont = (font: string) =>
    setSelectedFonts((prev) =>
      prev.includes(font) ? prev.filter((f) => f !== font) : [...prev, font]
    );
  const selectAllBackgrounds = () => setSelectedBackgrounds([...serverImages]);
  const clearAllBackgrounds = () => setSelectedBackgrounds([]);
  const selectAllFonts = () => setSelectedFonts([...fontFamilies]);
  const clearAllFonts = () => setSelectedFonts([]);

  // inside QuoteSpotlightBatchRendering component
  const handleRemoveQuote = (index: number) => {
    setBarGraphData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateBatch = () => {
    setShowProgressCard(true);
    if (
      barGraphData.length === 0 ||
      selectedBackgrounds.length === 0 ||
      selectedFonts.length === 0
    ) {
      alert(
        "You are missing some selections. Please complete all of the selections first."
      );
      return;
    }
    const combos: any[] = [];
    barGraphData.forEach((bar) => {
      selectedBackgrounds.forEach((bg) => {
        selectedFonts.forEach((font) => {
          combos.push({
            bar,
            bg,
            font,
            status: "pending",
            exportUrl: null,
          });
        });
      });
    });

    console.log(combos);
    setCombinations(combos);
    setRenderQueue(combos.map((_, i) => i)); // indices in order
    setActiveSection("outputs");
    setIsRendering(true);
    setCurrentIndex(0); // start from the first combo
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
              🎬 Bar Graph Template Batch Rendering
            </Typography>
          )}
        </Box>

        {/* nav items */}
        <Box sx={{ flexGrow: 1 }}>
          <NavItem
            icon={<CloudIcon />}
            label="Dataset"
            collapsed={collapsed}
            active={activeSection === "dataset"}
            onClick={() => setActiveSection("dataset")}
          />
          <NavItem
            icon={<WallpaperIcon />}
            label="Backgrounds"
            collapsed={collapsed}
            active={activeSection === "backgrounds"}
            onClick={() => setActiveSection("backgrounds")}
          />
          <NavItem
            icon={<TextFieldsIcon />}
            label="Fonts"
            collapsed={collapsed}
            active={activeSection === "fonts"}
            onClick={() => setActiveSection("fonts")}
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
            onClick={() => window.location.assign("/template/bargraph")}
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

      {/* -------------------
          Main Content
          ------------------- */}
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

          {/* Dataset Section */}
          {activeSection === "dataset" && (
            <Box>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Dataset Configuration
              </Typography>

              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  gap: 3,
                  mb: 3,
                  bgcolor: "#fdfdfd",
                }}
              >
                {/* Dataset Source Selection */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Source
                  </Typography>
                  <ToggleButtonGroup exclusive size="medium">
                    <ToggleButton value="ai">
                      <SmartToyIcon sx={{ mr: 1 }} /> AI Generated
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {/* Quantity Input */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Quantity
                  </Typography>
                  <TextField
                    disabled={isRendering}
                    type="number"
                    value={datasetQuantity}
                    onChange={(e) => setDatasetQuantity(Number(e.target.value))}
                    inputProps={{ min: 1, style: { textAlign: "center" } }}
                    sx={{ width: 120 }}
                    size="small"
                  />
                </Box>

                {/* Action Button */}
                <Box sx={{ ml: "auto" }}>
                  <Button
                    variant="contained"
                    startIcon={<DatasetIcon />}
                    onClick={generateDataset}
                    disabled={isRendering}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      px: 3,
                      fontWeight: 600,
                      textTransform: "none",
                      background: "linear-gradient(90deg,#1976d2,#42a5f5)",
                    }}
                  >
                    Generate Dataset
                  </Button>
                </Box>
              </Paper>

              {/* Loading + results */}
              {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              )}

              {!loading && barGraphData.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2, color: "#1976d2" }}
                  >
                    Generated BarGraph Datasets ({barGraphData.length})
                  </Typography>
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    {/* Header row */}
                    <Box
                      sx={{
                        display: "flex",
                        px: 2,
                        py: 1,
                        bgcolor: "#f5f5f5",
                        fontWeight: 600,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>Title</Box>
                      <Box sx={{ width: "25%" }}>Subtitle</Box>
                      <Box sx={{ width: "35%" }}>Data (name → value)</Box>
                      <Box sx={{ width: 80, textAlign: "center" }}>Action</Box>
                    </Box>

                    {/* Data rows */}
                    {barGraphData.map((dataset, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          px: 2,
                          py: 1.5,
                          borderTop: "1px solid #eee",
                          alignItems: "center",
                        }}
                      >
                        {/* Title */}
                        <Box sx={{ flex: 1, pr: 2, fontSize: "0.95rem" }}>
                          "{dataset.title}"
                        </Box>

                        {/* Subtitle */}
                        <Box
                          sx={{
                            width: "25%",
                            fontSize: "0.9rem",
                            color: "text.secondary",
                          }}
                        >
                          {dataset.subtitle}
                        </Box>

                        {/* Data preview */}
                        <Box
                          sx={{
                            width: "35%",
                            fontSize: "0.85rem",
                            color: "text.secondary",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          {dataset.data.map((d, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                bgcolor: "#f1f5ff",
                                px: 1.2,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: "0.8rem",
                                fontWeight: 500,
                              }}
                            >
                              {d.name}: {d.value}
                            </Box>
                          ))}
                        </Box>

                        {/* Remove */}
                        <Box sx={{ width: 80, textAlign: "center" }}>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveQuote(i)}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Paper>
                </Box>
              )}
            </Box>
          )}

          {/* Backgrounds Section */}
          {activeSection === "backgrounds" && (
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
                  Background Selection
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<SelectAllIcon />}
                    onClick={selectAllBackgrounds}
                    disabled={isRendering}
                  >
                    Select all
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ClearAllIcon />}
                    onClick={clearAllBackgrounds}
                    disabled={isRendering}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(5, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {barGraphImages.map((bg) => {
                  const selected = selectedBackgrounds.includes(bg);
                  return (
                    <Box
                      key={bg}
                      onClick={() => toggleBackground(bg)}
                      sx={{
                        pointerEvents: isRendering ? "none" : "auto", // disables hover/click
                        opacity: isRendering ? 0.5 : 1, // faded look
                        position: "relative",
                        aspectRatio: "1 / 1",
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        border: selected
                          ? "3px solid #1976d2"
                          : "1px solid #ddd",
                        boxShadow: selected
                          ? "0 4px 16px rgba(25,118,210,0.25)"
                          : "none",
                        transition: "all .2s",
                        "&:hover": { transform: "scale(1.02)" },
                      }}
                    >
                      <img
                        src={bg}
                        alt="bg"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      {selected && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "rgba(25,118,210,0.8)",
                            color: "#fff",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                          }}
                        >
                          ✓
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Fonts Section */}
          {activeSection === "fonts" && (
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
                  Font Selection
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<SelectAllIcon />}
                    onClick={selectAllFonts}
                    disabled={isRendering}
                  >
                    Select all
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ClearAllIcon />}
                    onClick={clearAllFonts}
                    disabled={isRendering}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>

              {/* Font Cards */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {fontFamilies.map((font) => {
                  const selected = selectedFonts.includes(font);
                  const cleanLabel = font.replace(/['",]/g, "");
                  return (
                    <Box
                      key={font}
                      onClick={() => toggleFont(font)}
                      sx={{
                        pointerEvents: isRendering ? "none" : "auto", // disables hover/click
                        opacity: isRendering ? 0.5 : 1, // faded look
                        cursor: "pointer",
                        borderRadius: 3,
                        boxShadow: selected
                          ? "0 4px 12px rgba(25,118,210,0.5)"
                          : "0 2px 6px rgba(0,0,0,0.15)",
                        overflow: "hidden",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
                        },
                        bgcolor: "#fff",
                        minHeight: 120,
                        position: "relative",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      {/* Checkmark overlay */}
                      {selected && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: "#1976d2",
                            color: "#fff",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ✓
                        </Box>
                      )}

                      {/* Font Name Styled */}
                      <Typography
                        sx={{
                          fontFamily: font,
                          fontWeight: 600,
                          fontSize: "1.3rem",
                          mb: 1,
                        }}
                      >
                        {cleanLabel}
                      </Typography>

                      {/* Caption */}
                      <Typography variant="caption" color="text.secondary">
                        {font}
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
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Batch Outputs ({combinations.length})
              </Typography>
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
                          maxHeight: 300, // 👈 cap the height
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
                          — {c.bar.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", fontSize: "0.75rem" }}
                        >
                          Font: {c.font} | Color: {c.color}
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

function NavItem({
  icon,
  label,
  collapsed,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: collapsed ? 1.5 : 2,
        py: 1.5,
        cursor: "pointer",
        bgcolor: active ? "rgba(25,118,210,0.08)" : "transparent",
        borderLeft: active ? "4px solid #1976d2" : "4px solid transparent",
        "&:hover": {
          bgcolor: active ? "rgba(25,118,210,0.08)" : "#f6f8fa",
        },
        transition: "all .2s",
      }}
    >
      <Box sx={{ minWidth: 28, display: "flex", justifyContent: "center" }}>
        {icon}
      </Box>
      {!collapsed && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: active ? 700 : 500,
            color: active ? "#1976d2" : "text.primary",
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
}
