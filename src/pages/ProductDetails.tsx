import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useDialog } from "@/context/DialogContext";
import type { Product } from "@/types";
import { getProductDetails } from "@/services/productService";
import { errorHandler } from "@/utils";
import ProductOverview from "@/components/ProductDetails/ProductOverview";
import PurchaseDialog from "@/components/ProductDetails/PurchaseDialog";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { address } = useWallet();
  const { openDialog } = useDialog();
  const [product, setProduct] = useState<Product | null>(null);
  const [platformFeeBps, setPlatformFeeBps] = useState(0);
  const [listedPrice, setListedPrice] = useState("0");
  const [platformFee, setPlatformFee] = useState("0");
  const [total, setTotal] = useState("0");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");

    if (!id) {
      setLoadError("Product ID is missing.");
      setLoading(false);

      return () => {
        active = false;
      };
    }

    getProductDetails(id)
      .then((details) => {
        if (!active) return;
        setProduct(details.product);
        setListedPrice(details.listedPrice);
        setPlatformFee(details.platformFee);
        setTotal(details.total);
        setPlatformFeeBps(details.platformFeeBps);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(
          errorHandler(error, "Could not load this product from Sepolia."),
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, reloadVersion]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box sx={{ maxWidth: 720, mx: "auto", py: 6 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setReloadVersion((version) => version + 1)}
            >
              Retry
            </Button>
          }
        >
          {loadError}
        </Alert>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Back to Marketplace
        </Button>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5">Product not found</Typography>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Back to Marketplace
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowLeft size={16} />}
        onClick={() => navigate("/")}
        sx={{ mb: 3, color: "text.secondary" }}
      >
        Back to Marketplace
      </Button>
      <ProductOverview
        product={product}
        address={address}
        listedPrice={listedPrice}
        platformFee={platformFee}
        platformFeeBps={platformFeeBps}
        total={total}
        onPurchase={() =>
          openDialog({
            title: (
              <Typography sx={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Confirm Purchase
              </Typography>
            ),
            content: (
              <PurchaseDialog
                product={product}
                listedPrice={listedPrice}
                platformFee={platformFee}
                platformFeeBps={platformFeeBps}
                total={total}
                onSuccess={() => setReloadVersion((version) => version + 1)}
              />
            ),
          })
        }
      />
    </Box>
  );
};

export default ProductDetailsPage;
