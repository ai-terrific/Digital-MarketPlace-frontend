import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Typography,
} from "@mui/material";
import { ExternalLink } from "lucide-react";
import { StatusType, type Product } from "@/types";
import { useDialog } from "@/context/DialogContext";
import { useWallet } from "@/context/WalletContext";
import { buyProduct } from "@/services/productService";
import { errorHandler } from "@/utils";

interface PurchaseDialogProps {
  product: Product;
  listedPrice: string;
  platformFee: string;
  platformFeeBps: number;
  total: string;
  onSuccess: () => void;
}

const PurchaseDialog: React.FC<PurchaseDialogProps> = ({
  product,
  listedPrice,
  platformFee,
  platformFeeBps,
  total,
  onSuccess,
}) => {
  const { closeDialog, setDialogCloseDisabled } = useDialog();
  const { connected, connect, getSigner } = useWallet();
  const [status, setStatus] = useState<StatusType>(StatusType.Idle);
  const [error, setError] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const handlePurchase = async () => {
    if (!connected) {
      try {
        await connect();
      } catch (cause) {
        setError(errorHandler(cause, "Wallet connection failed."));
        setStatus(StatusType.Error);
      }

      return;
    }

    setStatus(StatusType.Pending);
    setError("");
    setDialogCloseDisabled(true);
    try {
      const signer = await getSigner();
      const hash = await buyProduct(product.id, signer);
      setTransactionHash(hash);
      setStatus(StatusType.Success);
      onSuccess();
    } catch (cause) {
      setError(errorHandler(cause, "Purchase failed."));
      setStatus(StatusType.Error);
    } finally {
      setDialogCloseDisabled(false);
    }
  };

  return (
    <>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You are about to purchase:
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {product.name}
        </Typography>
        <Box
          sx={{ bgcolor: "background.default", p: 2, borderRadius: 2, mb: 2 }}
        >
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
        {status === StatusType.Pending && (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="body2" color="primary.main">
              Transaction pending... Please confirm in your wallet.
            </Typography>
          </Box>
        )}
        {status === StatusType.Success && (
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
        {status === StatusType.Error && (
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
        <Button onClick={closeDialog} disabled={status === StatusType.Pending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => void handlePurchase()}
          disabled={
            status === StatusType.Pending || status === StatusType.Success
          }
        >
          {!connected
            ? "Connect Wallet"
            : status === StatusType.Pending
              ? "Pending..."
              : "Confirm Purchase"}
        </Button>
      </DialogActions>
    </>
  );
};

export default PurchaseDialog;
