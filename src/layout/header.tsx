import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Chip,
  Avatar,
  Tooltip,
} from "@mui/material";
import { Menu as MenuIcon, Sun, Moon, Wallet } from "lucide-react";
import { useThemeMode } from "@/context/ThemeContext";
import { useWallet } from "@/context/WalletContext";
import { shortenAddress } from "@/utils";
import { useDeviceType } from "@/hooks";

interface HeaderProps {
  onToggle: () => void;
}

export const Header = ({ onToggle }: HeaderProps) => {
  const { mode, toggleTheme } = useThemeMode();
  const { connected, address, network, connect, connecting } = useWallet();
  const navigate = useNavigate();
  const { isMobile } = useDeviceType();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        zIndex: 10,
        py: 1.8,
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {isMobile && (
          <IconButton onClick={onToggle} edge="start" color="inherit">
            <MenuIcon size={22} />
          </IconButton>
        )}

        <Box sx={{ flex: 1 }} />

        <Tooltip
          title={
            mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
        >
          <IconButton onClick={toggleTheme} sx={{ color: "text.secondary" }}>
            {mode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>
        </Tooltip>

        {connected && (
          <Chip
            label={network || "Unknown"}
            size="small"
            sx={{
              bgcolor:
                mode === "dark"
                  ? "rgba(16, 185, 129, 0.12)"
                  : "rgba(16, 185, 129, 0.1)",
              color: "#10B981",
              fontWeight: 500,
              fontSize: "0.75rem",
            }}
          />
        )}

        {!isMobile &&
          (connected ? (
            <Chip
              avatar={
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: "primary.main",
                    fontSize: "0.6rem",
                  }}
                >
                  {address?.slice(2, 4).toUpperCase()}
                </Avatar>
              }
              label={shortenAddress(address)}
              variant="outlined"
              sx={{ fontWeight: 500, cursor: "pointer" }}
              onClick={() => navigate("/my-products")}
            />
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={connect}
              disabled={connecting}
              startIcon={<Wallet size={16} />}
            >
              {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          ))}
      </Toolbar>
    </AppBar>
  );
};
