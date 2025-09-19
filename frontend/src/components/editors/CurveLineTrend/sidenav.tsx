import type React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Button from "@mui/material/Button";
import { CurveLineTrendNavs } from "../../../data/navdata_live_editor";

interface SidenavProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  activeSection: string;
  setActiveSection: React.Dispatch<
    React.SetStateAction<"text" | "data" | "background" | "animation">
  >;
}

export const CurveLineSideNav: React.FC<SidenavProps> = ({
  collapsed,
  setCollapsed,
  activeSection,
  setActiveSection,
}) => {
  return (
    <div
      style={{
        width: collapsed ? "60px" : "200px",
        background: "#fff",
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          padding: "0.75rem",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
      </button>

      {/* Nav Items */}
      <div style={{ flex: 1 }}>
        {CurveLineTrendNavs.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key as any)}
            style={{
              padding: "1rem",
              textAlign: "left",
              border: "none",
              background: activeSection === key ? "#f5f5f5" : "transparent",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: collapsed ? "0" : "0.5rem",
              justifyContent: collapsed ? "center" : "flex-start",
              width: "100%",
            }}
          >
            {icon}
            {!collapsed && label}
          </button>
        ))}
      </div>

      {!collapsed && (
        <div style={{ padding: "1rem" }}>
          <Button
          title="Switch to batch rendering mode?"
            fullWidth={!collapsed}
            variant="outlined"
            startIcon={<SwapHorizIcon />}
            onClick={() =>
              window.location.assign("/template/curvelinetrend/mode/batchrendering")
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#d81b60",
              color: "#d81b60",
              minWidth: collapsed ? "40px" : "auto",
              justifyContent: collapsed ? "center" : "flex-start",
              "&:hover": { borderColor: "#42a5f5", color: "#42a5f5" },
            }}
          >
            Batch Output
          </Button>
        </div>
      )}
    </div>
  );
};
