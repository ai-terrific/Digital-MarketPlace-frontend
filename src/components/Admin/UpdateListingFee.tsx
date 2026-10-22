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
import React, { useEffect, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { updateFixedListingFee } from "@/services/marketplaceAdminService";
import { MarketplaceAdminData } from "@/types/marketplace";
import { StatusType } from "@/types";
import { validateFee } from "@/utils";

interface UpdateListingFeeType {
  adminData: MarketplaceAdminData | null;
  setReloadIndex: React.Dispatch<React.SetStateAction<number>>;
}

const UpdateListingFee: React.FC<UpdateListingFeeType> = ({
  adminData,
  setReloadIndex,
}) => {
  const { getSigner } = useWallet();
  const [newListingFee, setNewListingFee] = useState<string>(
    adminData?.fixedListingFee ?? "0",
  );
  const [listingFeeStatus, setListingFeeStatus] = useState<StatusType>(
    StatusType.Idle,
  );
  const [listingFeeError, setListingFeeError] = useState<string>("");
  const [listingFeeUpdating, setListingFeeUpdating] = useState<boolean>(false);
  const [listingFeeTransactionHash, setListingFeeTransactionHash] =
    useState<string>("");

  const currentListingFee = adminData?.fixedListingFee ?? "0";

  useEffect(() => {
    if (adminData) setNewListingFee(adminData.fixedListingFee);
  }, [adminData?.fixedListingFee]);

  const handleUpdateListingFee = async () => {
    if (!adminData || validateFee(newListingFee)) {
      setListingFeeError("Enter a valid PHX amount with up to 18 decimals.");
      setListingFeeStatus(StatusType.Error);

      return;
    }

    const fee = parseUnits(newListingFee.trim(), 18);
    if (fee === parseUnits(currentListingFee, 18)) {
      return;
    }

    setListingFeeUpdating(true);
    setListingFeeStatus(StatusType.Pending);
    setListingFeeError("");
    setListingFeeTransactionHash("");
    try {
      const signer = await getSigner();
      const hash = await updateFixedListingFee(fee, signer);
      setListingFeeTransactionHash(hash);
      setListingFeeStatus(StatusType.Success);
      setReloadIndex((index) => index + 1);
    } catch (error) {
      setListingFeeError(
        error instanceof Error
          ? error.message
          : "Fixed listing fee update failed.",
      );
      setListingFeeStatus(StatusType.Error);
    } finally {
      setListingFeeUpdating(false);
    }
  };

  return (
    <Card sx={{ mb: 4, p: 3 }}>
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
        <DollarSign size={20} /> Update Fixed Listing Fee
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Sellers pay this fixed PHX fee once when creating a product. It does not
        change with the product price. Buyers pay the percentage platform fee
        separately when purchasing.
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
          label="New Listing Fee (PHX)"
          type="number"
          value={newListingFee}
          onChange={(e) => {
            setNewListingFee(e.target.value);
            setListingFeeStatus(StatusType.Idle);
            setListingFeeError("");
          }}
          size="small"
          sx={{ width: 190 }}
          slotProps={{ htmlInput: { min: 0, step: "any" } }}
        />
        <Button
          variant="contained"
          onClick={handleUpdateListingFee}
          disabled={
            listingFeeUpdating ||
            validateFee(newListingFee) ||
            (Number.isFinite(Number(newListingFee)) &&
              parseUnits(newListingFee || "0", 18) ===
                parseUnits(currentListingFee, 18))
          }
        >
          {listingFeeUpdating
            ? "Updating..."
            : listingFeeStatus === StatusType.Success
              ? "Updated!"
              : "Update Listing Fee"}
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
          Current fixed fee: {currentListingFee} PHX
        </Typography>
      </Box>
      {listingFeeStatus === StatusType.Pending && (
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
      {listingFeeStatus === StatusType.Success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Fixed listing fee updated. Transaction: {listingFeeTransactionHash}
        </Alert>
      )}
      {listingFeeError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {listingFeeError}
        </Alert>
      )}
    </Card>
  );
};

export default UpdateListingFee;
