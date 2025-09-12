import React, { useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { templateCategories } from "../../../data/dashboardcardsdata";

const projects = [
  {
    id: 1,
    name: "Cool Animation",
    created: "2025-08-01",
    updated: "2025-08-15",
    image: "https://picsum.photos/1080/1920",
  },
  {
    id: 2,
    name: "AI TikTok Intro",
    created: "2025-07-10",
    updated: "2025-08-12",
    image: "https://picsum.photos/1080/1920",
  },
  {
    id: 3,
    name: "Dance Overlay",
    created: "2025-06-22",
    updated: "2025-07-05",
    image: "https://picsum.photos/1080/1920",
  },
];

// 🔹 Template Card Component
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
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectTab, setNewProjectTab] = useState(0);
  const [newProjectSearch, setNewProjectSearch] = useState("");

  const categories = ["All", ...Object.keys(templateCategories)];

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
    <Box
      sx={{
        p: 3,
        backgroundColor: "background.default",
        minHeight: "100vh",
        width: "100%",
      }}
    >
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
        My Projects
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Here’s where all your creativity lives 🚀. Manage your saved projects,
        track your edits, and quickly jump back into your favorite designs. Keep
        iterating — your next viral hit could be just one tweak away!
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 1,
        }}
      >
        {projects.map((project) => (
          <Card
            key={project.id}
            sx={{
              minWidth: 280,
              borderRadius: 3,
              flexShrink: 0,
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0px 6px 20px rgba(0,0,0,0.12)",
              },
              bgcolor: "background.paper",
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image={project.image}
              alt={project.name}
            />
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {project.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Created: {project.created}
              </Typography>
              <br />
              <Typography variant="caption" color="text.secondary">
                Last Updated: {project.updated}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {/* ➕ New Project Card */}
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
        </Card>
      </Box>

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
