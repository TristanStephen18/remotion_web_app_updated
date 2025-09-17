import React from "react";
import { Box } from "@mui/material";
import type { ReactNode } from "react";
import NavItem from "./NavItems";


// Define the shape of the nav item data
export interface NavData {
  icon: ReactNode;
  label: string;
  key: string; // unique identifier like "images" / "quantity"
}

interface NavListProps {
  items: NavData[];
  collapsed: boolean;
  activeSection: string;
  onSectionChange: (key: string) => void;
}

const NavList: React.FC<NavListProps> = ({
  items,
  collapsed,
  activeSection,
  onSectionChange,
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {items.map((item) => (
        <NavItem
          key={item.key}
          icon={item.icon}
          label={item.label}
          collapsed={collapsed}
          active={activeSection === item.key}
          onClick={() => onSectionChange(item.key)}
        />
      ))}
    </Box>
  );
};

export default NavList;
