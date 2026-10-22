import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import type { Product } from "@/types";

interface AccountProductListProps {
  title: string;
  products: Product[];
  emptyMessage: string;
  loading: boolean;
  error: string;
  onSelect: (id: string) => void;
  showAcquiredDate?: boolean;
}

const AccountProductList: React.FC<AccountProductListProps> = ({
  title,
  products,
  emptyMessage,
  loading,
  error,
  onSelect,
  showAcquiredDate = false,
}) => (
  <>
    <Typography
      variant="h5"
      sx={{ fontFamily: "'Space Grotesk', sans-serif", mb: 2 }}
    >
      {title}
    </Typography>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
        gap: 2,
        mb: 4,
      }}
    >
      {!loading && !error && products.length === 0 && (
        <Typography color="text.secondary" sx={{ gridColumn: "1 / -1" }}>
          {emptyMessage}
        </Typography>
      )}
      {products.map((product) => (
        <Card
          key={product.id}
          sx={{
            cursor: "pointer",
            transition: "transform 0.2s",
            "&:hover": { transform: "translateY(-2px)" },
            overflow: "hidden",
          }}
          onClick={() => onSelect(product.id)}
        >
          <Box
            sx={{
              height: 120,
              overflow: "hidden",
              borderBottom: 1,
              borderColor: "divider",
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
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {product.name}
            </Typography>
            {showAcquiredDate ? (
              <Typography variant="caption" color="text.secondary">
                Acquired{" "}
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString()
                  : "Date unavailable"}
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color="primary.main"
                  sx={{ fontWeight: 700 }}
                >
                  {product.price} {product.currency}
                </Typography>
                <Chip
                  label={product.status}
                  size="small"
                  color={product.status === "Active" ? "success" : "default"}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  </>
);

export default AccountProductList;
