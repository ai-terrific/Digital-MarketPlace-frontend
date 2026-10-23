import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Settings, Shield, DollarSign, Wallet, TrendingUp } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { useRefresh } from "../hooks/useRefresh";
import { getMarketplaceAdminData } from "@/services/marketplaceAdminService";
import type { MarketplaceAdminData } from "@/types";
import { Loading, PageDescription, PageTitle } from "@/components/core/Common";
import ContractInformation from "@/components/Admin/ContractInformation";
import UpdateListingFee from "@/components/Admin/UpdateListingFee";
import UpdateBuyerPlatformFee from "@/components/Admin/UpdateBuyerPlatformFee";
import WithdrawPlatformFees from "@/components/Admin/WithdrawPlatformFees";
import UnAuthorized from "@/components/Admin/UnAuthorized";
import LoadingError from "@/components/Admin/LoadingError";
import PageHeader from "@/components/core/PageHeader";

const AdminPage: React.FC = () => {
  const { connected, address, connect, connecting, network } = useWallet();
  const [adminData, setAdminData] = useState<MarketplaceAdminData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>("");
  const { index, refresh } = useRefresh();
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
  }, [connected, address, index]);

  const ownerAddress = adminData?.owner ?? "";
  const isOwner =
    connected &&
    Boolean(address && ownerAddress) &&
    address!.toLowerCase() === ownerAddress.toLowerCase();
  const currentFee = adminData ? adminData.platformFeeBps / 100 : 0;
  const maxFee = adminData ? adminData.maxFeeBps / 100 : 10;
  const withdrawableBalance = adminData?.pendingPlatformFees ?? 0;
  const contractInformation = [
    {
      name: "Owner",
      value: `${address?.slice(0, 12)}...${address?.slice(-8)}`,
      icon: <Shield size={16} color="#0EA5E9" />,
    },
    {
      name: "Buyer Platform Fee",
      value: `${currentFee}%`,
      icon: <DollarSign size={16} color="#0EA5E9" />,
    },
    {
      name: "Withdrawable",
      value: `${withdrawableBalance.toLocaleString()} PHX`,
      icon: <Wallet size={16} color="#0EA5E9" />,
    },
    {
      name: "Network",
      value: network || "Ethereum Sepolia",
      icon: <TrendingUp size={16} color="#0EA5E9" />,
    },
  ];

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

        <PageHeader
          title="Admin Settings"
          description="Connect your wallet to access admin controls."
        />

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
    return <Loading />;
  }

  if (loadError || !adminData) {
    return (
      <LoadingError>
        {loadError || "Marketplace admin data is unavailable."}
      </LoadingError>
    );
  }

  if (!isOwner) {
    return <UnAuthorized ownerAddress={ownerAddress} />;
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
          {contractInformation.map((information) => (
            <ContractInformation key={information.name} {...information} />
          ))}
        </Box>

        <UpdateListingFee adminData={adminData} refresh={refresh} />

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
            refresh={refresh}
          />
          <WithdrawPlatformFees
            balance={withdrawableBalance}
            ownerAddress={ownerAddress}
            refresh={refresh}
          />
        </Box>
      </motion.div>
    </Box>
  );
};

export default AdminPage;
