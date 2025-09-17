import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import CloudIcon from "@mui/icons-material/Cloud";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import DatasetIcon from "@mui/icons-material/Dataset";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import type { Phrase } from "../../models/TextTyping";
import {
  CategoryOptions,
  MoodOptions,
} from "../../components/editors/NewTextTypingEditor/data";
import { BACKGROUNDS } from "../../data/texttypingbg";
import { FONTS } from "../../data/texttypingfonts";
import { AUDIO_FILES } from "../../data/texttypingaudios";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import NavItem from "../../components/navigations/batchrendering/NavItems";
import { DownloadIcon } from "lucide-react";

export const TextTypingTemplateBatchRendering: React.FC = () => {
  const [backgroundsSelected, setBackgroundSelected] = useState<number[]>([]);
  const [soundsSelected, setSoundSelected] = useState<number[]>([]);
  const [fontsSelected, setFontsSelected] = useState<number[]>([]);
  const [phrasesData, setPhrasesData] = useState<Phrase[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRefs = React.useRef<HTMLAudioElement[]>([]);

  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "dataset" | "backgrounds" | "fonts" | "sound" | "outputs"
  >("dataset");

  const [datasetSource, setDatasetSource] = useState<"recite" | "ai">("recite");
  const [datasetQuantity, setDatasetQuantity] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [combinations, setCombinations] = useState<any[]>([]);
  const [renderQueue, setRenderQueue] = useState<number[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [showProgressCard, setShowProgressCard] = useState(true);
  const [loaderLabel, setLoaderLabel] = useState("Fetching datasets...");

  useEffect(() => {
    if (loading) {
      const messages = [
        "Fetching datasets...",
        "Still working...",
        "Crunching numbers...",
        "Almost done...",
      ];
      let index = 0;

      const interval = setInterval(() => {
        index = (index + 1) % messages.length;
        setLoaderLabel(messages[index]);
      }, 4000); // change message every 4s

      return () => clearInterval(interval); // cleanup when loading stops
    } else {
      setLoaderLabel("Fetching datasets...");
    }
  }, [loading]);

  /** Pick random item from array */
  const randomPick = <T,>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

  const generateDataset = async () => {
    setLoading(true);
    try {
      if (datasetSource === "recite") {
        // Run multiple requests in parallel
        const promises = Array.from({ length: datasetQuantity }, () =>
          fetch("https://recite.onrender.com/api/v1/random").then((r) => {
            if (!r.ok) throw new Error(`Recite error ${r.status}`);
            return r.json();
          })
        );

        const results = await Promise.all(promises);

        const mapped: Phrase[] = results.map((q: any) => ({
          lines: q.quote
            .split(/[,.:;!?]/)
            .map((s: string) => s.trim())
            .filter(Boolean),
          category: randomPick(CategoryOptions),
          mood: randomPick(MoodOptions),
        }));

        setPhrasesData(mapped);
      } else if (datasetSource === "ai") {
        // ✅ Your provided AI function
        const res = await fetch("/api/generate/texttypingdataset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: datasetQuantity }),
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        setPhrasesData(data.phrase); // assuming { phrase: Phrase[] }
      }
    } catch (err) {
      console.error("Dataset error:", err);
      alert("Failed to generate dataset");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBatch = () => {
    setShowProgressCard(true);

    if (
      phrasesData.length === 0 ||
      backgroundsSelected.length === 0 ||
      fontsSelected.length === 0 ||
      soundsSelected.length === 0
    ) {
      alert(
        "You are missing some selections. Please complete all selections first."
      );
      return;
    }

    const combos: any[] = [];

    phrasesData.forEach((phrase) => {
      backgroundsSelected.forEach((bgIndex) => {
        fontsSelected.forEach((fontIndex) => {
          soundsSelected.forEach((soundIndex) => {
            combos.push({
              phrase,
              backgroundIndex: bgIndex,
              fontIndex: fontIndex,
              soundIndex: soundIndex,
              status: "pending",
              exportUrl: null,
            });
          });
        });
      });
    });

    setCombinations(combos);
    setRenderQueue(combos.map((_, i) => i));
    setActiveSection("outputs");
    setIsRendering(true);
    setCurrentIndex(0);
  };

  const handleExportForCombination = async (combo: any, index: number) => {
    updateCombination(index, { status: "exporting" });

    try {
      const response = await fetch("/generatevideo/newtexttypingrender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: combo.phrase,
          backgroundIndex: combo.backgroundIndex,
          fontIndex: combo.fontIndex,
          audioIndex: combo.soundIndex,
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

  const handleRemovePhrase = (index: number) => {
    setPhrasesData((prev) => prev.filter((_, i) => i !== index));
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
              🎬 Text Typing Template Batch Rendering
            </Typography>
          )}
        </Box>

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
            icon={<MusicNoteIcon />}
            label="Sound"
            collapsed={collapsed}
            active={activeSection === "sound"}
            onClick={() => setActiveSection("sound")}
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
          <Button
            fullWidth
            variant="outlined"
            disabled={isRendering}
            onClick={() => {
              window.location.assign("/template/newtexttyping");
            }}
            startIcon={<SwapHorizIcon />}
            sx={{
              borderRadius: 2,
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Single Output Mode
          </Button>

          <Button
            onClick={handleGenerateBatch}
            fullWidth
            variant="contained"
            startIcon={<DatasetIcon />}
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

          {activeSection === "dataset" && (
            <Box>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Dataset Configuration
              </Typography>

              {/* Config Panel */}
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
                {/* Dataset Source */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Source
                  </Typography>
                  <ToggleButtonGroup
                    value={datasetSource}
                    exclusive
                    onChange={(_, v) => v && setDatasetSource(v)}
                    size="medium"
                  >
                    <ToggleButton value="recite">
                      <CloudIcon sx={{ mr: 1 }} /> Recite API
                    </ToggleButton>
                    <ToggleButton value="ai">
                      <SmartToyIcon sx={{ mr: 1 }} /> AI Generated
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {/* Quantity */}
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

                {/* Action */}
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

              {/* Phrases Section */}
              <Paper
                elevation={2}
                sx={{
                  mt: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                  minHeight: 200, 
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {loading ? (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 4,
                      gap: 2,
                    }}
                  >
                    <CircularProgress size={40} />
                    <Typography variant="body2" color="text.secondary">
                      {loaderLabel}
                    </Typography>
                  </Box>
                ) : phrasesData.length > 0 ? (
                  <>
                    {/* Header Row */}
                    <Box
                      sx={{
                        pointerEvents: isRendering ? "none" : "auto",
                        opacity: isRendering ? 0.5 : 1,
                        display: "flex",
                        px: 2,
                        py: 1,
                        bgcolor: "#f9fafb",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <Box sx={{ flex: 2 }}>Lines</Box>
                      <Box sx={{ flex: 1 }}>Category</Box>
                      <Box sx={{ flex: 1 }}>Mood</Box>
                      <Box sx={{ width: 80, textAlign: "center" }}>Action</Box>
                    </Box>

                    {/* Rows */}
                    {phrasesData.map((p, i) => (
                      <Box
                        key={i}
                        sx={{
                          pointerEvents: isRendering ? "none" : "auto",
                          opacity: isRendering ? 0.5 : 1,
                          display: "flex",
                          px: 2,
                          py: 1.5,
                          borderTop: "1px solid #eee",
                          alignItems: "flex-start",
                        }}
                      >
                        {/* Lines */}
                        <Box sx={{ flex: 2, pr: 2, fontSize: "0.95rem" }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {p.lines.join(" / ")}
                          </Typography>
                        </Box>

                        {/* Category */}
                        <Box
                          sx={{
                            flex: 1,
                            fontSize: "0.9rem",
                            color: "text.secondary",
                          }}
                        >
                          {p.category}
                        </Box>

                        {/* Mood */}
                        <Box
                          sx={{
                            flex: 1,
                            fontSize: "0.9rem",
                            color: "text.secondary",
                          }}
                        >
                          {p.mood}
                        </Box>

                        {/* Remove Button */}
                        <Box sx={{ width: 80, textAlign: "center" }}>
                          <Button
                            disabled={isRendering}
                            size="small"
                            color="error"
                            onClick={() => handleRemovePhrase(i)}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </>
                ) : (
                  // Empty state
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
                    No phrases generated yet
                  </Box>
                )}
              </Paper>
            </Box>
          )}
          {activeSection === "backgrounds" && (
            <Box>
              {/* Header with title + buttons */}
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
                    onClick={() =>
                      setBackgroundSelected(BACKGROUNDS.map((_, i) => i))
                    }
                    disabled={isRendering}
                  >
                    Select all
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ClearAllIcon />}
                    onClick={() => setBackgroundSelected([])}
                    disabled={isRendering}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>

              {/* Grid of background previews */}
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
                {BACKGROUNDS.map((bg, index) => {
                  const selected = backgroundsSelected.includes(index);

                  return (
                    <Box
                      key={bg.id}
                      onClick={() => {
                        setBackgroundSelected((prev) =>
                          selected
                            ? prev.filter((i) => i !== index)
                            : [...prev, index]
                        );
                      }}
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
                        background: bg.backgroundColor,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                      }}
                    >
                      {/* Background name overlay */}
                      <Typography
                        variant="caption"
                        sx={{
                          width: "100%",
                          textAlign: "center",
                          py: 0.5,
                          bgcolor: "rgba(0,0,0,0.4)",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        {bg.name}
                      </Typography>

                      {/* Checkmark indicator */}
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
                    onClick={() => setFontsSelected(FONTS.map((_, i) => i))}
                    disabled={isRendering}
                  >
                    Select all
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ClearAllIcon />}
                    onClick={() => setFontsSelected([])}
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
                {FONTS.map((font, index) => {
                  const selected = fontsSelected.includes(index);

                  return (
                    <Box
                      key={font.id}
                      onClick={() =>
                        setFontsSelected((prev) =>
                          selected
                            ? prev.filter((i) => i !== index)
                            : [...prev, index]
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
                          fontFamily: font.family,
                          fontWeight: font.weight,
                          fontSize: "1.3rem",
                          mb: 1,
                        }}
                      >
                        {font.name}
                      </Typography>

                      {/* Caption */}
                      <Typography variant="caption" color="text.secondary">
                        {font.category} • {font.family}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
          {activeSection === "sound" && (
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
                  Audio Selection
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<SelectAllIcon />}
                    onClick={() =>
                      setSoundSelected(AUDIO_FILES.map((_, i) => i))
                    }
                    disabled={isRendering}
                  >
                    Select all
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ClearAllIcon />}
                    onClick={() => setSoundSelected([])}
                    disabled={isRendering}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>

              {/* Audio Cards */}
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
                {AUDIO_FILES.map((sound, index) => {
                  const selected = soundsSelected.includes(index);
                  const isPlaying = playingIndex === index;

                  const togglePlay = () => {
                    const current = audioRefs.current[index];
                    if (!current) return;

                    if (isPlaying) {
                      current.pause();
                      setPlayingIndex(null);
                    } else {
                      // Pause any other playing audio
                      audioRefs.current.forEach((audio, i) => {
                        if (audio && i !== index) audio.pause();
                      });
                      current.play();
                      setPlayingIndex(index);
                    }
                  };

                  return (
                    <Box
                      key={sound.id}
                      onClick={() =>
                        setSoundSelected((prev) =>
                          selected
                            ? prev.filter((i) => i !== index)
                            : [...prev, index]
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
                        minHeight: 140,
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

                      {/* Audio Label */}
                      <Typography variant="h6" fontWeight={600} mb={1}>
                        {sound.name}
                      </Typography>

                      {/* Tags */}
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Mood: {sound.mood}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Best with: {sound.bestWith.join(", ")}
                      </Typography>

                      {/* Play / Pause Button */}
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                        sx={{ mt: 1 }}
                      >
                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                      </IconButton>

                      {/* Hidden audio element */}
                      <audio
                        ref={(el) => {
                          if (el) audioRefs.current[index] = el;
                        }}
                        src={sound.filename}
                        onEnded={() => setPlayingIndex(null)}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
          {activeSection === "outputs" && (
            <Box>
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
                  {combinations.map((c, i) => {
                    const bg = BACKGROUNDS[c.backgroundIndex];
                    const font = FONTS[c.fontIndex];
                    const sound = AUDIO_FILES[c.soundIndex];

                    return (
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
                        {/* Video / Placeholder */}
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
                            color="text.primary"
                            sx={{ fontSize: "0.85rem", fontWeight: 600 }}
                            noWrap
                          >
                            {c.phrase.lines.join(" / ")}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", fontSize: "0.75rem" }}
                          >
                            BG: {bg.name} • Font: {font.name} • Sound:{" "}
                            {sound.name}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};
