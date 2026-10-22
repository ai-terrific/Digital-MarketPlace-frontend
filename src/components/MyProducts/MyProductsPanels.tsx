import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import type { Product, ProductActivity } from "@/types";
import ManagedProductCard from "./ManagedProductCard";
import ProductActivityGrid from "./ProductActivityGrid";

interface MyProductsPanelsProps {
  tab: number;
  onTabChange: (tab: number) => void;
  myListings: Product[];
  ownedProducts: Product[];
  soldProducts: ProductActivity[];
  transferredProducts: ProductActivity[];
  loading: boolean;
  loadError: string;
  actionError: string;
  hasOpenDialog: boolean;
  actionBusy: boolean;
  onRetry: () => void;
  onView: (productId: string) => void;
  onEdit: (product: Product) => void;
  onTransfer: (product: Product) => void;
  onActivate: (product: Product) => void;
}

const MyProductsPanels: React.FC<MyProductsPanelsProps> = ({
  tab,
  onTabChange,
  myListings,
  ownedProducts,
  soldProducts,
  transferredProducts,
  loading,
  loadError,
  actionError,
  hasOpenDialog,
  actionBusy,
  onRetry,
  onView,
  onEdit,
  onTransfer,
  onActivate,
}) => {
  const products = tab === 0 ? myListings : ownedProducts;

  return (
    <>
      <Tabs
        value={tab}
        onChange={(_, value) => onTabChange(value)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        {["My Listings", "Owned Products", "Sold", "Transferred"].map(
          (label, index) => (
            <Tab
              key={label}
              label={label}
              sx={{ textTransform: "none", fontWeight: 500 }}
              value={index}
            />
          ),
        )}
      </Tabs>
      {tab >= 2 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 2 }}
        >
          Activity is limited to the latest 10 Sepolia blocks by the RPC
          provider.
        </Typography>
      )}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      )}
      {loadError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          }
          sx={{ mb: 2 }}
        >
          {loadError}
        </Alert>
      )}
      {actionError && !hasOpenDialog && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionError}
        </Alert>
      )}
      {tab < 2 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {products.map((product) => (
            <ManagedProductCard
              key={product.id}
              product={product}
              owned={tab === 1}
              actionBusy={actionBusy}
              onView={(product) => onView(product.id)}
              onEdit={onEdit}
              onTransfer={onTransfer}
              onActivate={onActivate}
            />
          ))}
          {!loading && !loadError && products.length === 0 && (
            <Typography
              color="text.secondary"
              sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}
            >
              {tab === 0
                ? "You have no active listings."
                : "You do not own any inactive products."}
            </Typography>
          )}
        </Box>
      ) : (
        <ProductActivityGrid
          activities={tab === 2 ? soldProducts : transferredProducts}
          type={tab === 2 ? "sold" : "transferred"}
          onView={onView}
        />
      )}
    </>
  );
};

export default MyProductsPanels;
