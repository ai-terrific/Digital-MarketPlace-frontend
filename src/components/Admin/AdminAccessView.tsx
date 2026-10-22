import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { AlertTriangle, Settings, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import WalletConnectPrompt from "@/components/core/WalletConnectPrompt";

interface AdminAccessViewProps {
  connected: boolean;
  connecting: boolean;
  loading: boolean;
  error: string;
  address: string | null;
  ownerAddress: string;
  onConnect: () => void;
  onRetry: () => void;
}

const AdminAccessView: React.FC<AdminAccessViewProps> = ({
  connected,
  connecting,
  loading,
  error,
  address,
  ownerAddress,
  onConnect,
  onRetry,
}) => {
  if (!connected) {
    return (
      <WalletConnectPrompt
        title="Admin Settings"
        description="Connect your wallet to access admin controls."
        connecting={connecting}
        icon={<Settings size={36} color="#0EA5E9" />}
        connectIcon={<Wallet size={16} />}
        onConnect={onConnect}
      />
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (
    address &&
    ownerAddress &&
    address.toLowerCase() !== ownerAddress.toLowerCase()
  ) {
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
          <Typography variant="h5" sx={{ mb: 1 }}>
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
            Connected: {address.slice(0, 10)}...{address.slice(-8)}
            <br />
            Owner: **********...********
          </Alert>
        </motion.div>
      </Box>
    );
  }

  return null;
};

export default AdminAccessView;
