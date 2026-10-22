import { Product } from "@/types";
import { Box, Card, Divider, Typography } from "@mui/material";
import React from "react";

interface ProductPriceProps {
  product: Product;
  listedPrice: string;
  platformFee: string;
  platformFeeBps: number;
  total: string;
}

const ProductPrice: React.FC<ProductPriceProps> = ({
  product,
  listedPrice,
  platformFee,
  platformFeeBps,
  total,
}) => {
  return (
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
  );
};

export default ProductPrice;
