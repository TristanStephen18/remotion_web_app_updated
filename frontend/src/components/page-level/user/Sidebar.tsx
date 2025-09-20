import React from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Fab, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";

const navItems = [
  { label: "Home", icon: <HomeIcon />, value: "home" },
  { label: "Templates", icon: <CategoryIcon />, value: "templates" },
  { label: "Saved Templates", icon: <BookmarkIcon />, value: "saved" },
  { label: "Profile", icon: <PersonIcon />, value: "profile" },
];

const Sidebar = ({ section, setSection }: { section: string; setSection: (s: string) => void }) => {
  const [chatOpen, setChatOpen] = React.useState(false);

  return (
    <Box
      sx={{
        width: 90,
        bgcolor: "background.paper",
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 3,
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <img src="/vite.svg" alt="Viral Motion" style={{ width: 48, height: 48 }} />
      </Box>
      <List sx={{ flex: 1, width: "100%" }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.value}
            selected={section === item.value}
            onClick={() => setSection(item.value)}
            sx={{
              flexDirection: "column",
              alignItems: "center",
              py: 2,
              borderRadius: 2,
              mb: 1.5,
              bgcolor: section === item.value ? "primary.light" : undefined,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: section === item.value ? "primary.main" : "text.secondary" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 12,
                fontWeight: section === item.value ? "bold" : "normal",
                color: section === item.value ? "primary.main" : "text.secondary",
                textAlign: "center",
              }}
            />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ position: "absolute", bottom: 32, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Fab color="primary" size="medium" onClick={() => setChatOpen(true)}>
          <ChatIcon />
        </Fab>
      </Box>
      {/* Chat Modal */}
      {chatOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 100,
            left: 110,
            width: 340,
            bgcolor: "background.paper",
            boxShadow: 4,
            borderRadius: 3,
            p: 2,
            zIndex: 9999,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography fontWeight="bold">Chat with Us</Typography>
            <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>×</button>
          </Box>
          <Box sx={{ height: 180, overflowY: "auto", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">How can we help you today?</Typography>
            {/* Chat messages would go here */}
          </Box>
          <input type="text" placeholder="Type your message..." style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #eee" }} />
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
