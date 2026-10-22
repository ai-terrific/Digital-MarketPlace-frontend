import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { ChevronRight } from "lucide-react";

import { NavigationItem } from "@/types";
import { useThemeMode } from "@/context/ThemeContext";

const SidebarListItem = ({
  item,
  onClose,
}: {
  item: NavigationItem;
  onClose?: () => void;
}) => {
  const navigate = useNavigate();
  const { mode } = useThemeMode();

  const isActive =
    location.pathname === item.path ||
    (item.path !== "/" && location.pathname.startsWith(item.path));
  const Icon = item.icon;

  const handleNavClick = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={() => handleNavClick(item.path)}
        sx={{
          borderRadius: 2,
          py: 1.2,
          px: 2,
          bgcolor: isActive
            ? mode === "dark"
              ? "rgba(14, 165, 233, 0.15)"
              : "rgba(14, 165, 233, 0.08)"
            : "transparent",
          color: isActive ? "primary.main" : "text.secondary",
          "&:hover": {
            bgcolor:
              mode === "dark"
                ? "rgba(14, 165, 233, 0.1)"
                : "rgba(14, 165, 233, 0.05)",
          },
        }}
      >
        <Box
          sx={{
            minWidth: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} color={isActive ? "#0EA5E9" : "currentColor"} />
        </Box>
        <ListItemText
          primary={
            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {item.label}
            </Typography>
          }
        />
        {isActive && <ChevronRight size={16} color="#0EA5E9" />}
      </ListItemButton>
    </ListItem>
  );
};

export default SidebarListItem;
