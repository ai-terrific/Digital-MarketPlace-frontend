import React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AlertCircle, Sparkles } from "lucide-react";
import type { CreateProductFormData, StatusType } from "@/types";
import ProductImageField from "./ProductImageField";
import TxPending from "./TxPending";

interface CreateProductFormProps {
  form: CreateProductFormData;
  setForm: React.Dispatch<React.SetStateAction<CreateProductFormData>>;
  errors: Record<string, string>;
  imagePreview: string | null;
  imageURI: string | null;
  uploadingImage: boolean;
  submitting: boolean;
  connected: boolean;
  submitStatus: StatusType;
  submitError: string;
  transactionHash: string;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({
  form,
  setForm,
  errors,
  imagePreview,
  imageURI,
  uploadingImage,
  submitting,
  connected,
  submitStatus,
  submitError,
  transactionHash,
  onImageChange,
  onRemoveImage,
  onSubmit,
  onCancel,
}) => (
  <Card sx={{ p: { xs: 2, md: 4 } }}>
    <CardContent component="form" sx={{ p: 0 }} onSubmit={onSubmit}>
      <TextField
        fullWidth
        label="Product Name"
        placeholder="e.g., PHX Vision 8K Display"
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
        error={!!errors.name}
        helperText={errors.name}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Description"
        placeholder="Describe your product in detail..."
        value={form.description}
        onChange={(event) =>
          setForm({ ...form, description: event.target.value })
        }
        error={!!errors.description}
        helperText={errors.description}
        sx={{ mb: 3 }}
      />
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Box sx={{ flex: "1 1 100%", display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            label="Price"
            type="number"
            placeholder="0.00"
            value={form.price}
            onChange={(event) =>
              setForm({ ...form, price: event.target.value })
            }
            error={!!errors.price}
            helperText={errors.price}
          />
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={form.currency}
              label="Currency"
              onChange={(event) =>
                setForm({
                  ...form,
                  currency: event.target.value,
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
      <ProductImageField
        imagePreview={imagePreview}
        imageURI={imageURI}
        uploadingImage={uploadingImage}
        error={errors.image}
        onChange={onImageChange}
        onRemove={onRemoveImage}
      />
      <Alert icon={<AlertCircle size={16} />} severity="info" sx={{ mb: 3 }}>
        Publishing requires an on-chain transaction and gas. The marketplace
        stores the seller, name, description, PHX price, and IPFS image URI.
      </Alert>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          type="button"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          disabled={submitting || uploadingImage || submitStatus === "success"}
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
      {submitStatus === "pending" && <TxPending />}
    </CardContent>
  </Card>
);

export default CreateProductForm;
