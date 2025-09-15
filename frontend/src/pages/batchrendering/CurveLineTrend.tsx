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
import AnimationIcon from "@mui/icons-material/Animation";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import MenuIcon from "@mui/icons-material/Menu";
import DatasetIcon from "@mui/icons-material/Dataset";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
// import ColorLensIcon from "@mui/icons-material/ColorLens";
import { fontFamilies } from "../../data/fontfamilies";
import type { CurveLineTrendDataset } from "../../models/CurveLineTrend";
import { graphThemes } from "../../data/curvelinethemes";
import { durationCalculatorForCurveLineAnimationSpeeds } from "../../utils/curvelinetrendhelpers";
import { curvelineDefaultdata } from '../../data/defaultvalues';

type SpeedOption = "slow" | "normal" | "fast";

const speedMap: Record<SpeedOption, number> = {
  slow: 0.5,
  normal: 1,
  fast: 1.5,
};

export const CurveLineTrendBatchRendering: React.FC = () => {
  //   const [curveLineData, setcurveLineData] = useState<curveLineDataset[]>([]);
  const [curveLineData, setCurveLineData] = useState<CurveLineTrendDataset[]>(
    []
  );
  const [animationSpeeds, setAnimationSpeed] = useState<string[]>([]);
  const [renderQueue, setRenderQueue] = useState<number[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  //   const [selectedFontColors, setSelectedFontColors] = useState<string[]>([]);

  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "dataset" | "presets" | "fonts" | "animation" | "outputs"
  >("dataset");

  const [datasetQuantity, setDatasetQuantity] = useState<number>(5);
  //   const [quotes, setQuotes] = useState<{ text: string; author: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProgressCard, setShowProgressCard] = useState(true);

  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [selectedFonts, setSelectedFonts] = useState<string[]>([]);

  const [combinations, setCombinations] = useState<any[]>([]);

  const fetchAIDataset = async (quantity: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate/curvelinedataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      console.log(data.data);
      setCurveLineData(data.data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportForCombination = async (combo: any, index: number) => {
    updateCombination(index, { status: "exporting" });
    const dynamicduration = durationCalculatorForCurveLineAnimationSpeeds(combo.speed);
    // const fontsizeindicator = titleAndSubtitleFontSizeIndicator(combo.bar.title);
    try {
      const response = await fetch("/generatevideo/curvelinetrend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            title: combo.cldata.title,
            subtitle: combo.cldata.subtitle,
            titleFontSize: curvelineDefaultdata.titleFontSize,
            subtitleFontSize: curvelineDefaultdata.subtitleFontSize,
            fontFamily: combo.font,
            data: combo.cldata.data,
            dataType:combo.cldata.dataType,
            preset:combo.theme,
            backgroundImage: "",
            animationSpeed: combo.speed,
            minimalMode: curvelineDefaultdata.minimalmode,
            duration: dynamicduration,
          },
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
    setSelectedPresets((prev) =>
      prev.includes(bg) ? prev.filter((b) => b !== bg) : [...prev, bg]
    );
  const toggleFont = (font: string) =>
    setSelectedFonts((prev) =>
      prev.includes(font) ? prev.filter((f) => f !== font) : [...prev, font]
    );
  // const selectAllPresets = () => setSelectedPresets([...serverImages]);
  const clearAllPresets = () => setSelectedPresets([]);
  const selectAllFonts = () => setSelectedFonts([...fontFamilies]);
  const clearAllFonts = () => setSelectedFonts([]);


  const handleGenerateBatch = () => {
    setShowProgressCard(true);
    if (
      curveLineData.length === 0 ||
      selectedPresets.length === 0 ||
      selectedFonts.length === 0 ||
      animationSpeeds.length === 0
    ) {
      alert(
        "You are missing some selections. Please complete all of the selections first."
      );
      return;
    }

    const combos: any[] = [];

    curveLineData.forEach((dataset) => {
      selectedPresets.forEach((themeName) => {
        selectedFonts.forEach((font) => {
          animationSpeeds.forEach((speed) => {
            combos.push({
              cldata: dataset, // your dataset
              theme: themeName, // picked theme
              font, // picked font
              speed, // animation speed
              status: "pending",
              exportUrl: null,
            });
          });
        });
      });
    });

    console.log("Generated combos:", combos);
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
              🎬 Curve Line Trend Batch Rendering
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
            label="Presets/Themes"
            collapsed={collapsed}
            active={activeSection === "presets"}
            onClick={() => setActiveSection("presets")}
          />
          <NavItem
            icon={<TextFieldsIcon />}
            label="Fonts"
            collapsed={collapsed}
            active={activeSection === "fonts"}
            onClick={() => setActiveSection("fonts")}
          />
          <NavItem
            icon={<AnimationIcon />}
            label="Animation Speeds"
            collapsed={collapsed}
            active={activeSection === "animation"}
            onClick={() => setActiveSection("animation")}
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
            onClick={() => window.location.assign("/template/curvelinetrend")}
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

              {!loading && curveLineData.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2, color: "#1976d2" }}
                  >
                    Generated CurveLine Datasets ({curveLineData.length})
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
                      <Box sx={{ width: "35%" }}>Data (label → value)</Box>
                      <Box sx={{ width: 120 }}>Type</Box>
                      <Box sx={{ width: 80, textAlign: "center" }}>Action</Box>
                    </Box>

                    {/* Data rows */}
                    {curveLineData.map((dataset, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          px: 2,
                          py: 1,
                          borderBottom: "1px solid #eee",
                          alignItems: "center",
                        }}
                      >
                        {/* Title */}
                        <Box sx={{ flex: 1, fontWeight: 500 }}>
                          {dataset.title}
                        </Box>

                        {/* Subtitle */}
                        <Box sx={{ width: "25%", color: "text.secondary" }}>
                          {dataset.subtitle}
                        </Box>

                        {/* Data points */}
                        <Box
                          sx={{
                            width: "35%",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          {dataset.data.map((d, i) => (
                            <Box
                              key={i}
                              sx={{
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor: "#e3f2fd",
                                fontSize: "0.8rem",
                              }}
                            >
                              {d.label} → {d.value}
                            </Box>
                          ))}
                        </Box>

                        {/* Data Type */}
                        <Box
                          sx={{
                            width: 120,
                            fontSize: "0.85rem",
                            color: "text.secondary",
                          }}
                        >
                          {dataset.dataType}
                        </Box>

                        {/* Actions */}
                        <Box sx={{ width: 80, textAlign: "center" }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() =>
                              setCurveLineData((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
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
          {/* Presets Section (refactored to themes) */}
          {activeSection === "presets" && (
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
                  Theme Selection
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<SelectAllIcon />}
                    onClick={() => setSelectedPresets(Object.keys(graphThemes))}
                    disabled={isRendering}
                  >
                    Select all
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ClearAllIcon />}
                    onClick={clearAllPresets}
                    disabled={isRendering}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>

              {/* Theme Cards */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {Object.entries(graphThemes).map(([themeName, theme]) => {
                  const selected = selectedPresets.includes(themeName);
                  return (
                    <Box
                      key={themeName}
                      onClick={() => toggleBackground(themeName)}
                      sx={{
                        cursor: "pointer",
                        borderRadius: 3,
                        overflow: "hidden",
                        position: "relative",
                        height: 140,
                        boxShadow: selected
                          ? "0 6px 18px rgba(25,118,210,0.5)"
                          : "0 2px 8px rgba(0,0,0,0.1)",
                        border: selected
                          ? "2px solid #1976d2"
                          : "1px solid #e5e7eb",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                        },
                        pointerEvents: isRendering ? "none" : "auto",
                        opacity: isRendering ? 0.6 : 1,
                        background: theme.bgGradient,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        p: 2,
                        color: theme.labelText,
                      }}
                    >
                      {/* Checkmark Overlay */}
                      {selected && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            bgcolor: "#1976d2",
                            color: "#fff",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.9rem",
                          }}
                        >
                          ✓
                        </Box>
                      )}

                      {/* Theme Name */}
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {themeName}
                      </Typography>

                      {/* Color Preview Row */}
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {["dot", "axisText", "accent"].map((key) => (
                          <Box
                            key={key}
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              bgcolor: (theme as any)[key],
                              border: "1px solid rgba(0,0,0,0.2)",
                            }}
                          />
                        ))}
                      </Box>
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

          {/* Animation Speeds Section */}
          {activeSection === "animation" && (
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
                  Animation Speed Selection
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<SelectAllIcon />}
                    onClick={() =>
                      setAnimationSpeed(["slow", "normal", "fast"])
                    }
                    disabled={isRendering}
                  >
                    Select all
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ClearAllIcon />}
                    onClick={() => setAnimationSpeed([])}
                    disabled={isRendering}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>

              {/* Speed Cards */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(3, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {(["slow", "normal", "fast"] as SpeedOption[]).map((speed) => {
                  const selected = animationSpeeds.includes(speed);
                  return (
                    <Box
                      key={speed}
                      onClick={() =>
                        setAnimationSpeed((prev) =>
                          prev.includes(speed)
                            ? prev.filter((s) => s !== speed)
                            : [...prev, speed]
                        )
                      }
                      sx={{
                        cursor: "pointer",
                        borderRadius: 3,
                        overflow: "hidden",
                        position: "relative",
                        height: 200,
                        boxShadow: selected
                          ? "0 6px 18px rgba(25,118,210,0.5)"
                          : "0 2px 8px rgba(0,0,0,0.1)",
                        border: selected
                          ? "2px solid #1976d2"
                          : "1px solid #e5e7eb",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                        },
                        pointerEvents: isRendering ? "none" : "auto",
                        opacity: isRendering ? 0.6 : 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        bgcolor: "#000",
                      }}
                    >
                      {/* Checkmark */}
                      {selected && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            bgcolor: "#1976d2",
                            color: "#fff",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.9rem",
                            zIndex: 2,
                          }}
                        >
                          ✓
                        </Box>
                      )}

                      {/* Video preview */}
                      <video
                        src="/animation.mp4"
                        autoPlay
                        loop
                        muted
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onLoadedMetadata={(e) => {
                          const vid = e.currentTarget;
                          vid.playbackRate = speedMap[speed];
                        }}
                      />

                      {/* Label */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          width: "100%",
                          py: 1,
                          textAlign: "center",
                          bgcolor: "rgba(0,0,0,0.5)",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        {speed.charAt(0).toUpperCase() + speed.slice(1)}
                      </Box>
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
                          — {c.cldata.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", fontSize: "0.75rem" }}
                        >
                          Font: {c.font} | Preset: {c.theme} | Speed: {c.speed} 
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
