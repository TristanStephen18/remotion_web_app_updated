import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        color: "black",
        p: 1.5,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        {/* Title and subtitle */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              background:
                "linear-gradient(to right, #d81b60 0%, #d81b60 70%, #42a5f5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textFillColor: "transparent",
            }}
          >
            ViralMotion Creator
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create viral TikTok-style animations with AI-powered content generation
          </Typography>
        </Box>

        {/* Profile Icon at right */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={handleProfileClick} size="large" sx={{ p: 0 }}>
            <Avatar src="/pfp.jpg" alt="Profile" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ sx: { mt: 1, minWidth: 140, borderRadius: 2 } }}
          >
            <MenuItem onClick={handleClose}>View Profile</MenuItem>
            <MenuItem onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
              handleClose();
            }}>Log Out</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
