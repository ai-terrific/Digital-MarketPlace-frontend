import { Box, Card, Typography } from "@mui/material";
import { DollarSign, Shield, TrendingUp, Wallet } from "lucide-react";

interface AdminStatsProps {
  address: string | null;
  currentFee: number;
  withdrawableBalance: number;
  network: string | null;
}

const AdminStats: React.FC<AdminStatsProps> = ({
  address,
  currentFee,
  withdrawableBalance,
  network,
}) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
      gap: 2,
      mb: 4,
    }}
  >
    {[
      {
        icon: <Shield size={16} color="#0EA5E9" />,
        label: "Owner",
        value: `${address?.slice(0, 12)}...${address?.slice(-8)}`,
      },
      {
        icon: <DollarSign size={16} color="#0EA5E9" />,
        label: "Buyer Platform Fee",
        value: `${currentFee}%`,
      },
      {
        icon: <Wallet size={16} color="#0EA5E9" />,
        label: "Withdrawable",
        value: `${withdrawableBalance.toLocaleString()} PHX`,
      },
      {
        icon: <TrendingUp size={16} color="#0EA5E9" />,
        label: "Network",
        value: network || "Ethereum Sepolia",
      },
    ].map((stat) => (
      <Card key={stat.label} sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          {stat.icon}
          <Typography variant="caption" color="text.secondary">
            {stat.label}
          </Typography>
        </Box>
        <Typography
          variant={
            stat.label === "Owner" || stat.label === "Network" ? "body2" : "h5"
          }
          sx={{
            fontWeight: 700,
            ...(stat.label === "Owner" && {
              fontFamily: "monospace",
              fontSize: "0.75rem",
              wordBreak: "break-all",
            }),
            ...(stat.label === "Buyer Platform Fee" && {
              color: "primary.main",
            }),
          }}
        >
          {stat.value}
        </Typography>
      </Card>
    ))}
  </Box>
);

export default AdminStats;
