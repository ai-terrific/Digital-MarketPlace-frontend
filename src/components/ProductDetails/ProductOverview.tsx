import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { Shield, ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { PageDescription, PageTitle } from "@/components/core/Common";
import { useThemeMode } from "@/ThemeContext";

interface ProductOverviewProps {
  product: Product;
  address: string | null;
  listedPrice: string;
  platformFee: string;
  platformFeeBps: number;
  total: string;
  onPurchase: () => void;
}

const ProductOverview: React.FC<ProductOverviewProps> = ({
  product,
  address,
  listedPrice,
  platformFee,
  platformFeeBps,
  total,
  onPurchase,
}) => {
  const { mode } = useThemeMode();
  const isOwner = product.owner?.toLowerCase() === address?.toLowerCase();

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 55%" }, minWidth: 0 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Box
            sx={{
              height: { xs: 280, md: 420 },
              borderRadius: 3,
              overflow: "hidden",
              border: 1,
              borderColor: "divider",
              bgcolor:
                mode === "dark"
                  ? "rgba(14, 165, 233, 0.05)"
                  : "rgba(14, 165, 233, 0.02)",
            }}
          >
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        </motion.div>
      </Box>

      <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 40%" }, minWidth: 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PageTitle title={product.name} />
          <PageDescription description={product.description} />
          <Card sx={{ mb: 3, p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Price
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {listedPrice} {product.currency}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Buyer Platform Fee ({(platformFeeBps / 100).toFixed(2)}%)
              </Typography>
              <Typography variant="body2">
                {platformFee} {product.currency}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              The seller receives the full listed price of {listedPrice}{" "}
              {product.currency}.
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Total
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                {total} {product.currency}
              </Typography>
            </Box>
          </Card>
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
            <Shield size={16} color="#0EA5E9" />
            <Typography variant="body2" color="text.secondary">
              Seller:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {product.seller}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            <Chip
              label={`Status: ${product.status}`}
              color={product.status === "Active" ? "success" : "default"}
              size="small"
            />
            <Chip
              label={`Currency: ${product.currency}`}
              size="small"
              variant="outlined"
            />
          </Box>
          {isOwner && (
            <Alert severity="info" sx={{ mb: 2 }}>
              You own this product and cannot purchase it.
            </Alert>
          )}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={onPurchase}
            startIcon={<ShoppingCart size={18} />}
            disabled={product.status !== "Active" || isOwner}
            sx={{ mb: 2 }}
          >
            {product.status === "Active" ? "Purchase" : "Not Available"}
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};

export default ProductOverview;
