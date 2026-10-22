import { Box, Button, Chip, Typography } from "@mui/material";
import { Upload, X } from "lucide-react";
import { useThemeMode } from "@/context/ThemeContext";
import { PRODUCT_IMAGE_ACCEPT } from "@/utils";

interface ProductImageFieldProps {
  imagePreview: string | null;
  imageURI: string | null;
  uploadingImage: boolean;
  error: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

const ProductImageField: React.FC<ProductImageFieldProps> = ({
  imagePreview,
  imageURI,
  uploadingImage,
  error,
  onChange,
  onRemove,
}) => {
  const { mode } = useThemeMode();

  return (
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
            type="button"
            aria-label="Remove product image"
            onClick={onRemove}
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
            borderColor: error ? "error.main" : "divider",
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
          <Box>
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Choose an image to upload
            </Typography>
            <Typography variant="caption" color="text.secondary">
              PNG, JPEG, or WebP (max 5MB)
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<Upload size={16} />}
              sx={{ mt: 1.5 }}
            >
              Browse files
              <input
                type="file"
                accept={PRODUCT_IMAGE_ACCEPT}
                onChange={onChange}
                style={{ display: "none" }}
              />
            </Button>
          </Box>
        </Box>
      )}
      {error && (
        <Typography
          role="alert"
          variant="caption"
          color="error"
          sx={{ mt: 0.5 }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ProductImageField;
