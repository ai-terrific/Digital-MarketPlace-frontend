import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { ExternalLink } from "lucide-react";
import type { Product, statusType } from "@/types";

interface PurchaseDialogProps {
  open: boolean;
  product: Product;
  listedPrice: string;
  platformFee: string;
  platformFeeBps: number;
  total: string;
  connected: boolean;
  status: statusType;
  error: string;
  transactionHash: string;
  onClose: () => void;
  onPurchase: () => void;
}

const PurchaseDialog: React.FC<PurchaseDialogProps> = ({
  open,
  product,
  listedPrice,
  platformFee,
  platformFeeBps,
  total,
  connected,
  status,
  error,
  transactionHash,
  onClose,
  onPurchase,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
      <Box sx={{ bgcolor: "background.default", p: 2, borderRadius: 2, mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Price
          </Typography>
          <Typography variant="body2">
            {listedPrice} {product.currency}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Buyer Platform Fee ({(platformFeeBps / 100).toFixed(2)}%)
          </Typography>
          <Typography variant="body2">
            {platformFee} {product.currency}
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
            {total} {product.currency}
          </Typography>
        </Box>
      </Box>
      {status === "pending" && (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="body2" color="primary.main">
            Transaction pending... Please confirm in your wallet.
          </Typography>
        </Box>
      )}
      {status === "success" && (
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
      {status === "error" && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {!connected && (
        <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
          Please connect your wallet to proceed with the purchase.
        </Typography>
      )}
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose}>Cancel</Button>
      <Button
        variant="contained"
        onClick={onPurchase}
        disabled={status === "pending" || status === "success"}
      >
        {!connected
          ? "Connect Wallet"
          : status === "pending"
            ? "Pending..."
            : "Confirm Purchase"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default PurchaseDialog;
