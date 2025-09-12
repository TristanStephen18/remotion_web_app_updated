// App.tsx
import React, { useState } from "react";
import { ThemeProvider, CssBaseline, IconButton } from "@mui/material";
import { getTheme } from "../../theme.ts";
import { Navbar } from "../../components/page-level/user/topnav.tsx";
import DashboardContent from "../../components/page-level/user/Dashboardcontent.tsx";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Dashboard: React.FC = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />

      {/* Dark Mode Toggle */}
      {/* <IconButton
        onClick={toggleMode}
        sx={{ position: "fixed", top: 16, right: 16, zIndex: 2000 }}
      >
        {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton> */}


      <Navbar />
      <DashboardContent />
    </ThemeProvider>
  );
};

export default Dashboard;
