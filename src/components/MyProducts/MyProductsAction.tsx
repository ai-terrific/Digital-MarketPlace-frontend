import { Box, Button } from "@mui/material";
import { Edit, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDialog } from "@/context/DialogContext";
import type { Product } from "@/types";
import { EditProductDialog } from "./ProductDialogs";

const MyProductsAction: React.FC<{
  product: Product;
  onSuccess: () => void;
}> = ({ product, onSuccess }) => {
  const navigate = useNavigate();
  const { openDialog } = useDialog();

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      <Button
        size="small"
        startIcon={<Eye size={14} />}
        onClick={() => navigate(`/product/${product.id}`)}
      >
        View
      </Button>
      <Button
        size="small"
        startIcon={<Edit size={14} />}
        variant="outlined"
        onClick={() =>
          openDialog({
            title: "Edit Product",
            content: (
              <EditProductDialog product={product} onSuccess={onSuccess} />
            ),
          })
        }
      >
        Edit
      </Button>
    </Box>
  );
};

export default MyProductsAction;
