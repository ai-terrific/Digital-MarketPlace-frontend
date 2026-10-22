import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  useMediaQuery,
  useTheme,
  Avatar,
  Alert,
  Divider,
} from "@mui/material";
import { Wallet, LogOut, ChevronRight, X } from "lucide-react";
import { getAddress } from "ethers";
import { NAVIGATION_ITEMS, routers, SEPOLIA_CHAIN_ID } from "@/constants";
import { getMarketplaceOwner } from "@/services/marketplaceAdminService";
import { useThemeMode } from "../ThemeContext";
import { useWallet } from "../context/WalletContext";
import { errorHandler, shortenAddress } from "@/utils";

const SidebarContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { mode } = useThemeMode();
  const {
    connected,
    address,
    chainId,
    network,
    connect,
    disconnect,
    connecting,
  } = useWallet();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminCheckError, setAdminCheckError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    let active = true;
    setIsAdmin(false);
    setAdminCheckError("");

    if (!connected || !address || chainId !== SEPOLIA_CHAIN_ID) {
      return () => {
        active = false;
      };
    }

    getMarketplaceOwner()
      .then((owner) => {
        if (active) {
          setIsAdmin(getAddress(address) === owner);
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        setAdminCheckError(
          errorHandler(error, "Could not verify marketplace administrator."),
        );
      });

    return () => {
      active = false;
    };
  }, [connected, address, chainId]);

  const handleNavClick = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const navbarItems = useMemo(
    () =>
      NAVIGATION_ITEMS.filter((item) => item.path !== routers.ADMIN || isAdmin),
    [],
  );

  return (
    <Box
      sx={{
        width: 280,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Link to="/">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            component="img"
            src="/logo.png"
          />
        </Link>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            PHX
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Marketplace
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={onClose} sx={{ ml: "auto" }}>
            <X size={20} />
          </IconButton>
        )}
      </Box>

      <Divider />

      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {navbarItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          const Icon = item.icon;

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
                  <Icon
                    size={20}
                    color={isActive ? "#0EA5E9" : "currentColor"}
                  />
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
        })}
        {adminCheckError && (
          <Alert severity="error" sx={{ mt: 1, fontSize: "0.75rem" }}>
            Could not verify admin access: {adminCheckError}
          </Alert>
        )}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        {connected ? (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor:
                mode === "dark"
                  ? "rgba(14, 165, 233, 0.08)"
                  : "rgba(14, 165, 233, 0.04)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: "primary.main",
                  fontSize: "0.7rem",
                }}
              >
                {address?.slice(2, 4).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ display: "block", fontWeight: 600 }}
                >
                  {shortenAddress(address)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", fontSize: "0.65rem" }}
                >
                  {network}
                </Typography>
              </Box>
            </Box>
            <Button
              size="small"
              variant="outlined"
              fullWidth
              onClick={disconnect}
              startIcon={
                <span>
                  <LogOut size={14} />
                </span>
              }
              sx={{ fontSize: "0.75rem", borderRadius: 1.5 }}
            >
              Disconnect
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            fullWidth
            onClick={connect}
            disabled={connecting}
            startIcon={<Wallet size={16} />}
            sx={{ borderRadius: 2 }}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SidebarContent;
