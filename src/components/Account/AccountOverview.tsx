import { Box, Button, Card, Chip, Typography } from "@mui/material";
import { History, Network, Package, PlusCircle } from "lucide-react";
import type { balanceType } from "@/types";

interface AccountOverviewProps {
  address: string | null;
  network: string | null;
  balances: balanceType | null;
  onCreateListing: () => void;
  onMyProducts: () => void;
  onTransactions: () => void;
}

const AccountOverview: React.FC<AccountOverviewProps> = ({
  address,
  network,
  balances,
  onCreateListing,
  onMyProducts,
  onTransactions,
}) => (
  <>
    <Card sx={{ mb: 4, p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ color: "white", fontWeight: 700 }}>
            {address?.slice(2, 4).toUpperCase()}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Typography
            variant="h6"
            sx={{ fontFamily: "'Space Grotesk', sans-serif", mb: 0.5 }}
          >
            My Account
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "monospace",
              color: "text.secondary",
              wordBreak: "break-all",
            }}
          >
            {address}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            icon={<Network size={14} />}
            label={network}
            variant="outlined"
            size="small"
          />
          <Chip label="Connected" color="success" size="small" />
        </Box>
      </Box>
    </Card>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 2,
        mb: 4,
      }}
    >
      <Card sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          PHX Balance
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          {balances
            ? `${balances.phx.toLocaleString(undefined, { maximumFractionDigits: 2 })} PHX`
            : "-- PHX"}
        </Typography>
      </Card>
      <Card sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Sepolia ETH Balance
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {balances
            ? `${balances.eth.toLocaleString(undefined, { maximumFractionDigits: 4 })} ETH`
            : "-- ETH"}
        </Typography>
      </Card>
    </Box>

    <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
      <Button
        variant="contained"
        startIcon={<PlusCircle size={16} />}
        onClick={onCreateListing}
      >
        Create Listing
      </Button>
      <Button
        variant="outlined"
        startIcon={<Package size={16} />}
        onClick={onMyProducts}
      >
        My Products
      </Button>
      <Button
        variant="outlined"
        startIcon={<History size={16} />}
        onClick={onTransactions}
      >
        Transactions
      </Button>
    </Box>
  </>
);

export default AccountOverview;
