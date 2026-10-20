import React, { useEffect, useState } from "react";
import { parseUnits } from "ethers";
import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  Alert,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  DollarSign,
  Wallet,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useWallet } from "../context/WalletContext";
import {
  getMarketplaceAdminData,
  updateFixedListingFee,
  updateMarketplaceFee,
  withdrawMarketplaceFees,
} from "@/services/marketplaceAdminService";
import type { AdminActivity, MarketplaceAdminData } from "@/types";

const AdminPage: React.FC = () => {
  const { connected, address, connect, connecting, getSigner, network } =
    useWallet();
  const [newListingFee, setNewListingFee] = useState("25");
  const [newFee, setNewFee] = useState("5");
  const [adminData, setAdminData] = useState<MarketplaceAdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadIndex, setReloadIndex] = useState(0);
  const [feeUpdating, setFeeUpdating] = useState(false);
  const [listingFeeUpdating, setListingFeeUpdating] = useState(false);
  const [listingFeeStatus, setListingFeeStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [feeStatus, setFeeStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [feeError, setFeeError] = useState("");
  const [listingFeeError, setListingFeeError] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [feeTransactionHash, setFeeTransactionHash] = useState("");
  const [listingFeeTransactionHash, setListingFeeTransactionHash] =
    useState("");
  const [withdrawTransactionHash, setWithdrawTransactionHash] = useState("");

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
          setNewListingFee(data.fixedListingFee);
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
  }, [connected, address, reloadIndex]);

  const ownerAddress = adminData?.owner ?? "";
  const isOwner =
    connected &&
    Boolean(address && ownerAddress) &&
    address!.toLowerCase() === ownerAddress.toLowerCase();
  const currentFee = adminData ? adminData.platformFeeBps / 100 : 0;
  const currentListingFee = adminData?.fixedListingFee ?? "0";
  const maxFee = adminData ? adminData.maxFeeBps / 100 : 10;
  const withdrawableBalance = adminData?.pendingPlatformFees ?? 0;
  const recentTx: AdminActivity[] = adminData?.activity ?? [];

  const handleUpdateListingFee = async () => {
    if (!adminData || !/^\d+(\.\d{1,18})?$/.test(newListingFee.trim())) {
      setListingFeeError("Enter a valid PHX amount with up to 18 decimals.");
      setListingFeeStatus("error");

      return;
    }

    const fee = parseUnits(newListingFee.trim(), 18);
    if (fee === parseUnits(currentListingFee, 18)) {
      return;
    }

    setListingFeeUpdating(true);
    setListingFeeStatus("pending");
    setListingFeeError("");
    setListingFeeTransactionHash("");
    try {
      const signer = await getSigner();
      const hash = await updateFixedListingFee(fee, signer);
      setListingFeeTransactionHash(hash);
      setListingFeeStatus("success");
      setReloadIndex((index) => index + 1);
    } catch (error) {
      setListingFeeError(
        error instanceof Error
          ? error.message
          : "Fixed listing fee update failed.",
      );
      setListingFeeStatus("error");
    } finally {
      setListingFeeUpdating(false);
    }
  };

  const handleUpdateFee = async () => {
    if (!adminData) return;
    const fee = Number(newFee);
    if (!Number.isFinite(fee) || fee < 0 || fee > maxFee) {
      setFeeError(`Enter a fee between 0 and ${maxFee}%.`);
      setFeeStatus("error");
      
return;
    }

    setFeeUpdating(true);
    setFeeStatus("pending");
    setFeeError("");
    setFeeTransactionHash("");
    try {
      const signer = await getSigner();
      const hash = await updateMarketplaceFee(parseUnits(newFee, 2), signer);
      setFeeTransactionHash(hash);
      setFeeStatus("success");
      setReloadIndex((index) => index + 1);
    } catch (error) {
      setFeeError(
        error instanceof Error ? error.message : "Platform fee update failed.",
      );
      setFeeStatus("error");
    } finally {
      setFeeUpdating(false);
    }
  };

  const handleWithdraw = async () => {
    if (withdrawableBalance <= 0) return;
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
        <Typography
          variant="h5"
          sx={{ fontFamily: "'Space Grotesk', sans-serif", mb: 1 }}
        >
          Admin Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Connect your wallet to access admin controls.
        </Typography>
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
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (loadError || !adminData) {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => setReloadIndex((index) => index + 1)}
          >
            Retry
          </Button>
        }
      >
        {loadError || "Marketplace admin data is unavailable."}
      </Alert>
    );
  }

  if (!isOwner) {
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
            Your connected wallet is not the marketplace owner. Admin controls
            are enforced by the smart contract — only the contract owner can
            access these settings.
          </Typography>
          <Alert
            severity="warning"
            sx={{ mt: 3, maxWidth: 500, mx: "auto", textAlign: "left" }}
          >
            Connected: {address?.slice(0, 10)}...{address?.slice(-8)}
            <br />
            Owner: **********...********
          </Alert>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography
          variant="h3"
          sx={{ fontFamily: "'Space Grotesk', sans-serif", mb: 1 }}
        >
          Admin Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage marketplace configuration. All changes require on-chain
          transactions.
        </Typography>

        {/* Overview Cards */}
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
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Shield size={16} color="#0EA5E9" />
              <Typography variant="caption" color="text.secondary">
                Owner
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                wordBreak: "break-all",
              }}
            >
              {address?.slice(0, 12)}...{address?.slice(-8)}
            </Typography>
          </Card>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <DollarSign size={16} color="#0EA5E9" />
              <Typography variant="caption" color="text.secondary">
                Buyer Platform Fee
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {currentFee}%
            </Typography>
          </Card>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Wallet size={16} color="#0EA5E9" />
              <Typography variant="caption" color="text.secondary">
                Withdrawable
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {withdrawableBalance.toLocaleString()} PHX
            </Typography>
          </Card>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <TrendingUp size={16} color="#0EA5E9" />
              <Typography variant="caption" color="text.secondary">
                Network
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {network || "Ethereum Sepolia"}
            </Typography>
          </Card>
        </Box>

        {/* Update Fixed Listing Fee */}
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
            Sellers pay this fixed PHX fee once when creating a product. It does
            not change with the product price. Buyers pay the percentage
            platform fee separately when purchasing.
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
                setListingFeeStatus("idle");
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
                !/^\d+(\.\d{1,18})?$/.test(newListingFee.trim()) ||
                (Number.isFinite(Number(newListingFee)) &&
                  parseUnits(newListingFee || "0", 18) ===
                    parseUnits(currentListingFee, 18))
              }
            >
              {listingFeeUpdating
                ? "Updating..."
                : listingFeeStatus === "success"
                  ? "Updated!"
                  : "Update Listing Fee"}
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
              Current fixed fee: {currentListingFee} PHX
            </Typography>
          </Box>
          {listingFeeStatus === "pending" && (
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
          {listingFeeStatus === "success" && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Fixed listing fee updated. Transaction:{" "}
              {listingFeeTransactionHash}
            </Alert>
          )}
          {listingFeeError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {listingFeeError}
            </Alert>
          )}
        </Card>

        {/* Update Buyer Platform Fee */}
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
            <DollarSign size={20} /> Update Buyer Platform Fee
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Buyers pay this percentage in addition to the listed price;
            sellers receive the full listed price. Current fee: {currentFee}%.
            Allowed range: 0-{maxFee}%. Updating requires a wallet transaction
            and gas fees.
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
              onChange={(e) => {
                setNewFee(e.target.value);
                setFeeStatus("idle");
                setFeeError("");
              }}
              size="small"
              sx={{ width: 150 }}
              slotProps={{ htmlInput: { min: 0, max: maxFee, step: 0.01 } }}
            />
            <Button
              variant="contained"
              onClick={handleUpdateFee}
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
                : feeStatus === "success"
                  ? "Updated!"
                  : "Update Fee"}
            </Button>
          </Box>
          {feeStatus === "pending" && (
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
          {feeStatus === "success" && (
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

        {/* Withdrawal */}
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
            <Wallet size={20} /> Withdraw Platform Fees
          </Typography>
          <Table size="small" sx={{ mb: 2 }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ color: "text.secondary", border: 0 }}>
                  Withdrawable Balance
                </TableCell>
                <TableCell sx={{ border: 0, fontWeight: 600 }}>
                  {withdrawableBalance.toLocaleString()} PHX
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
            onClick={handleWithdraw}
            disabled={withdrawing || withdrawableBalance === 0}
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

        {/* Recent Transactions */}
        <Card sx={{ p: 3 }}>
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
            <Clock size={20} /> Recent Marketplace Activity
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Activity from the latest 10 Sepolia blocks
          </Typography>
          {recentTx.map((tx, i) => (
            <Box
              key={tx.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.5,
                borderBottom: i < recentTx.length - 1 ? 1 : 0,
                borderColor: "divider",
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {tx.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Block {tx.blockNumber} · {tx.event}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {tx.amount !== undefined && (
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {tx.amount.toLocaleString()} PHX
                  </Typography>
                )}
                <Chip
                  component="a"
                  clickable
                  target="_blank"
                  rel="noreferrer"
                  href={`https://sepolia.etherscan.io/tx/${tx.transactionHash}`}
                  label="View tx"
                  size="small"
                  sx={{
                    fontSize: "0.6rem",
                    height: 20,
                    bgcolor: "rgba(16, 185, 129, 0.1)",
                    color: "#10B981",
                  }}
                />
              </Box>
            </Box>
          ))}
          {recentTx.length === 0 && (
            <Typography color="text.secondary" sx={{ py: 2 }}>
              No marketplace activity found in the latest 10 blocks.
            </Typography>
          )}
        </Card>

        {/* <Alert severity="warning" sx={{ mt: 3 }}>
          Admin controls are enforced by the smart contract. Frontend
          authorization checks are supplementary — the contract's access control
          is authoritative.
        </Alert> */}
      </motion.div>
    </Box>
  );
};

export default AdminPage;
