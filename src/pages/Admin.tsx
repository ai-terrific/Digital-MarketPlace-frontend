import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  DollarSign,
  Wallet,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { getMarketplaceAdminData } from "@/services/marketplaceAdminService";
import type { MarketplaceAdminData } from "@/types";
import { PageDescription, PageTitle } from "@/components/core/Common";
import ContractInformation from "@/components/Admin/ContractInformation";
import UpdateListingFee from "@/components/Admin/UpdateListingFee";
import UpdateBuyerPlatformFee from "@/components/Admin/UpdateBuyerPlatformFee";
import WithdrawPlatformFees from "@/components/Admin/WithdrawPlatformFees";

const AdminPage: React.FC = () => {
  const { connected, address, connect, connecting, network } = useWallet();
  const [adminData, setAdminData] = useState<MarketplaceAdminData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>("");
  const [reloadIndex, setReloadIndex] = useState<number>(0);
  useEffect(() => {
    if (!connected || !address) {
      setAdminData(null);
      setLoading(false);

      return;
    }

    let active = true;
    setLoading(true);
    setLoadError("");
    getMarketplaceAdminData()
      .then((data) => {
        if (active) {
          setAdminData(data);
        }
      })
      .catch((error) => {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load marketplace admin data.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [connected, address, reloadIndex]);

  const ownerAddress = adminData?.owner ?? "";
  const isOwner =
    connected &&
    Boolean(address && ownerAddress) &&
    address!.toLowerCase() === ownerAddress.toLowerCase();
  const currentFee = adminData ? adminData.platformFeeBps / 100 : 0;
  const maxFee = adminData ? adminData.maxFeeBps / 100 : 10;
  const withdrawableBalance = adminData?.pendingPlatformFees ?? 0;
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
          <Settings size={36} color="#0EA5E9" />
        </Box>
        <Typography
          variant="h5"
          sx={{ fontFamily: "'Space Grotesk', sans-serif", mb: 1 }}
        >
          Admin Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Connect your wallet to access admin controls.
        </Typography>
        <Button
          variant="contained"
          onClick={connect}
          disabled={connecting}
          startIcon={<Wallet size={16} />}
        >
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (loadError || !adminData) {
    return (
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
      >
        {loadError || "Marketplace admin data is unavailable."}
      </Alert>
    );
  }

  if (!isOwner) {
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
              bgcolor: "rgba(239, 68, 68, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <AlertTriangle size={36} color="#EF4444" />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontFamily: "'Space Grotesk', sans-serif", mb: 1 }}
          >
            Unauthorized
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 400, mx: "auto" }}
          >
            Your connected wallet is not the marketplace owner. Admin controls
            are enforced by the smart contract — only the contract owner can
            access these settings.
          </Typography>
          <Alert
            severity="warning"
            sx={{ mt: 3, maxWidth: 500, mx: "auto", textAlign: "left" }}
          >
            Connected: {address?.slice(0, 10)}...{address?.slice(-8)}
            <br />
            Owner: **********...********
          </Alert>
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
        <PageTitle title="Admin Settings" />
        <PageDescription
          description="Manage marketplace configuration. All changes require on-chain
          transactions."
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <ContractInformation
            name="Owner"
            value={`${address?.slice(0, 12)}...${address?.slice(-8)}`}
            icon={<Shield size={16} color="#0EA5E9" />}
          />
          <ContractInformation
            name="Buyer Platform Fee"
            value={`${currentFee}%`}
            icon={<DollarSign size={16} color="#0EA5E9" />}
          />
          <ContractInformation
            name="Withdrawable"
            value={`${withdrawableBalance.toLocaleString()} PHX`}
            icon={<Wallet size={16} color="#0EA5E9" />}
          />
          <ContractInformation
            name="Network"
            value={`${network || "Ethereum Sepolia"}`}
            icon={<TrendingUp size={16} color="#0EA5E9" />}
          />
        </Box>

        <UpdateListingFee
          adminData={adminData}
          setReloadIndex={setReloadIndex}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
            mb: 4,
            alignItems: "stretch",
          }}
        >
          <UpdateBuyerPlatformFee
            currentFee={currentFee}
            maxFee={maxFee}
            setReloadIndex={setReloadIndex}
          />
          <WithdrawPlatformFees
            balance={withdrawableBalance}
            ownerAddress={ownerAddress}
            setReloadIndex={setReloadIndex}
          />
        </Box>
      </motion.div>
    </Box>
  );
};

export default AdminPage;
