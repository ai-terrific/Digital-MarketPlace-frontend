import { useThemeMode } from "@/context/ThemeContext";
import { Product } from "@/types";
import { Box, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatusChip from "../core/StatusChip";
import { ProductCard, ProductDescription, ProductName } from "./styled";

const ProductItem = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const { mode } = useThemeMode();

  return (
    <ProductCard onClick={() => navigate(`/product/${product.id}`)}>
      <Box
        sx={{
          height: 180,
          borderBottom: 1,
          borderColor: "divider",
          position: "relative",
          overflow: "hidden",
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
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s",
            ".MuiCard-root:hover &": { transform: "scale(1.05)" },
          }}
        />
        <StatusChip status={product.status} />
      </Box>
      <CardContent
        sx={{
          p: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ProductName variant="subtitle2">{product.name}</ProductName>
        <ProductDescription variant="body2" color="text.secondary">
          {product.description}
        </ProductDescription>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "auto",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            {product.price} {product.currency}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {product.seller}
          </Typography>
        </Box>
      </CardContent>
    </ProductCard>
  );
};

export default ProductItem;
