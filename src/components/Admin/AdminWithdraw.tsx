import {
  Alert,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Wallet } from "lucide-react";
import type { statusType } from "@/types";
import TxPending from "@/components/CreateProduct/TxPending";

interface AdminWithdrawProps {
  balance: number;
  ownerAddress: string;
  withdrawing: boolean;
  status: statusType;
  error: string;
  transactionHash: string;
  onWithdraw: () => void;
}

const AdminWithdraw: React.FC<AdminWithdrawProps> = ({
  balance,
  ownerAddress,
  withdrawing,
  status,
  error,
  transactionHash,
  onWithdraw,
}) => (
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
      onClick={onWithdraw}
      disabled={withdrawing || balance === 0}
    >
      {withdrawing
        ? "Withdrawing..."
        : status === "success"
          ? "Withdrawn!"
          : "Withdraw All"}
    </Button>
    {status === "pending" && <TxPending />}
    {status === "success" && (
      <Alert severity="success" sx={{ mt: 2 }}>
        Platform fees withdrawn successfully. Transaction: {transactionHash}
      </Alert>
    )}
    {error && (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    )}
  </Card>
);

export default AdminWithdraw;
