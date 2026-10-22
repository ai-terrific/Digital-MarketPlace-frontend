import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import { ArrowRightLeft, Edit, Eye, Power } from "lucide-react";
import type { Product } from "@/types";

interface ManagedProductCardProps {
  product: Product;
  owned: boolean;
  actionBusy: boolean;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onTransfer: (product: Product) => void;
  onActivate: (product: Product) => void;
}

const ManagedProductCard: React.FC<ManagedProductCardProps> = ({
  product,
  owned,
  actionBusy,
  onView,
  onEdit,
  onTransfer,
  onActivate,
}) => (
  <Card sx={{ overflow: "hidden" }}>
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: 120,
          minHeight: 120,
          flexShrink: 0,
          overflow: "hidden",
          bgcolor: "rgba(14, 165, 233, 0.03)",
        }}
      >
        <Box
          component="img"
          src={product.image}
          alt={product.name}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      <CardContent sx={{ flex: 1, p: 2 }}>
        {owned ? (
          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Acquired:{" "}
              {product.createdAt
                ? new Date(product.createdAt).toLocaleDateString()
                : "On-chain"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Price: {product.price} {product.currency}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.price} {product.currency}
              </Typography>
            </Box>
            <Chip
              label={product.status}
              size="small"
              color={product.status === "Active" ? "success" : "default"}
            />
          </Box>
        )}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            size="small"
            startIcon={<Eye size={14} />}
            onClick={() => onView(product)}
          >
            View
          </Button>
          {owned ? (
            <>
              <Button
                size="small"
                startIcon={<ArrowRightLeft size={14} />}
                variant="outlined"
                onClick={() => onTransfer(product)}
              >
                Transfer
              </Button>
              <Button
                size="small"
                startIcon={<Power size={14} />}
                variant="outlined"
                disabled={actionBusy}
                onClick={() => onActivate(product)}
              >
                Activate
              </Button>
            </>
          ) : (
            <Button
              size="small"
              startIcon={<Edit size={14} />}
              variant="outlined"
              onClick={() => onEdit(product)}
            >
              Edit
            </Button>
          )}
        </Box>
      </CardContent>
    </Box>
  </Card>
);

export default ManagedProductCard;
