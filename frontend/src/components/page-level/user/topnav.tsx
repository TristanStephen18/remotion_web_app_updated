import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Activity } from "lucide-react";

export const Navbar: React.FC = () => {
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
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            variant="h5" // smaller than h4
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
            Create viral TikTok-style animations with AI-powered content
            generation
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              minWidth: 220,
              backgroundColor: "background.paper",
            }}
          >
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Activity className="w-2 h-2 text-gray-500" />
                <Typography variant="caption" color="text.secondary">
                  Processing Status
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: "bold", mt: 0.5 }}>
                No active processing jobs
              </Typography>
            </CardContent>
          </Card>

          {/* Admin Dashboard Button (Transparent with border) */}
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            sx={{
              borderRadius: "50px", // oval
              textTransform: "none",
              fontSize: "0.85rem", // smaller text
              px: 2.5,
              py: 0.8,
              borderWidth: "0.5px",
              borderColor: "text.primary", // ✅ adapts to light/dark
              color: "text.primary", // ✅ adapts text color
              "& .MuiSvgIcon-root": {
                color: "text.primary", // ✅ adapts icon color
                fontSize: "1rem",
              },
              "&:hover": {
                backgroundColor: "action.hover", // ✅ theme hover
                borderColor: "text.primary",
              },
            }}
          >
            Admin Dashboard
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
