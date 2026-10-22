import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { isAddress } from "ethers";
import ActionDialogActions from "./ActionDialogActions";
import ActionDialogError from "./ActionDialogError";

interface TransferDialogProps {
  open: boolean;
  address: string;
  actionBusy: boolean;
  actionError: string;
  onAddressChange: (address: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const TransferDialog: React.FC<TransferDialogProps> = ({
  open,
  address,
  actionBusy,
  actionError,
  onAddressChange,
  onClose,
  onConfirm,
}) => (
  <Dialog
    open={open}
    onClose={() => !actionBusy && onClose()}
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle>Transfer Ownership</DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Transfer this product to another wallet. This requires an on-chain
        transaction (gas fees apply). No payment is exchanged — this is a free
        ownership transfer.
      </Typography>
      <TextField
        fullWidth
        label="Recipient Address"
        placeholder="0x..."
        value={address}
        onChange={(event) => onAddressChange(event.target.value)}
        error={Boolean(address) && !isAddress(address)}
        helperText={
          address && !isAddress(address) ? "Enter a valid wallet address." : ""
        }
        sx={{ mt: 1 }}
      />
      <ActionDialogError error={actionError} />
    </DialogContent>
    <ActionDialogActions
      cancelLabel="Cancel"
      confirmLabel="Confirm Transfer"
      busyLabel="Transferring..."
      busy={actionBusy}
      disabled={!isAddress(address)}
      onCancel={onClose}
      onConfirm={onConfirm}
    />
  </Dialog>
);

export default TransferDialog;
