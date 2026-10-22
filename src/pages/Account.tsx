import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useWallet } from "@/context/WalletContext";
import {
  getProductsByOwner,
  getWalletActivity,
  getWalletBalances,
} from "@/services/productService";
import type { balanceType, Product, WalletActivity } from "@/types";
import { errorHandler } from "@/utils";
import AccountConnectPrompt from "@/components/Account/AccountConnectPrompt";
import AccountOverview from "@/components/Account/AccountOverview";
import AccountProductList from "@/components/Account/AccountProductList";
import AccountTransactions from "@/components/Account/AccountTransactions";

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { connected, address, network, connect, connecting } = useWallet();
  const [products, setProducts] = useState<Product[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<
    WalletActivity[]
  >([]);
  const [balances, setBalances] = useState<balanceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadIndex, setReloadIndex] = useState(0);

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
        if (active) {
          setLoadError(errorHandler(error, "Could not load account data."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [connected, address, reloadIndex]);

  if (!connected) {
    return (
      <AccountConnectPrompt
        connecting={connecting}
        onConnect={() => void connect()}
      />
    );
  }

  const activeProducts = products.filter(
    (product) => product.status === "Active",
  );
  const ownedProducts = products.filter(
    (product) => product.status !== "Active",
  );

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AccountOverview
          address={address}
          network={network}
          balances={balances}
          onCreateListing={() => navigate("/create")}
          onMyProducts={() => navigate("/my-products")}
          onTransactions={() => navigate("/history")}
        />
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
        <AccountProductList
          title="My Listings"
          products={activeProducts}
          emptyMessage="You have no active listings."
          loading={loading}
          error={loadError}
          onSelect={(id) => navigate(`/product/${id}`)}
        />
        <AccountProductList
          title="Owned Products"
          products={ownedProducts}
          emptyMessage="You do not own any inactive products."
          loading={loading}
          error={loadError}
          onSelect={(id) => navigate(`/product/${id}`)}
          showAcquiredDate
        />
        <AccountTransactions
          transactions={recentTransactions}
          loading={loading}
          error={loadError}
          onSelect={(productId) => navigate(`/product/${productId}`)}
        />
      </motion.div>
    </Box>
  );
};

export default AccountPage;
