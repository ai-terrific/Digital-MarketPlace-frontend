import { useThemeMode } from "@/ThemeContext";
import { Product } from "@/types";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatusChip from "./core/StatusChip";

const ProductItem = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const { mode } = useThemeMode();

  return (
    <Card
      sx={{
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 40px rgba(14, 165, 233, 0.12)",
        },
      }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
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
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.3 }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: "0.8rem",
            mb: 2,
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.description}
        </Typography>
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
    </Card>
  );
};

export default ProductItem;
