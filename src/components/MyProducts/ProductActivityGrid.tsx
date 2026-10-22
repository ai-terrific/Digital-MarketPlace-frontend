import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import { Eye } from "lucide-react";
import type { ProductActivity } from "@/types";

interface ProductActivityGridProps {
  activities: ProductActivity[];
  type: "sold" | "transferred";
  onView: (productId: string) => void;
}

const ProductActivityGrid: React.FC<ProductActivityGridProps> = ({
  activities,
  type,
  onView,
}) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
      gap: 3,
    }}
  >
    {activities.map((activity) => (
      <Card key={activity.transactionHash} sx={{ overflow: "hidden" }}>
        <Box sx={{ display: "flex" }}>
          <Box
            component="img"
            src={activity.product.image}
            alt={activity.product.name}
            sx={{ width: 120, minHeight: 120, objectFit: "cover" }}
          />
          <CardContent sx={{ flex: 1, p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {activity.product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {type === "sold"
                ? `Sold for ${activity.value ?? activity.product.price} PHX`
                : `Transferred to ${activity.counterparty.slice(0, 6)}...${activity.counterparty.slice(-4)}`}
            </Typography>
            {type === "sold" && <Chip label="Sold" size="small" color="info" />}
            <Button
              size="small"
              startIcon={<Eye size={14} />}
              onClick={() => onView(activity.product.id)}
              sx={{ mt: 1 }}
            >
              View Details
            </Button>
          </CardContent>
        </Box>
      </Card>
    ))}
    {activities.length === 0 && (
      <Typography
        color="text.secondary"
        sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}
      >
        {type === "sold"
          ? "No sold products yet"
          : "No transferred products yet"}
      </Typography>
    )}
  </Box>
);

export default ProductActivityGrid;
