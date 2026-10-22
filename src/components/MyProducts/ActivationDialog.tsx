import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import ActionDialogActions from "./ActionDialogActions";
import ActionDialogError from "./ActionDialogError";

interface ActivationDialogProps {
  open: boolean;
  productName: string;
  price: string;
  actionBusy: boolean;
  actionError: string;
  onPriceChange: (price: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const ActivationDialog: React.FC<ActivationDialogProps> = ({
  open,
  productName,
  price,
  actionBusy,
  actionError,
  onPriceChange,
  onClose,
  onConfirm,
}) => {
  const validPrice =
    price.trim() !== "" && Number.isFinite(Number(price)) && Number(price) > 0;

  return (
    <Dialog
      open={open}
      onClose={() => !actionBusy && onClose()}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Activate Product</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Set the price buyers will pay for {productName || "this product"}.
        </Typography>
        <TextField
          fullWidth
          type="number"
          label="Listing Price (PHX)"
          value={price}
          onChange={(event) => onPriceChange(event.target.value)}
          slotProps={{ htmlInput: { min: 0, step: "any" } }}
          error={price.trim() !== "" && !validPrice}
          helperText="Enter a price greater than zero."
          sx={{ mt: 1 }}
        />
        <ActionDialogError error={actionError} />
      </DialogContent>
      <ActionDialogActions
        cancelLabel="Cancel"
        confirmLabel="Activate"
        busyLabel="Activating..."
        busy={actionBusy}
        disabled={!validPrice}
        onCancel={onClose}
        onConfirm={onConfirm}
      />
    </Dialog>
  );
};

export default ActivationDialog;
