import { Product, ProductStatus } from "@/types";
import { Alert, Box, Button, Chip, Typography } from "@mui/material";
import { Shield, ShoppingCart } from "lucide-react";
import React from "react";

interface ProductActionProps {
  product: Product;
  isOwner: boolean;
  onPurchase: () => void;
}

const ProductAction: React.FC<ProductActionProps> = ({
  product,
  isOwner,
  onPurchase,
}) => {
  return (
    <>
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
          color={
            product.status === ProductStatus.Active ? "success" : "default"
          }
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
        disabled={product.status !== ProductStatus.Active || isOwner}
        sx={{ mb: 2 }}
      >
        {product.status === ProductStatus.Active ? "Purchase" : "Not Available"}
      </Button>
    </>
  );
};

export default ProductAction;
