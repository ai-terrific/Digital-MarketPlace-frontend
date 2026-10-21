import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAddress } from "ethers";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Package,
  Edit,
  ArrowRightLeft,
  Eye,
  PlusCircle,
  Wallet,
  Power,
} from "lucide-react";
import { useWallet } from "../context/WalletContext";
import {
  activateProduct,
  getProductActivity,
  getProductsByOwner,
  transferProduct,
  updateProductDetails,
} from "@/services/productService";
import type { Product, ProductActivity } from "@/types";

const MyProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { connected, address, connect, getSigner } = useWallet();
  const [tab, setTab] = useState<number>(0);
  const [transferDialog, setTransferDialog] = useState<string | null>(null);
  const [transferAddress, setTransferAddress] = useState<string>("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [activationProduct, setActivationProduct] = useState<Product | null>(
    null,
  );
  const [activationPrice, setActivationPrice] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [soldProducts, setSoldProducts] = useState<ProductActivity[]>([]);
  const [transferredProducts, setTransferredProducts] = useState<
    ProductActivity[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");
  const [actionBusy, setActionBusy] = useState<boolean>(false);
  const [reloadIndex, setReloadIndex] = useState<number>(0);

  useEffect(() => {
    if (!connected || !address) {
      setProducts([]);
      setSoldProducts([]);
      setTransferredProducts([]);
      setLoading(false);

      return;
    }

    let active = true;
    setLoading(true);
    setLoadError("");

    Promise.all([getProductsByOwner(address), getProductActivity(address)])
      .then(([ownedProducts, activity]) => {
        if (!active) return;
        setProducts(ownedProducts);
        setSoldProducts(activity.sold);
        setTransferredProducts(activity.transferred);
      })
      .catch((error) => {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load your products.",
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

  const confirmTransfer = async () => {
    if (!transferDialog) return;
    setActionBusy(true);
    setActionError("");
    try {
      const signer = await getSigner();
      await transferProduct(transferDialog, transferAddress, signer);
      setTransferDialog(null);
      setTransferAddress("");
      setReloadIndex((index) => index + 1);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Product transfer failed.",
      );
    } finally {
      setActionBusy(false);
    }
  };

  const confirmEdit = async () => {
    if (!editProduct) return;
    setActionBusy(true);
    setActionError("");
    try {
      const signer = await getSigner();
      await updateProductDetails(
        editProduct.id,
        editName,
        editDescription,
        signer,
      );
      setEditProduct(null);
      setReloadIndex((index) => index + 1);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Product update failed.",
      );
    } finally {
      setActionBusy(false);
    }
  };

  const confirmActivate = async () => {
    if (!activationProduct) return;
    setActionBusy(true);
    setActionError("");
    try {
      const signer = await getSigner();
      await activateProduct(activationProduct.id, activationPrice, signer);
      setActivationProduct(null);
      setReloadIndex((index) => index + 1);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Product activation failed.",
      );
    } finally {
      setActionBusy(false);
    }
  };

  if (!connected) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
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
          <Package size={36} color="#0EA5E9" />
        </Box>
        <Typography
          variant="h5"
          sx={{ fontFamily: "'Space Grotesk', sans-serif", mb: 1 }}
        >
          My Products
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Connect your wallet to manage your listings and owned products.
        </Typography>
        <Button
          variant="contained"
          onClick={connect}
          startIcon={<Wallet size={16} />}
        >
          Connect Wallet
        </Button>
      </Box>
    );
  }

  const tabs = ["My Listings", "Owned Products", "Sold", "Transferred"];

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            My Products
          </Typography>
          <Button
            variant="contained"
            startIcon={<PlusCircle size={16} />}
            onClick={() => navigate("/create")}
          >
            New Listing
          </Button>
        </Box>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        >
          {tabs.map((label, i) => (
            <Tab
              key={i}
              label={label}
              sx={{ textTransform: "none", fontWeight: 500 }}
            />
          ))}
        </Tabs>

        {tab >= 2 && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 2 }}
          >
            Activity is limited to the latest 10 Sepolia blocks by the RPC
            provider.
          </Typography>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
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
            sx={{ mb: 2 }}
          >
            {loadError}
          </Alert>
        )}
        {actionError &&
          !transferDialog &&
          !editProduct &&
          !activationProduct && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {actionError}
            </Alert>
          )}

        {tab === 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {myListings.map((product) => (
              <Card key={product.id} sx={{ overflow: "hidden" }}>
                <Box sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      width: 120,
                      minHeight: 120,
                      flexShrink: 0,
                      overflow: "hidden",
                      bgcolor: "rgba(14, 165, 233, 0.03)",
                    }}
                  >
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                  <CardContent sx={{ flex: 1, p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.price} {product.currency}
                        </Typography>
                      </Box>
                      <Chip
                        label={product.status}
                        size="small"
                        color={
                          product.status === "Active" ? "success" : "default"
                        }
                      />
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        size="small"
                        startIcon={<Eye size={14} />}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Edit size={14} />}
                        variant="outlined"
                        onClick={() => {
                          setEditProduct(product);
                          setEditName(product.name);
                          setEditDescription(product.description);
                          setActionError("");
                        }}
                      >
                        Edit
                      </Button>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            ))}
            {!loading && !loadError && myListings.length === 0 && (
              <Typography
                color="text.secondary"
                sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}
              >
                You have no active listings.
              </Typography>
            )}
          </Box>
        )}

        {tab === 1 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {ownedProducts.map((product) => (
              <Card key={product.id} sx={{ overflow: "hidden" }}>
                <Box sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      width: 120,
                      minHeight: 120,
                      flexShrink: 0,
                      overflow: "hidden",
                      bgcolor: "rgba(14, 165, 233, 0.03)",
                    }}
                  >
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                  <CardContent sx={{ flex: 1, p: 2 }}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Acquired:{" "}
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString()
                          : "On-chain"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Price: {product.price} {product.currency}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        size="small"
                        startIcon={<Eye size={14} />}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<ArrowRightLeft size={14} />}
                        variant="outlined"
                        onClick={() => setTransferDialog(product.id)}
                      >
                        Transfer
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Power size={14} />}
                        variant="outlined"
                        disabled={actionBusy}
                        onClick={() => {
                          setActivationProduct(product);
                          setActivationPrice(String(product.price));
                          setActionError("");
                        }}
                      >
                        Activate
                      </Button>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            ))}
            {!loading && !loadError && ownedProducts.length === 0 && (
              <Typography
                color="text.secondary"
                sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}
              >
                You do not own any inactive products.
              </Typography>
            )}
          </Box>
        )}

        {tab === 2 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {soldProducts.map((activity) => (
              <Card key={activity.transactionHash} sx={{ overflow: "hidden" }}>
                <Box sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      width: 120,
                      minHeight: 120,
                      flexShrink: 0,
                      overflow: "hidden",
                      bgcolor: "rgba(14, 165, 233, 0.03)",
                    }}
                  >
                    <Box
                      component="img"
                      src={activity.product.image}
                      alt={activity.product.name}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                  <CardContent sx={{ flex: 1, p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {activity.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sold for {activity.value ?? activity.product.price}{" "}
                          PHX
                        </Typography>
                      </Box>
                      <Chip label="Sold" size="small" color="info" />
                    </Box>
                    <Button
                      size="small"
                      startIcon={<Eye size={14} />}
                      onClick={() =>
                        navigate(`/product/${activity.product.id}`)
                      }
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Box>
              </Card>
            ))}
            {soldProducts.length === 0 && (
              <Typography
                color="text.secondary"
                sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}
              >
                No sold products yet
              </Typography>
            )}
          </Box>
        )}

        {tab === 3 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {transferredProducts.map((activity) => (
              <Card key={activity.transactionHash} sx={{ overflow: "hidden" }}>
                <Box sx={{ display: "flex" }}>
                  <Box
                    component="img"
                    src={activity.product.image}
                    alt={activity.product.name}
                    sx={{ width: 120, minHeight: 120, objectFit: "cover" }}
                  />
                  <CardContent sx={{ flex: 1, p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {activity.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Transferred to {activity.counterparty.slice(0, 6)}...
                      {activity.counterparty.slice(-4)}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<Eye size={14} />}
                      onClick={() =>
                        navigate(`/product/${activity.product.id}`)
                      }
                      sx={{ mt: 1 }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Box>
              </Card>
            ))}
            {transferredProducts.length === 0 && (
              <Typography
                color="text.secondary"
                sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}
              >
                No transferred products yet
              </Typography>
            )}
          </Box>
        )}
      </motion.div>

      <Dialog
        open={!!transferDialog}
        onClose={() => {
          if (!actionBusy) setTransferDialog(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Transfer Ownership</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Transfer this product to another wallet. This requires an on-chain
            transaction (gas fees apply). No payment is exchanged — this is a
            free ownership transfer.
          </Typography>
          <TextField
            fullWidth
            label="Recipient Address"
            placeholder="0x..."
            value={transferAddress}
            onChange={(e) => setTransferAddress(e.target.value)}
            error={Boolean(transferAddress) && !isAddress(transferAddress)}
            helperText={
              transferAddress && !isAddress(transferAddress)
                ? "Enter a valid wallet address."
                : ""
            }
            sx={{ mt: 1 }}
          />
          {actionError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setTransferDialog(null)} disabled={actionBusy}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!isAddress(transferAddress) || actionBusy}
            onClick={confirmTransfer}
          >
            {actionBusy ? "Transferring..." : "Confirm Transfer"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(activationProduct)}
        onClose={() => {
          if (!actionBusy) setActivationProduct(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Activate Product</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set the price buyers will pay for{" "}
            {activationProduct?.name ?? "this product"}.
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Listing Price (PHX)"
            value={activationPrice}
            onChange={(event) => setActivationPrice(event.target.value)}
            slotProps={{ htmlInput: { min: 0, step: "any" } }}
            error={
              activationPrice.trim() !== "" &&
              (!Number.isFinite(Number(activationPrice)) ||
                Number(activationPrice) <= 0)
            }
            helperText="Enter a price greater than zero."
            sx={{ mt: 1 }}
          />
          {actionError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setActivationProduct(null)}
            disabled={actionBusy}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmActivate}
            disabled={
              !activationPrice.trim() ||
              !Number.isFinite(Number(activationPrice)) ||
              Number(activationPrice) <= 0 ||
              actionBusy
            }
          >
            {actionBusy ? "Activating..." : "Activate"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(editProduct)}
        onClose={() => {
          if (!actionBusy) setEditProduct(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Product Name"
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Description"
            value={editDescription}
            onChange={(event) => setEditDescription(event.target.value)}
          />
          {actionError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditProduct(null)} disabled={actionBusy}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmEdit}
            disabled={!editName.trim() || actionBusy}
          >
            {actionBusy ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyProductsPage;
