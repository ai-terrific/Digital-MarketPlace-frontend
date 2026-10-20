import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { Upload, X, Sparkles, AlertCircle } from "lucide-react";
import { useThemeMode } from "../ThemeContext";
import { useWallet } from "../context/WalletContext";
import {
  getFixedListingFee,
  listProduct,
  uploadProductImage,
} from "@/services/productService";

const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const { connected, address, connect, getSigner } = useWallet();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    currency: "PHX" as "PHX" | "ETH",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageURI, setImageURI] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [fixedListingFee, setFixedListingFee] = useState<string | null>(null);
  const [listingFeeError, setListingFeeError] = useState("");

  useEffect(() => {
    let active = true;
    getFixedListingFee()
      .then((fee) => {
        if (active) setFixedListingFee(fee);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setListingFeeError(
          error instanceof Error
            ? error.message
            : "Could not load the fixed listing fee from the marketplace.",
        );
      });

    return () => {
      active = false;
    };
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Product name is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.price || parseFloat(form.price) <= 0)
      errs.price = "Valid price is required";
    if (!imageURI) errs.image = "Upload a product image to IPFS";
    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "File size must be under 5MB" }));
      e.target.value = "";

      return;
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only PNG, JPEG, or WebP files are accepted",
      }));
      e.target.value = "";

      return;
    }
    setImageURI(null);
    setUploadingImage(true);
    setErrors((prev) => ({ ...prev, image: "" }));
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const uri = await uploadProductImage(file);
      console.log(uri);
      setImageURI(uri);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        image: error instanceof Error ? error.message : "IPFS upload failed.",
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!connected || !address) {
      await connect();

      return;
    }
    setSubmitting(true);
    setSubmitStatus("pending");
    setSubmitError("");
    setTransactionHash("");

    try {
      if (!imageURI) throw new Error("Upload a product image to IPFS first.");
      const product = {
        name: form.name.trim(),
        description: form.description.trim(),
        pricePHX: form.price,
        imageURI,
      };
      const signer = await getSigner();
      const hash = await listProduct(product, signer);
      setTransactionHash(hash);
      setSubmitStatus("success");
    } catch (error) {
      setSubmitStatus("error");
      setSubmitError(
        error instanceof Error ? error.message : "Product listing failed.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography
          variant="h3"
          sx={{ fontFamily: "'Space Grotesk', sans-serif", mb: 1 }}
        >
          Create Listing
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          List a digital product on PHX Marketplace. Creating a product costs a
          fixed listing fee of {fixedListingFee ?? "loading..."} PHX, regardless
          of the product price. Approve the fee in your wallet before confirming
          the listing transaction.
        </Typography>
        {listingFeeError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Could not load the current fixed listing fee: {listingFeeError}
          </Alert>
        )}

        <Card sx={{ p: { xs: 2, md: 4 } }}>
          <CardContent sx={{ p: 0 }}>
            {/* Product Name */}
            <TextField
              fullWidth
              label="Product Name"
              placeholder="e.g., PHX Vision 8K Display"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 3 }}
            />

            {/* Description */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              placeholder="Describe your product in detail..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              error={!!errors.description}
              helperText={errors.description}
              sx={{ mb: 3 }}
            />

            {/* Price and Currency */}
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
              <Box
                sx={{
                  flex: "1 1 100%",
                  display: "flex",
                  gap: 1,
                }}
              >
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  error={!!errors.price}
                  helperText={errors.price}
                />
                <FormControl sx={{ minWidth: 100 }}>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={form.currency}
                    label="Currency"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        currency: e.target.value as "PHX" | "ETH",
                      })
                    }
                  >
                    <MenuItem value="PHX">PHX</MenuItem>
                    <MenuItem value="ETH" disabled>
                      ETH
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Image Upload */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Product Image
              </Typography>
              {imagePreview ? (
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{ width: "100%", height: 200, objectFit: "cover" }}
                  />
                  <Button
                    size="small"
                    onClick={() => {
                      setImagePreview(null);
                      setImageURI(null);
                      setErrors((prev) => ({ ...prev, image: "" }));
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "white",
                      minWidth: "auto",
                      p: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    <X size={16} />
                  </Button>
                  {uploadingImage && (
                    <Chip
                      label="Uploading to IPFS..."
                      size="small"
                      color="info"
                      sx={{ position: "absolute", bottom: 8, left: 8 }}
                    />
                  )}
                  {imageURI && !uploadingImage && (
                    <Chip
                      label="Pinned to IPFS"
                      size="small"
                      color="success"
                      sx={{ position: "absolute", bottom: 8, left: 8 }}
                    />
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    border: 2,
                    borderColor: errors.image ? "error.main" : "divider",
                    borderStyle: "dashed",
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    background:
                      mode === "dark"
                        ? "linear-gradient(135deg, rgba(14, 165, 233, 0.03) 0%, rgba(2, 132, 199, 0.02) 100%)"
                        : "linear-gradient(135deg, rgba(14, 165, 233, 0.02) 0%, rgba(2, 132, 199, 0.01) 100%)",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor:
                        mode === "dark"
                          ? "rgba(14, 165, 233, 0.05)"
                          : "rgba(14, 165, 233, 0.03)",
                    },
                  }}
                >
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    style={{ cursor: "pointer", display: "block" }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: "rgba(14, 165, 233, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 1.5,
                      }}
                    >
                      <Upload size={24} color="#0EA5E9" />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Click to upload or drag and drop
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PNG, JPEG, or WebP (max 5MB)
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5, fontStyle: "italic" }}
                    >
                      The image is uploaded to IPFS when selected.
                    </Typography>
                  </label>
                </Box>
              )}
              {errors.image && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.image}
                </Typography>
              )}
            </Box>

            {/* Info Alert */}
            <Alert
              icon={<AlertCircle size={16} />}
              severity="info"
              sx={{ mb: 3 }}
            >
              Publishing requires an on-chain transaction and gas. The
              marketplace stores the seller, name, description, PHX price, and
              IPFS image URI.
            </Alert>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={
                  submitting || uploadingImage || submitStatus === "success"
                }
                startIcon={<Sparkles size={16} />}
              >
                {!connected
                  ? "Connect Wallet to Publish"
                  : submitting
                    ? "Publishing..."
                    : submitStatus === "success"
                      ? "Published!"
                      : "Publish Listing"}
              </Button>
            </Box>

            {submitStatus === "success" && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Transaction confirmed. The product listing was recorded on the
                marketplace contract.
                {transactionHash && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, overflowWrap: "anywhere" }}
                  >
                    Transaction: {transactionHash}
                  </Typography>
                )}
              </Alert>
            )}
            {submitStatus === "error" && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {submitError}
              </Alert>
            )}
            {submitStatus === "pending" && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Transaction pending... Please confirm in your wallet.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default CreateProductPage;
