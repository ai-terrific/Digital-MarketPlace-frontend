import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { Package, PlusCircle, Wallet } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import {
  getProductActivity,
  getProductsByOwner,
} from "@/services/productService";
import type { Product, ProductActivity } from "@/types";
import { TABS } from "@/constants";
import MyProductsList from "@/components/MyProducts/MyProductsList";

const MyProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { connected, address, connect } = useWallet();
  const [tab, setTab] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [soldProducts, setSoldProducts] = useState<ProductActivity[]>([]);
  const [transferredProducts, setTransferredProducts] = useState<
    ProductActivity[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>("");
  const [reloadIndex, setReloadIndex] = useState(0);

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

  const list = [myListings, ownedProducts, soldProducts, transferredProducts];

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
          {TABS.map((label, i) => (
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
        <MyProductsList
          tab={tab}
          list={list[tab]}
          loading={loading}
          loadError={loadError}
          onProductChange={() => setReloadIndex((index) => index + 1)}
        />
      </motion.div>
    </Box>
  );
};

export default MyProductsPage;
