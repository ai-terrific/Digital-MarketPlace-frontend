import { parseUnits } from "ethers";
import {
  Alert,
  Box,
  Button,
  Card,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { DollarSign } from "lucide-react";
import React, { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { updateMarketplaceFee } from "@/services/marketplaceAdminService";
import { StatusType } from "@/types";

interface UpdateBuyerPlatformFeeProps {
  currentFee: number;
  maxFee: number;
  setReloadIndex: React.Dispatch<React.SetStateAction<number>>;
}

const UpdateBuyerPlatformFee: React.FC<UpdateBuyerPlatformFeeProps> = ({
  currentFee,
  maxFee,
  setReloadIndex,
}) => {
  const { getSigner } = useWallet();
  const [newFee, setNewFee] = useState(String(currentFee));
  const [feeUpdating, setFeeUpdating] = useState(false);
  const [feeStatus, setFeeStatus] = useState<StatusType>(StatusType.Idle);
  const [feeError, setFeeError] = useState("");
  const [feeTransactionHash, setFeeTransactionHash] = useState("");

  const handleUpdateFee = async () => {
    const fee = Number(newFee);
    if (!Number.isFinite(fee) || fee < 0 || fee > maxFee) {
      setFeeError(`Enter a fee between 0 and ${maxFee}%.`);
      setFeeStatus(StatusType.Error);

      return;
    }

    setFeeUpdating(true);
    setFeeStatus(StatusType.Pending);
    setFeeError("");
    setFeeTransactionHash("");
    try {
      const signer = await getSigner();
      const hash = await updateMarketplaceFee(parseUnits(newFee, 2), signer);
      setFeeTransactionHash(hash);
      setFeeStatus(StatusType.Success);
      setReloadIndex((index) => index + 1);
    } catch (error) {
      setFeeError(
        error instanceof Error ? error.message : "Platform fee update failed.",
      );
      setFeeStatus(StatusType.Error);
    } finally {
      setFeeUpdating(false);
    }
  };

  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Typography
        variant="h6"
        sx={{
          fontFamily: "'Space Grotesk', sans-serif",
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <DollarSign size={20} /> Update Buyer Platform Fee
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Buyers pay this percentage in addition to the listed price; sellers
        receive the full listed price. Current fee: {currentFee}%. Allowed
        range: 0-{maxFee}%. Updating requires a wallet transaction and gas fees.
      </Alert>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Buyer Fee (%)"
          type="number"
          value={newFee}
          onChange={(event) => {
            setNewFee(event.target.value);
            setFeeStatus(StatusType.Idle);
            setFeeError("");
          }}
          size="small"
          sx={{ width: 150 }}
          slotProps={{ htmlInput: { min: 0, max: maxFee, step: 0.01 } }}
        />
        <Button
          variant="contained"
          onClick={() => void handleUpdateFee()}
          disabled={
            feeUpdating ||
            !/^\d+(\.\d{1,2})?$/.test(newFee.trim()) ||
            !Number.isFinite(Number(newFee)) ||
            Number(newFee) < 0 ||
            Number(newFee) > maxFee ||
            Number(newFee) === currentFee
          }
        >
          {feeUpdating
            ? "Updating..."
            : feeStatus === StatusType.Success
              ? "Updated!"
              : "Update Fee"}
        </Button>
      </Box>
      {feeStatus === StatusType.Pending && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block" }}
          >
            Transaction pending... Confirm in your wallet.
          </Typography>
        </Box>
      )}
      {feeStatus === StatusType.Success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Fee updated successfully. Transaction: {feeTransactionHash}
        </Alert>
      )}
      {feeError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {feeError}
        </Alert>
      )}
    </Card>
  );
};

export default UpdateBuyerPlatformFee;
