import { Box, Card, Chip, Typography } from "@mui/material";
import { Clock } from "lucide-react";
import type { AdminActivity as AdminActivityItem } from "@/types";

const AdminActivity: React.FC<{ activity: AdminActivityItem[] }> = ({
  activity,
}) => (
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
    {activity.map((item, index) => (
      <Box
        key={item.id}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1.5,
          borderBottom: index < activity.length - 1 ? 1 : 0,
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {item.description}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Block {item.blockNumber} · {item.event}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {item.amount !== undefined && (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {item.amount.toLocaleString()} PHX
            </Typography>
          )}
          <Chip
            component="a"
            clickable
            target="_blank"
            rel="noreferrer"
            href={`https://sepolia.etherscan.io/tx/${item.transactionHash}`}
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
    {activity.length === 0 && (
      <Typography color="text.secondary" sx={{ py: 2 }}>
        No marketplace activity found in the latest 10 blocks.
      </Typography>
    )}
  </Card>
);

export default AdminActivity;
