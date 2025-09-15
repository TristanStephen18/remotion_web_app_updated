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
import { serverImages } from "../../data/backgroundimages";
import { fontFamilies } from "../../data/fontfamilies";
import type { FactCardsDataset } from "../../models/FactCards";
import { fontsSelections1 } from "../../data/fontcolors";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import AnimationIcon from "@mui/icons-material/Animation";
import { triviaNiches } from "../../data/factcardsniches";
import { cardSubtitleFontSizeIndicator, cardTitleFontSizeIndicator, durationCalculatorforFactsCard } from "../../utils/factcardshelpers";

type SpeedOption = "slower" | "slow" | "normal" | "fast" | "faster";

const speedMap: Record<SpeedOption, number> = {
  faster: 2,
  slower: 0.2,
  slow: 0.5,
  normal: 1,
  fast: 1.5,
};

export const FactCardsBatchRendering: React.FC = () => {
  const [factCardsData, setFactCardsData] = useState<FactCardsDataset[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [renderQueue, setRenderQueue] = useState<number[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [selectedFontColors, setSelectedFontColors] = useState<string[]>([]);

  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "dataset" | "animation" | "backgrounds" | "fonts" | "colors" | "outputs"
  >("dataset");

  const [datasetQuantity, setDatasetQuantity] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [showProgressCard, setShowProgressCard] = useState(true);

  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([]);
  const [selectedFonts, setSelectedFonts] = useState<string[]>([]);
  const [selectedPacings, setSelectedPacings] = useState<string[]>([]);

  const [combinations, setCombinations] = useState<any[]>([]);

  const fetchAIDataset = async (quantity: number) => {
    if (selectedNiches.length === 0) {
      alert("You must choose a niche or niches first");
      return;
    } else {
      setLoading(true);
      try {
        const res = await fetch("/api/generate/factcardsdataset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            niches: selectedNiches,
            quantity,
          }),
        });
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        const data = await res.json();
        console.log(data.data);
        setFactCardsData(data.data);
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExportForCombination = async (combo: any, index: number) => {
    updateCombination(index, { status: "exporting" });
        // const fontsizeindicator = titleAndSubtitleFontSizeIndicator(combo.bar.title);
        try {
          let finalImageUrl = combo.bg;
          if (!finalImageUrl.startsWith("http://localhost:3000")) {
            finalImageUrl = `http://localhost:3000${finalImageUrl}`;
          }
          const response = await fetch("/generatevideo/factstemplaterender", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              intro: combo.dataset.intro,
          outro: combo.dataset.intro,
          facts: combo.dataset.facts,
          backgroundImage: finalImageUrl,
          fontSizeTitle: cardTitleFontSizeIndicator(combo.dataset.intro.title),
          fontSizeSubtitle: cardSubtitleFontSizeIndicator(combo.dataset.intro.subtitle),
          fontFamilyTitle: combo.font,
          fontColorTitle: combo.fontColor,
          fontColorSubtitle:  combo.fontColor,
          fontFamilySubtitle: combo.font,
          duration: durationCalculatorforFactsCard(combo.dataset.facts.length, combo.pacing),
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
  const handleRemoveDataset = (index: number) => {
    setFactCardsData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateBatch = () => {
    setShowProgressCard(true);
    // Validation: ensure at least one selection per category
    if (
      factCardsData.length === 0 ||
      selectedBackgrounds.length === 0 ||
      selectedFonts.length === 0 ||
      selectedPacings.length === 0 ||
      selectedFontColors.length === 0
    ) {
      alert(
        "You are missing some selections. Please complete all selections first."
      );
      return;
    }

    const combos: {
      dataset: FactCardsDataset;
      bg: string;
      font: string;
      pacing: string;
      fontColor: string;
      status: "pending" | "done";
      exportUrl: string | null;
    }[] = [];

    // Cartesian product generation
    factCardsData.forEach((dataset) => {
      selectedBackgrounds.forEach((bg) => {
        selectedFonts.forEach((font) => {
          selectedPacings.forEach((pacing) => {
            selectedFontColors.forEach((fontColor) => {
              combos.push({
                dataset,
                bg,
                font,
                pacing,
                fontColor,
                status: "pending",
                exportUrl: null,
              });
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
              🎬 Fact Cards Template Batch Rendering
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
            icon={<AnimationIcon />}
            label="Animation Speed"
            collapsed={collapsed}
            active={activeSection === "animation"}
            onClick={() => setActiveSection("animation")}
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
            icon={<ColorLensIcon />}
            label="Font Colors"
            collapsed={collapsed}
            active={activeSection === "colors"}
            onClick={() => setActiveSection("colors")}
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
            onClick={() => window.location.assign("/template/factcards")}
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
                  flexDirection: "column",
                  gap: 4,
                  mb: 3,
                  bgcolor: "#fdfdfd",
                }}
              >
                {/* Top Controls: Source & Quantity */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "stretch", md: "center" },
                    gap: 3,
                  }}
                >
                  {/* Dataset Source Selection */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
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
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Number of Datasets Per Niche
                    </Typography>
                    <TextField
                      disabled={isRendering}
                      type="number"
                      value={datasetQuantity}
                      onChange={(e) =>
                        setDatasetQuantity(Number(e.target.value))
                      }
                      inputProps={{ min: 1, style: { textAlign: "center" } }}
                      sx={{ width: 120 }}
                      size="small"
                    />
                  </Box>

                  {/* Generate Button */}
                  <Box sx={{ ml: { xs: 0, md: "auto" } }}>
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
                </Box>

                {/* Niche Selection */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight={600}
                    sx={{ mb: 1 }}
                  >
                    Niche(s)
                  </Typography>

                  <ToggleButtonGroup
                    value={selectedNiches}
                    onChange={(_, newValues) => setSelectedNiches(newValues)}
                    aria-label="niches"
                    size="small"
                    sx={{
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {triviaNiches.map((niche) => (
                      <ToggleButton
                        key={niche}
                        value={niche}
                        sx={{
                          borderRadius: 2,
                          px: 2,
                          py: 0.5,
                          textTransform: "none",
                          fontSize: "0.85rem",
                        }}
                      >
                        {niche}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              </Paper>

              {/* FACT CARDS DATA DISPLAY */}
              <Paper
                elevation={2}
                sx={{
                  mt: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                  minHeight: 200, // keeps height stable while loading
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {loading ? (
                  // Loader while fetching
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 4,
                    }}
                  >
                    <CircularProgress size={40} />
                  </Box>
                ) : factCardsData.length > 0 ? (
                  <>
                    {/* Header Row */}
                    <Box
                      sx={{
                        display: "flex",
                        px: 2,
                        py: 1,
                        bgcolor: "#f9fafb",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>Intro</Box>
                      <Box sx={{ flex: 2 }}>Facts</Box>
                      <Box sx={{ flex: 1 }}>Outro</Box>
                      <Box sx={{ width: 80, textAlign: "center" }}>Action</Box>
                    </Box>

                    {/* Rows */}
                    {factCardsData.map((dataset, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          px: 2,
                          py: 1.5,
                          borderTop: "1px solid #eee",
                          alignItems: "flex-start",
                        }}
                      >
                        {/* Intro */}
                        <Box sx={{ flex: 1, pr: 2, fontSize: "0.9rem" }}>
                          <Typography fontWeight={600}>
                            {dataset.intro.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dataset.intro.subtitle}
                          </Typography>
                        </Box>

                        {/* Facts */}
                        <Box
                          sx={{
                            flex: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {dataset.facts.map((fact, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                bgcolor: "#f1f5ff",
                                px: 1.2,
                                py: 0.8,
                                borderRadius: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, mb: 0.3 }}
                              >
                                {fact.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {fact.description}
                              </Typography>
                            </Box>
                          ))}
                        </Box>

                        {/* Outro */}
                        <Box sx={{ flex: 1, pr: 2, fontSize: "0.9rem" }}>
                          <Typography fontWeight={600}>
                            {dataset.outro.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dataset.outro.subtitle}
                          </Typography>
                        </Box>

                        {/* Remove Button */}
                        <Box sx={{ width: 80, textAlign: "center" }}>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveDataset(i)}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </>
                ) : (
                  // Empty state (no data & not loading)
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "text.secondary",
                      p: 4,
                    }}
                  >
                    No dataset generated yet
                  </Box>
                )}
              </Paper>
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
                      setSelectedPacings([
                        "slow",
                        "normal",
                        "fast",
                        "slower",
                        "faster",
                      ])
                    }
                    disabled={isRendering}
                  >
                    Select all
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ClearAllIcon />}
                    onClick={() => setSelectedPacings([])}
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
                {(
                  [
                    "slower",
                    "slow",
                    "normal",
                    "fast",
                    "faster",
                  ] as SpeedOption[]
                ).map((speed) => {
                  const selected = selectedPacings.includes(speed);
                  return (
                    <Box
                      key={speed}
                      onClick={() =>
                        setSelectedPacings((prev) =>
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
                {serverImages.map((bg) => {
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

          {/* Font Colors Section */}
          {activeSection === "colors" && (
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
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ letterSpacing: 0.5 }}
                >
                  Choose Font Colors
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<SelectAllIcon />}
                    onClick={() => setSelectedFontColors([...fontsSelections1])}
                    disabled={isRendering}
                  >
                    Select all
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ClearAllIcon />}
                    onClick={() => setSelectedFontColors([])}
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
                    md: "repeat(4, 1fr)",
                    lg: "repeat(5, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {fontsSelections1.map((color) => {
                  const selected = selectedFontColors.includes(color);
                  return (
                    <Box
                      key={color}
                      onClick={() =>
                        setSelectedFontColors((prev) =>
                          prev.includes(color)
                            ? prev.filter((c) => c !== color)
                            : [...prev, color]
                        )
                      }
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
                      }}
                    >
                      {/* Color Block */}
                      <Box
                        sx={{
                          height: 80,
                          bgcolor: color,
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
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
                      </Box>

                      {/* Label */}
                      <Box
                        sx={{
                          py: 1,
                          textAlign: "center",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          color: "#333",
                          textTransform: "capitalize",
                        }}
                      >
                        {color}
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
                          — {c.dataset.intro.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", fontSize: "0.75rem" }}
                        >
                          Font: {c.font} | Color: {c.fontColor} 
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
