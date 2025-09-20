import React, { useEffect, useRef, useState } from "react";
import Fab from "@mui/material/Fab";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  // CardMedia,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { templateCategories } from "../../../data/dashboardcardsdata";
import { getTemplateRoute } from "../../../utils/temlplatenavigator";

const TemplateCard: React.FC<{
  label: string;
  description: string;
  onTry: (template: string, description: string) => void;
}> = ({ label, description, onTry }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2;
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        transition: "transform 0.18s, box-shadow 0.18s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0px 10px 30px rgba(12, 18, 30, 0.12)",
        },
        bgcolor: "background.paper",
        cursor: "pointer",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Preview */}
      <Box sx={{ position: "relative", height: 160 }}>
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          src={`/template_previews/${label.replace(/\s+/g, "")}.mp4`}
        />
      </Box>

      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {label}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, minHeight: 40 }}
        >
          {description}
        </Typography>
        <Button
          fullWidth
          onClick={() => onTry(label, description)}
          sx={{
            borderRadius: "50px",
            textTransform: "none",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #d81b60 0%, #42a5f5 100%)",
            color: "white",
            "&:hover": {
              opacity: 0.92,
            },
          }}
        >
          Try this template
        </Button>
      </CardContent>
    </Card>
  );
};

// 🔹 Smaller, cleaner card for Modal
const ModalTemplateCard: React.FC<{
  label: string;
  description: string;
  onSelect: (template: string, description: string) => void;
}> = ({ label, description, onSelect }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 3;
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        transition: "transform 0.18s, box-shadow 0.18s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
        },
        bgcolor: "background.paper",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Smaller Video Preview */}
      <Box sx={{ position: "relative", height: 120 }}>
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          src={`/template_previews/${label.replace(/\s+/g, "")}.mp4`}
        />
      </Box>

      <CardContent sx={{ p: 1.5 }}>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{ lineHeight: 1.3 }}
        >
          {label}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "32px",
          }}
        >
          {description}
        </Typography>

        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={() => onSelect(label, description)}
          sx={{
            mt: 1,
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          Select
        </Button>
      </CardContent>
    </Card>
  );
};

