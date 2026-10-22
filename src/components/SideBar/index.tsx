import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  List,
  Button,
  useMediaQuery,
  useTheme,
  Avatar,
  Alert,
  Divider,
} from "@mui/material";
import { Wallet, LogOut, X } from "lucide-react";
import { getAddress } from "ethers";
import { NAVIGATION_ITEMS, routers, SEPOLIA_CHAIN_ID } from "@/constants";
import { getMarketplaceOwner } from "@/services/marketplaceAdminService";
import { useThemeMode } from "../../context/ThemeContext";
import { useWallet } from "../../context/WalletContext";
import { errorHandler, shortenAddress } from "@/utils";
import Logo from "../Core/Logo";
import SidebarListItem from "./ListItem";

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

  const navbarItems = NAVIGATION_ITEMS.filter(
    (item) => item.path !== routers.ADMIN || isAdmin,
  );

  return (
    <Box
      sx={{
        width: 280,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Logo />
        <Box>
          <Typography
            variant="h6"
            sx={{
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
        {navbarItems.map((item) => (
          <SidebarListItem key={item.label} item={item} onClose={onClose} />
        ))}
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
