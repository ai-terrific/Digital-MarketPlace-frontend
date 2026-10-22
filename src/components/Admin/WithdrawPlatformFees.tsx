import {
  Alert,
  Box,
  Button,
  Card,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Wallet } from "lucide-react";
import React, { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { withdrawMarketplaceFees } from "@/services/marketplaceAdminService";
import type { StatusType } from "@/types";

interface WithdrawPlatformFeesProps {
  balance: number;
  ownerAddress: string;
  setReloadIndex: React.Dispatch<React.SetStateAction<number>>;
}

const WithdrawPlatformFees: React.FC<WithdrawPlatformFeesProps> = ({
  balance,
  ownerAddress,
  setReloadIndex,
}) => {
  const { getSigner } = useWallet();
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState<StatusType>("idle");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawTransactionHash, setWithdrawTransactionHash] = useState("");

  const handleWithdraw = async () => {
    if (balance <= 0) return;
    setWithdrawing(true);
    setWithdrawStatus("pending");
    setWithdrawError("");
    setWithdrawTransactionHash("");
    try {
      const signer = await getSigner();
      const hash = await withdrawMarketplaceFees(signer);
      setWithdrawTransactionHash(hash);
      setWithdrawStatus("success");
      setReloadIndex((index) => index + 1);
    } catch (error) {
      setWithdrawError(
        error instanceof Error
          ? error.message
          : "Platform fee withdrawal failed.",
      );
      setWithdrawStatus("error");
    } finally {
      setWithdrawing(false);
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
        <Wallet size={20} /> Withdraw Platform Fees
      </Typography>
      <Table size="small" sx={{ mb: 2 }}>
        <TableBody>
          <TableRow>
            <TableCell sx={{ color: "text.secondary", border: 0 }}>
              Withdrawable Balance
            </TableCell>
            <TableCell sx={{ border: 0, fontWeight: 600 }}>
              {balance.toLocaleString()} PHX
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ color: "text.secondary", border: 0 }}>
              Destination
            </TableCell>
            <TableCell
              sx={{
                border: 0,
                fontFamily: "monospace",
                fontSize: "0.8rem",
              }}
            >
              {ownerAddress}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button
        variant="contained"
        onClick={() => void handleWithdraw()}
        disabled={withdrawing || balance === 0}
      >
        {withdrawing
          ? "Withdrawing..."
          : withdrawStatus === "success"
            ? "Withdrawn!"
            : "Withdraw All"}
      </Button>
      {withdrawStatus === "pending" && (
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
      {withdrawStatus === "success" && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Platform fees withdrawn successfully. Transaction:{" "}
          {withdrawTransactionHash}
        </Alert>
      )}
      {withdrawError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {withdrawError}
        </Alert>
      )}
    </Card>
  );
};

export default WithdrawPlatformFees;
