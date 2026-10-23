import { useWallet } from "@/context/WalletContext";
import { Alert, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import React from "react";

interface UnAuthorizedProps {
  ownerAddress: string;
}

const UnAuthorized: React.FC<UnAuthorizedProps> = ({ ownerAddress }) => {
  const { address } = useWallet();

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
          Your connected wallet is not the marketplace owner. Admin controls are
          enforced by the smart contract — only the contract owner can access
          these settings.
        </Typography>
        <Alert
          severity="warning"
          sx={{ mt: 3, maxWidth: 500, mx: "auto", textAlign: "left" }}
        >
          Connected: {address?.slice(0, 10)}...{address?.slice(-8)}
          <br />
          Owner: {ownerAddress}
        </Alert>
      </motion.div>
    </Box>
  );
};

export default UnAuthorized;
