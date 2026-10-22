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
import type { Product, statusType } from "@/types";
import { buyProduct, getProductDetails } from "@/services/productService";
import { errorHandler } from "@/utils";
import ProductOverview from "@/components/ProductDetails/ProductOverview";
import PurchaseDialog from "@/components/ProductDetails/PurchaseDialog";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { connected, address, connect, getSigner } = useWallet();
  const [product, setProduct] = useState<Product | null>(null);
  const [platformFeeBps, setPlatformFeeBps] = useState(0);
  const [listedPrice, setListedPrice] = useState("0");
  const [platformFee, setPlatformFee] = useState("0");
  const [total, setTotal] = useState("0");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadVersion, setReloadVersion] = useState(0);
  const [buyDialog, setBuyDialog] = useState(false);
  const [txStatus, setTxStatus] = useState<statusType>("idle");
  const [txError, setTxError] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

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

  const handlePurchase = async () => {
    if (!product) return;
    if (!connected) {
      await connect();

      return;
    }

    setTxStatus("pending");
    setTxError("");
    setTransactionHash("");
    try {
      const signer = await getSigner();
      const hash = await buyProduct(product.id, signer);
      setTransactionHash(hash);
      setTxStatus("success");
      setReloadVersion((version) => version + 1);
    } catch (error) {
      setTxError(errorHandler(error, "Purchase failed."));
      setTxStatus("error");
    }
  };

  const closePurchaseDialog = () => {
    setBuyDialog(false);
    setTxStatus("idle");
    setTxError("");
  };

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
        onPurchase={() => setBuyDialog(true)}
      />
      <PurchaseDialog
        open={buyDialog}
        product={product}
        listedPrice={listedPrice}
        platformFee={platformFee}
        platformFeeBps={platformFeeBps}
        total={total}
        connected={connected}
        status={txStatus}
        error={txError}
        transactionHash={transactionHash}
        onClose={closePurchaseDialog}
        onPurchase={() => void handlePurchase()}
      />
    </Box>
  );
};

export default ProductDetailsPage;
