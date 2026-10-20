import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Chip,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, ExternalLink, Shield } from "lucide-react";
import { useThemeMode } from "../ThemeContext";
import { useWallet } from "../context/WalletContext";
import type { Product } from "../types";
import { buyProduct, getProductDetails } from "@/services/productService";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const { connected, address, connect, getSigner } = useWallet();
  const [product, setProduct] = useState<Product | null>(null);
  const [platformFeeBps, setPlatformFeeBps] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadVersion, setReloadVersion] = useState(0);
  const [buyDialog, setBuyDialog] = useState(false);
  const [txStatus, setTxStatus] = useState<
    "idle" | "pending" | "success" | "failed"
  >("idle");
  const [txError, setTxError] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");

    if (!id) {
      setLoadError("Product ID is missing.");
      setLoading(false);

      return () => {
        active = false;
      };
    }

    getProductDetails(id)
      .then(({ product: chainProduct, platformFeeBps: feeBps }) => {
        if (!active) return;
        setProduct(chainProduct);
        setPlatformFeeBps(feeBps);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load this product from Sepolia.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, reloadVersion]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box sx={{ maxWidth: 720, mx: "auto", py: 6 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setReloadVersion((value) => value + 1)}
            >
              Retry
            </Button>
          }
        >
          {loadError}
        </Alert>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Back to Marketplace
        </Button>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5">Product not found</Typography>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Back to Marketplace
        </Button>
      </Box>
    );
  }

  const platformFee = (product.price * platformFeeBps) / 10000;
  const total = product.price + platformFee;

  const handlePurchase = async () => {
    if (!connected) {
      await connect();

      return;
    }
    setTxStatus("pending");
    setTxError("");
    setTransactionHash("");
    try {
      const signer = await getSigner();
      const hash = await buyProduct(product.id, signer);
      setTransactionHash(hash);
      setTxStatus("success");
      setReloadVersion((value) => value + 1);
    } catch (error) {
      setTxError(error instanceof Error ? error.message : "Purchase failed.");
      setTxStatus("failed");
    }
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowLeft size={16} />}
        onClick={() => navigate("/")}
        sx={{ mb: 3, color: "text.secondary" }}
      >
        Back to Marketplace
      </Button>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {/* Product Image */}
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 55%" }, minWidth: 0 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Box
              sx={{
                height: { xs: 280, md: 420 },
                borderRadius: 3,
                overflow: "hidden",
                border: 1,
                borderColor: "divider",
                bgcolor:
                  mode === "dark"
                    ? "rgba(14, 165, 233, 0.05)"
                    : "rgba(14, 165, 233, 0.02)",
              }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </motion.div>
        </Box>

        {/* Product Info */}
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 40%" }, minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Typography
              variant="h3"
              sx={{ fontFamily: "'Space Grotesk', sans-serif", mb: 1 }}
            >
              {product.name}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.7 }}
            >
              {product.description}
            </Typography>

            {/* Price */}
            <Card sx={{ mb: 3, p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Price
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {product.price} {product.currency}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Platform Fee ({(platformFeeBps / 100).toFixed(2)}%)
                </Typography>
                <Typography variant="body2">
                  {platformFee.toFixed(product.currency === "ETH" ? 4 : 0)}{" "}
                  {product.currency}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Total
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  {total.toFixed(product.currency === "ETH" ? 4 : 0)}{" "}
                  {product.currency}
                </Typography>
              </Box>
            </Card>

            {/* Seller Info */}
            <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <Shield size={16} color="#0EA5E9" />
              <Typography variant="body2" color="text.secondary">
                Seller:{" "}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.seller}
              </Typography>
            </Box>

            {/* Status */}
            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              <Chip
                label={`Status: ${product.status}`}
                color={product.status === "active" ? "success" : "default"}
                size="small"
              />
              <Chip
                label={`Currency: ${product.currency}`}
                size="small"
                variant="outlined"
              />
            </Box>
            {product.owner?.toLowerCase() === address?.toLowerCase() && (
              <Alert severity="info" sx={{ mb: 2 }}>
                You own this product and cannot purchase it.
              </Alert>
            )}

            {/* Buy Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => setBuyDialog(true)}
              startIcon={<ShoppingCart size={18} />}
              disabled={
                product.status !== "active" ||
                product.owner?.toLowerCase() === address?.toLowerCase()
              }
              sx={{ mb: 2 }}
            >
              {product.status === "active" ? "Purchase" : "Not Available"}
            </Button>
          </motion.div>
        </Box>
      </Box>

      {/* Purchase Dialog */}
      <Dialog
        open={buyDialog}
        onClose={() => {
          setBuyDialog(false);
          setTxStatus("idle");
          setTxError("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Confirm Purchase
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You are about to purchase:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {product.name}
          </Typography>
          <Box
            sx={{ bgcolor: "background.default", p: 2, borderRadius: 2, mb: 2 }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Price
              </Typography>
              <Typography variant="body2">
                {product.price} {product.currency}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Platform Fee ({(platformFeeBps / 100).toFixed(2)}%)
              </Typography>
              <Typography variant="body2">
                {platformFee.toFixed(product.currency === "ETH" ? 4 : 0)}{" "}
                {product.currency}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Total
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                {total.toFixed(product.currency === "ETH" ? 4 : 0)}{" "}
                {product.currency}
              </Typography>
            </Box>
          </Box>
          {txStatus === "pending" && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="body2" color="primary.main">
                Transaction pending... Please confirm in your wallet.
              </Typography>
            </Box>
          )}
          {txStatus === "success" && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Purchase confirmed.{" "}
              <Button
                component="a"
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noreferrer"
                size="small"
                endIcon={<ExternalLink size={14} />}
              >
                View transaction
              </Button>
            </Alert>
          )}
          {txStatus === "failed" && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {txError}
            </Alert>
          )}
          {!connected && (
            <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
              Please connect your wallet to proceed with the purchase.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setBuyDialog(false);
              setTxStatus("idle");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePurchase}
            disabled={txStatus === "pending" || txStatus === "success"}
          >
            {!connected
              ? "Connect Wallet"
              : txStatus === "pending"
                ? "Pending..."
                : "Confirm Purchase"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductDetailsPage;