// 🔹 Dashboard Content
export const DashboardContent: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectTab, setNewProjectTab] = useState(0);
  const [newProjectSearch, setNewProjectSearch] = useState("");

  const categories = ["All", ...Object.keys(templateCategories)];

  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [deletingProjects, setDeletingProjects] = useState(false);

  // selection state
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/projects", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const toggleProjectSelection = (id: number) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const Navigator = (template: string) => {
    const leading = "/template";
    switch (template) {
      case "Typing Animation":
        return leading + "/newtexttyping";
      case "Quote Spotlight":
        return leading + "/quotetemplate";
      case "Fact Cards":
        return leading + "/factcards";
      case "Bar Graph Analytics":
        return leading + "/bargraph";
      case "Split Screen":
        return leading + "/splitscreen";
      case "Kpi Flip Cards":
        return leading + "/kpiflipcards";
      case "Ken Burns Carousel":
        return leading + "/kenburnscarousel";
      case "Fake Text Conversation":
        return leading + "/faketextconversation";
      case "Reddit Post Narration":
        return leading + "/redditvideo";
      case "Ai Story Narration":
        return leading + "/storytelling";
      case "Curve Line Trend":
        return leading + "/curvelinetrend";
      default:
        return "/";
    }
  };

  const handleOpen = (template: string, description: string) => {
    setSelectedTemplate(template);
    setSelectedDescription(description);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTemplate(null);
    setSelectedDescription("");
  };

  // Collect all templates
  const allTemplates = Object.values(templateCategories).flat();

  // Select templates depending on tab
  const displayedTemplates =
    tab === 0
      ? allTemplates
      : templateCategories[categories[tab] as keyof typeof templateCategories];

  return (
    <Box sx={{ position: "relative", p: 3, backgroundColor: "background.default", minHeight: "100vh", width: "100%" }}>
      {/* Floating Action Button for Chat */}
      <Fab
      title="Chat with us"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1200,
          boxShadow: "0 4px 12px rgba(139,92,246,.45)",
          backgroundColor: "#fff",
          // border: "2px solid #222",
          color: "#222",
          '&:hover': {
            backgroundColor: "#f5f5f5",
          },
        }}
        onClick={() => setChatOpen(true)}
      >
        <span
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            display: "block",
            background: "conic-gradient(from 120deg, var(--primary-1), var(--primary-2), var(--primary-3))",
            boxShadow: "0 4px 12px rgba(139,92,246,.45)",
          }}
        />
      </Fab>

      {/* Mini Messaging Modal */}
      {chatOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 90,
            right: 40,
            width: 340,
            bgcolor: "background.paper",
            boxShadow: 4,
            borderRadius: 3,
            p: 2,
            zIndex: 1300,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography fontWeight="bold">Chat with Us</Typography>
            <IconButton size="small" onClick={() => setChatOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ height: 180, overflowY: "auto", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">How can we help you today?</Typography>
            {/* Chat messages would go here */}
          </Box>
          <TextField
            variant="outlined"
            placeholder="Type your message..."
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>
      )}
      {/* Templates Section */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Try our templates
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Jumpstart your creativity 🎨! Choose from a variety of ready-to-use
        templates designed to make your content pop. Browse by category, preview
        live demos, and customize them to fit your style.
      </Typography>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search templates..."
        fullWidth
        size="small"
        sx={{ mb: 3 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        sx={{
          mb: 3,
          "& .MuiTab-root": {
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "700",
            minHeight: "44px",
            px: 3,
            mx: 0.5,
            boxShadow: "0px 2px 6px rgba(0,0,0,0.06)",
            bgcolor: "background.paper",
            color: "text.primary",
            "&:hover": {
              bgcolor: "rgba(216, 27, 96, 0.06)",
            },
          },
          "& .Mui-selected": {
            background: "linear-gradient(90deg, #d81b60 0%, #42a5f5 100%)",
            color: "white !important",
            boxShadow: "0px 6px 18px rgba(12,18,40,0.12)",
          },
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        {categories.map((category, index) => {
          // optional count chip
          const count =
            category === "All"
              ? allTemplates.length
              : (templateCategories as any)[category].length;
          return (
            <Tab
              key={index}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>{category}</span>
                  <Chip
                    label={count}
                    size="small"
                    sx={{
                      bgcolor: "rgba(0,0,0,0.06)",
                      fontWeight: 700,
                    }}
                  />
                </Box>
              }
            />
          );
        })}
      </Tabs>

      {/* Template Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 4,
        }}
      >
        {displayedTemplates
          .filter(
            (t) =>
              t.name.toLowerCase().includes(search.toLowerCase()) ||
              t.description.toLowerCase().includes(search.toLowerCase())
          )
          .map((template) => (
            <TemplateCard
              key={template.name}
              label={template.name}
              description={template.description}
              onTry={handleOpen}
            />
          ))}
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 3 }} />

      {/* Projects Section */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        My Saved Templates
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Here’s where all your creativity lives 🚀. Manage your saved templates,
        track your edits, and quickly jump back into your favorite designs.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 1,
        }}
      >
        {loadingProjects ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(90deg,#42a5f5,#8a4dff,#ff4fa3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "spin 1.2s linear infinite",
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="12" stroke="#fff" strokeWidth="4" opacity="0.3" />
                <path d="M14 2a12 12 0 0 1 12 12" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
              Fetching your projects...
            </Typography>
          </Box>
        ) : projects.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No projects yet. Start by creating one!
          </Typography>
        ) : (
          projects.map((project) => (
            <Card
              key={project.id}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              sx={{
                minWidth: 280,
                borderRadius: 3,
                flexShrink: 0,
                overflow: "hidden",
                position: "relative", // needed for checkbox overlay
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.12)",
                },
                bgcolor: "background.paper",
              }}
            >
              {/* Checkbox overlay */}
              {(hoveredId === project.id || selectedProjects.length > 0) && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    // bgcolor: "white",
                    borderRadius: "4px",
                    zIndex: 2,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project.id)}
                    onChange={() => toggleProjectSelection(project.id)}
                    style={{
                      height: "20px",
                      width: "20px",
                    }}
                  />
                </Box>
              )}

              {/* Video Preview */}
              <Box sx={{ position: "relative", height: 160 }}>
                <video
                  src={project.projectVidUrl}
                  muted
                  playsInline
                  preload="metadata"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.play();
                    e.currentTarget.playbackRate = 3.0;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
              </Box>

              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {project.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </Typography>

                <Button
                  size="small"
                  fullWidth
                  sx={{
                    mt: 1,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    const url = getTemplateRoute(
                      project.templateId,
                      project.id
                    );
                    window.open(url, "_blank");
                  }}
                >
                  Open Project
                </Button>
              </CardContent>
            </Card>
          ))
        )}

        {/* ➕ New Project Card
        <Card
          sx={{
            minWidth: 280,
            borderRadius: 3,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            p: 3,
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0px 6px 20px rgba(0,0,0,0.12)",
            },
            bgcolor: "background.paper",
          }}
          onClick={() => setNewProjectOpen(true)}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "primary.light",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: "bold",
              mb: 2,
            }}
          >
            +
          </Box>
          <Typography variant="subtitle1" fontWeight="bold">
            New Project
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center">
            Start from scratch or pick a template
          </Typography>
        </Card> */}
      </Box>

      {selectedProjects.length > 0 && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "#1976d2",
            color: "white",
            borderTop: "1px solid rgba(0,0,0,0.1)",
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <Typography variant="body2">
            {selectedProjects.length} selected
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {deletingProjects && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={24} color="inherit" />
                <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                  Deleting...
                </Typography>
              </Box>
            )}
            <Button
              color="inherit"
              variant="outlined"
              sx={{
                borderColor: "white",
                color: "white",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
              disabled={deletingProjects}
              onClick={async () => {
                if (!window.confirm("Delete selected projects?")) return;
                setDeletingProjects(true);
                try {
                  await Promise.all(
                    selectedProjects.map((id) =>
                      fetch(`/projects/${id}`, {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      })
                    )
                  );
                  setProjects((prev) =>
                    prev.filter((p) => !selectedProjects.includes(p.id))
                  );
                  setSelectedProjects([]);
                } catch (err) {
                  console.error("Failed to delete projects", err);
                } finally {
                  setDeletingProjects(false);
                }
              }}
            >
              Delete
            </Button>
            <Button
              color="inherit"
              sx={{
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
              disabled={deletingProjects}
              onClick={() => setSelectedProjects([])}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      {/* 🔹 "Choose Template" Modal for New Project */}
      <Dialog
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: { borderRadius: 2, overflow: "hidden" },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Choose your template
          </Typography>
          <IconButton size="small" onClick={() => setNewProjectOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* Search Bar */}
          <TextField
            variant="outlined"
            placeholder="Search templates..."
            fullWidth
            size="small"
            sx={{ mb: 3 }}
            value={newProjectSearch}
            onChange={(e) => setNewProjectSearch(e.target.value)}
          />

          {/* Tabs */}
          <Tabs
            value={newProjectTab}
            onChange={(_, newValue) => setNewProjectTab(newValue)}
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "700",
                minHeight: "44px",
                px: 3,
                mx: 0.5,
                boxShadow: "0px 2px 6px rgba(0,0,0,0.06)",
                bgcolor: "background.paper",
                color: "text.primary",
                "&:hover": {
                  bgcolor: "rgba(216, 27, 96, 0.06)",
                },
              },
              "& .Mui-selected": {
                background: "linear-gradient(90deg, #d81b60 0%, #42a5f5 100%)",
                color: "white !important",
                boxShadow: "0px 6px 18px rgba(12,18,40,0.12)",
              },
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            {categories.map((category, index) => {
              const count =
                category === "All"
                  ? allTemplates.length
                  : (templateCategories as any)[category].length;
              return (
                <Tab
                  key={index}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span>{category}</span>
                      <Chip
                        label={count}
                        size="small"
                        sx={{ bgcolor: "rgba(0,0,0,0.06)", fontWeight: 700 }}
                      />
                    </Box>
                  }
                />
              );
            })}
          </Tabs>

          {/* Template Cards Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 1,
              maxHeight: "70vh",
              overflowY: "auto",
              pr: 1,
            }}
          >
            {(newProjectTab === 0
              ? allTemplates
              : templateCategories[
                  categories[newProjectTab] as keyof typeof templateCategories
                ]
            )
              .filter(
                (t) =>
                  t.name
                    .toLowerCase()
                    .includes(newProjectSearch.toLowerCase()) ||
                  t.description
                    .toLowerCase()
                    .includes(newProjectSearch.toLowerCase())
              )
              .map((template) => (
                <ModalTemplateCard
                  key={template.name}
                  label={template.name}
                  description={template.description}
                  onSelect={(label) => {
                    const location = Navigator(label);
                    window.open(location, "_blank");
                    setNewProjectOpen(false);
                  }}
                />
              ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* 🔹 Modal for Output Options — redesigned (tighter, centered, responsive) */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Template Preview
          </Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* remove default padding to control full-width panels */}
        <DialogContent dividers sx={{ p: 0 }}>
          <Box
            sx={{
              display: "flex",
              gap: 0,
              flexDirection: { xs: "column", md: "row" },
              // fixed height on md to avoid uneven whitespace
              height: { xs: "auto", md: 480 },
            }}
          >
            <Box
              sx={{
                flex: { xs: "none", md: 6 },
                width: { xs: "100%", md: "60%" },
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 2, md: 3 },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 360, md: "100%" },
                  maxWidth: 720,
                  borderRadius: 1.5,
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(2,6,23,0.4)",
                  bgcolor: "white",
                }}
              >
                <video
                  muted
                  controls
                  autoPlay
                  loop
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                  src={`/template_previews/${selectedTemplate?.replace(
                    /\s+/g,
                    ""
                  )}.mp4`}
                />
              </Box>
            </Box>

            <Box
              sx={{
                flex: { xs: "none", md: 4 },
                width: { xs: "100%", md: "40%" },
                p: { xs: 2, md: 4 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2.5,
                bgcolor: "background.paper",
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {selectedTemplate ?? "—"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {selectedDescription ?? "No description available."}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip label="1080×1920" size="small" />
                <Chip label="Portrait" size="small" />
              </Stack>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    const location = Navigator(selectedTemplate || "user");
                    window.open(location);
                    handleClose();
                  }}
                  fullWidth
                  sx={{
                    borderRadius: "12px",
                    textTransform: "uppercase",
                    fontWeight: 800,
                    background:
                      "linear-gradient(90deg, #d81b60 0%, #42a5f5 100%)",
                    boxShadow: "0 8px 20px rgba(68, 91, 173, 0.12)",
                    py: 1.3,
                  }}
                >
                  Try this template
                </Button>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Tip: Use batch rendering for multiple variations. Single output
                opens the template editor.
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ pr: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardContent;
