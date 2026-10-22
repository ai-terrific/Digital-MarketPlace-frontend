import type { Product, ProductActivity } from "@/types";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusChip from "../Core/StatusChip";
import MyProductsAction from "./MyProductsAction";
import OwnedProductsAction from "./OwnedProductsAction";

interface ProductItemProps {
  item: Product | ProductActivity;
  tab: number;
  onProductChange: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  item,
  tab,
  onProductChange,
}) => {
  const navigate = useNavigate();
  const isActivity = "product" in item;
  const product = isActivity ? item.product : item;
  const activity = isActivity ? item : null;

  return (
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
              {activity ? (
                <Typography variant="body2" color="text.secondary">
                  {tab === 2
                    ? `Sold for ${activity.value ?? product.price} PHX`
                    : `Transferred to ${activity.counterparty.slice(0, 6)}...${activity.counterparty.slice(-4)}`}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {product.price} {product.currency}
                </Typography>
              )}
            </Box>
            {activity ? (
              tab === 2 && <Chip label="Sold" size="small" color="info" />
            ) : (
              <StatusChip status={product.status} />
            )}
          </Box>
          {activity ? (
            <Button
              size="small"
              startIcon={<Eye size={14} />}
              onClick={() => navigate(`/product/${product.id}`)}
              sx={tab === 3 ? { mt: 1 } : undefined}
            >
              View Details
            </Button>
          ) : tab === 0 ? (
            <MyProductsAction product={product} onSuccess={onProductChange} />
          ) : tab === 1 ? (
            <OwnedProductsAction
              product={product}
              onSuccess={onProductChange}
            />
          ) : null}
        </CardContent>
      </Box>
    </Card>
  );
};

export default ProductItem;
