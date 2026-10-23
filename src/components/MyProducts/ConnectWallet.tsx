import { Box, Button } from "@mui/material";
import React from "react";
import PageHeader from "../core/PageHeader";
import { useWallet } from "@/context/WalletContext";
import { Wallet } from "lucide-react";

const ConnectWallet: React.FC = () => {
  const { connect } = useWallet();

  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <PageHeader
        title="My Products"
        description="Connect your wallet to manage your listings and owned products."
      />

      <Button
        variant="contained"
        onClick={connect}
        startIcon={<Wallet size={16} />}
      >
        Connect Wallet
      </Button>
    </Box>
  );
};

export default ConnectWallet;
