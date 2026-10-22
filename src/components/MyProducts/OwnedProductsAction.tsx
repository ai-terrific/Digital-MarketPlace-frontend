import { Box, Button } from "@mui/material";
import { ArrowRightLeft, Eye, Power } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDialog } from "@/context/DialogContext";
import type { Product } from "@/types";
import { ActivateProductDialog, TransferProductDialog } from "./ProductDialogs";

const OwnedProductsAction: React.FC<{
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
        startIcon={<ArrowRightLeft size={14} />}
        variant="outlined"
        onClick={() =>
          openDialog({
            title: "Transfer Ownership",
            content: (
              <TransferProductDialog product={product} onSuccess={onSuccess} />
            ),
          })
        }
      >
        Transfer
      </Button>
      <Button
        size="small"
        startIcon={<Power size={14} />}
        variant="outlined"
        onClick={() =>
          openDialog({
            title: "Activate Product",
            content: (
              <ActivateProductDialog product={product} onSuccess={onSuccess} />
            ),
          })
        }
      >
        Activate
      </Button>
    </Box>
  );
};

export default OwnedProductsAction;
