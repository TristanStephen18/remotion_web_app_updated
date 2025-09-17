import React from "react";
import { Box, Typography } from "@mui/material";

export type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick?: () => void;
};

export const NavItem: React.FC<NavItemProps> = ({ icon, label, collapsed, active, onClick }) => {
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
};

export default NavItem;
