import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface WalletConnectPromptProps {
  title: string;
  description: string;
  connecting: boolean;
  icon: ReactNode;
  connectIcon?: ReactNode;
  buttonSize?: "small" | "medium" | "large";
  onConnect: () => void;
}

const WalletConnectPrompt: React.FC<WalletConnectPromptProps> = ({
  title,
  description,
  connecting,
  icon,
  connectIcon,
  buttonSize = "medium",
  onConnect,
}) => (
  <Box sx={{ textAlign: "center", py: 8 }}>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
        {icon}
      </Box>
      <Typography variant="h5" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
      >
        {description}
      </Typography>
      <Button
        variant="contained"
        size={buttonSize}
        onClick={onConnect}
        disabled={connecting}
        startIcon={connectIcon}
      >
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    </motion.div>
  </Box>
);

export default WalletConnectPrompt;
