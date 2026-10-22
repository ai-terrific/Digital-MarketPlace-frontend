import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import ProductItem from "@/components/MarketPlace/ProductItem";
import NoProducts from "./NoProducts";

interface MarketplaceResultsProps {
  loading: boolean;
  error: string;
  products: Product[];
  search: string;
  onClearSearch: () => void;
  onRetry: () => void;
}

const MarketplaceResults: React.FC<MarketplaceResultsProps> = ({
  loading,
  error,
  products,
  search,
  onClearSearch,
  onRetry,
}) => (
  <>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {products.length} product{products.length !== 1 ? "s" : ""} shown on
        this page
      </Typography>
      {search && (
        <Button size="small" onClick={onClearSearch}>
          Clear filters
        </Button>
      )}
    </Box>
    {loading ? (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={28} />
      </Box>
    ) : error ? (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    ) : products.length === 0 ? (
      <NoProducts />
    ) : (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductItem product={product} />
          </motion.div>
        ))}
      </Box>
    )}
  </>
);

export default MarketplaceResults;
