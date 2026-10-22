import { Box, Card, Chip, Typography } from "@mui/material";
import type { WalletActivity } from "@/types";

interface AccountTransactionsProps {
  transactions: WalletActivity[];
  loading: boolean;
  error: string;
  onSelect: (productId: string) => void;
}

const AccountTransactions: React.FC<AccountTransactionsProps> = ({
  transactions,
  loading,
  error,
  onSelect,
}) => (
  <>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        flexWrap: "wrap",
        gap: 1,
        mb: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Recent Transactions
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Latest 10 Sepolia blocks
      </Typography>
    </Box>
    <Card>
      {transactions.map((transaction, index) => (
        <Box
          key={transaction.id}
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: index < transactions.length - 1 ? 1 : 0,
            borderColor: "divider",
            cursor: "pointer",
            "&:hover": { bgcolor: "action.hover" },
          }}
          onClick={() => onSelect(transaction.productId)}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {transaction.type === "listing"
                ? "Listed"
                : transaction.type === "purchase"
                  ? "Purchased"
                  : transaction.type === "sale"
                    ? "Sold"
                    : "Transferred"}{" "}
              {transaction.productName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Block {transaction.blockNumber}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {transaction.value === undefined
                ? ""
                : `${transaction.value} PHX`}
            </Typography>
            <Chip
              label="Confirmed"
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
      {!loading && !error && transactions.length === 0 && (
        <Typography color="text.secondary" sx={{ p: 2 }}>
          No recent on-chain activity in the latest 10 blocks.
        </Typography>
      )}
    </Card>
  </>
);

export default AccountTransactions;
