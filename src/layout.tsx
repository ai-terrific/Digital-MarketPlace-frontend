import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  Button,
  Chip,
  useMediaQuery,
  useTheme,
  Avatar,
  Tooltip,
} from "@mui/material";
import { Menu as MenuIcon, Sun, Moon, Wallet } from "lucide-react";
import { useThemeMode } from "./ThemeContext";
import { useWallet } from "./context/WalletContext";
import SidebarContent from "@/components/SideBar";

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mode, toggleTheme } = useThemeMode();
  const { connected, address, network, connect, connecting } = useWallet();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            borderRight: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            position: "sticky",
            top: 0,
            height: "100vh",
          }}
        >
          <SidebarContent />
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            bgcolor: "background.paper",
            borderRight: 1,
            borderColor: "divider",
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
      >
        {/* Top Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            zIndex: 10,
          }}
        >
          <Toolbar sx={{ gap: 1 }}>
            {isMobile && (
              <IconButton
                onClick={() => setSidebarOpen(true)}
                edge="start"
                color="inherit"
              >
                <MenuIcon size={22} />
              </IconButton>
            )}

            <Box sx={{ flex: 1 }} />

            <Tooltip
              title={
                mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              <IconButton
                onClick={toggleTheme}
                sx={{ color: "text.secondary" }}
              >
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
                  label={shortenAddress(address || "")}
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

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: 1400,
            width: "100%",
            mx: "auto",
          }}
        >
          <Outlet />
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            borderTop: 1,
            borderColor: "divider",
            py: 3,
            px: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2026 PHX Marketplace. Decentralized digital commerce platform.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
