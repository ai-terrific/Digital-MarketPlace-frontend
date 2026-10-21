import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { Wallet, PlusCircle, History, Package, Network } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import {
  getProductsByOwner,
  getWalletActivity,
  getWalletBalances,
} from "@/services/productService";
import type { balanceType, Product, WalletActivity } from "@/types";

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { connected, address, network, connect, connecting } = useWallet();
  const [products, setProducts] = useState<Product[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<
    WalletActivity[]
  >([]);
  const [balances, setBalances] = useState<balanceType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>("");
  const [reloadIndex, setReloadIndex] = useState<number>(0);

  useEffect(() => {
    if (!connected || !address) {
      setProducts([]);
      setRecentTransactions([]);
      setBalances(null);
      setLoading(false);

      return;
    }

    let active = true;
    setLoading(true);
    setLoadError("");

    Promise.all([
      getProductsByOwner(address),
      getWalletActivity(address),
      getWalletBalances(address),
    ])
      .then(([walletProducts, activity, walletBalances]) => {
        if (!active) return;
        setProducts(walletProducts);
        setRecentTransactions(activity);
        setBalances(walletBalances);
      })
      .catch((error) => {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load account data.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [connected, address, reloadIndex]);

  const myListings = products.filter((product) => product.status === "Active");
  const ownedProducts = products.filter(
    (product) => product.status !== "Active",
  );

  if (!connected) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: 3,
              bgcolor: "rgba(14, 165, 233, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <Wallet size={36} color="#0EA5E9" />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontFamily: "'Space Grotesk', sans-serif", mb: 1 }}
          >
            Connect Your Wallet
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
          >
            Connect your Web3 wallet to view your account, manage products, and
            track transactions.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={connect}
            disabled={connecting}
            startIcon={<Wallet size={18} />}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card sx={{ mb: 4, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {address?.slice(2, 4).toUpperCase()}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography
                variant="h6"
                sx={{ fontFamily: "'Space Grotesk', sans-serif", mb: 0.5 }}
              >
                My Account
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "monospace",
                  color: "text.secondary",
                  wordBreak: "break-all",
                }}
              >
                {address}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                icon={<Network size={14} />}
                label={network}
                variant="outlined"
                size="small"
              />
              <Chip label="Connected" color="success" size="small" />
            </Box>
          </Box>
        </Card>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress size={28} />
          </Box>
        )}
        {loadError && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setReloadIndex((index) => index + 1)}
              >
                Retry
              </Button>
            }
            sx={{ mb: 3 }}
          >
            {loadError}
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            mb: 4,
          }}
        >
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              PHX Balance
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {balances
                ? `${balances.phx.toLocaleString(undefined, { maximumFractionDigits: 2 })} PHX`
                : "-- PHX"}
            </Typography>
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Sepolia ETH Balance
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {balances
                ? `${balances.eth.toLocaleString(undefined, { maximumFractionDigits: 4 })} ETH`
                : "-- ETH"}
            </Typography>
          </Card>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<PlusCircle size={16} />}
            onClick={() => navigate("/create")}
          >
            Create Listing
          </Button>
          <Button
            variant="outlined"
            startIcon={<Package size={16} />}
            onClick={() => navigate("/my-products")}
          >
            My Products
          </Button>
          <Button
            variant="outlined"
            startIcon={<History size={16} />}
            onClick={() => navigate("/history")}
          >
            Transactions
          </Button>
        </Box>

        <Typography
          variant="h5"
          sx={{ fontFamily: "'Space Grotesk', sans-serif", mb: 2 }}
        >
          My Listings
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 2,
            mb: 4,
          }}
        >
          {!loading && !loadError && myListings.length === 0 && (
            <Typography color="text.secondary" sx={{ gridColumn: "1 / -1" }}>
              You have no active listings.
            </Typography>
          )}
          {myListings.map((p) => (
            <Card
              key={p.id}
              sx={{
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-2px)" },
                overflow: "hidden",
              }}
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <Box
                sx={{
                  height: 120,
                  overflow: "hidden",
                  borderBottom: 1,
                  borderColor: "divider",
                  bgcolor: "rgba(14, 165, 233, 0.03)",
                }}
              >
                <Box
                  component="img"
                  src={p.image}
                  alt={p.name}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  {p.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="primary.main"
                    sx={{ fontWeight: 700 }}
                  >
                    {p.price} {p.currency}
                  </Typography>
                  <Chip
                    label={p.status}
                    size="small"
                    color={p.status === "Active" ? "success" : "default"}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Typography
          variant="h5"
          sx={{ fontFamily: "'Space Grotesk', sans-serif", mb: 2 }}
        >
          Owned Products
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 2,
            mb: 4,
          }}
        >
          {!loading && !loadError && ownedProducts.length === 0 && (
            <Typography color="text.secondary" sx={{ gridColumn: "1 / -1" }}>
              You do not own any inactive products.
            </Typography>
          )}
          {ownedProducts.map((p) => (
            <Card
              key={p.id}
              sx={{
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-2px)" },
                overflow: "hidden",
              }}
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <Box
                sx={{
                  height: 120,
                  overflow: "hidden",
                  borderBottom: 1,
                  borderColor: "divider",
                  bgcolor: "rgba(14, 165, 233, 0.03)",
                }}
              >
                <Box
                  component="img"
                  src={p.image}
                  alt={p.name}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  {p.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Acquired{" "}
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString()
                    : "Date unavailable"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Recent Transactions
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Latest 10 Sepolia blocks
          </Typography>
        </Box>
        <Card>
          {recentTransactions.map((tx, i) => (
            <Box
              key={tx.id}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: i < recentTransactions.length - 1 ? 1 : 0,
                borderColor: "divider",
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => navigate(`/product/${tx.productId}`)}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {tx.type === "listing"
                    ? "Listed"
                    : tx.type === "purchase"
                      ? "Purchased"
                      : tx.type === "sale"
                        ? "Sold"
                        : "Transferred"}{" "}
                  {tx.productName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Block {tx.blockNumber}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tx.value === undefined ? "" : `${tx.value} PHX`}
                </Typography>
                <Chip
                  label="Confirmed"
                  size="small"
                  sx={{
                    fontSize: "0.6rem",
                    height: 20,
                    bgcolor: "rgba(16, 185, 129, 0.1)",
                    color: "#10B981",
                  }}
                />
              </Box>
            </Box>
          ))}
          {!loading && !loadError && recentTransactions.length === 0 && (
            <Typography color="text.secondary" sx={{ p: 2 }}>
              No recent on-chain activity in the latest 10 blocks.
            </Typography>
          )}
        </Card>
      </motion.div>
    </Box>
  );
};

export default AccountPage;
