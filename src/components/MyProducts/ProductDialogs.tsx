import { useState } from "react";
import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { isAddress } from "ethers";
import { useDialog } from "@/context/DialogContext";
import { useWallet } from "@/context/WalletContext";
import {
  activateProduct,
  transferProduct,
  updateProductDetails,
} from "@/services/productService";
import type { Product } from "@/types";
import { errorHandler } from "@/utils";

interface ProductDialogProps {
  product: Product;
  onSuccess: () => void;
}

export const EditProductDialog: React.FC<ProductDialogProps> = ({
  product,
  onSuccess,
}) => {
  const { closeDialog, setDialogCloseDisabled } = useDialog();
  const { getSigner } = useWallet();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setBusy(true);
    setError("");
    setDialogCloseDisabled(true);
    try {
      const signer = await getSigner();
      await updateProductDetails(product.id, name, description, signer);
      onSuccess();
      closeDialog();
    } catch (cause) {
      setError(errorHandler(cause, "Product update failed."));
    } finally {
      setBusy(false);
      setDialogCloseDisabled(false);
    }
  };

  return (
    <>
      <DialogContent>
        <TextField
          fullWidth
          label="Product Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          sx={{ mt: 1, mb: 2 }}
        />
        <TextField
          fullWidth
          multiline
          minRows={4}
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={closeDialog} disabled={busy}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => void handleSave()}
          disabled={!name.trim() || busy}
        >
          {busy ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </>
  );
};

export const TransferProductDialog: React.FC<ProductDialogProps> = ({
  product,
  onSuccess,
}) => {
  const { closeDialog, setDialogCloseDisabled } = useDialog();
  const { getSigner } = useWallet();
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const addressValid = isAddress(address);

  const handleTransfer = async () => {
    setBusy(true);
    setError("");
    setDialogCloseDisabled(true);
    try {
      const signer = await getSigner();
      await transferProduct(product.id, address, signer);
      onSuccess();
      closeDialog();
    } catch (cause) {
      setError(errorHandler(cause, "Product transfer failed."));
    } finally {
      setBusy(false);
      setDialogCloseDisabled(false);
    }
  };

  return (
    <>
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
          onChange={(event) => setAddress(event.target.value)}
          error={Boolean(address) && !addressValid}
          helperText={
            address && !addressValid ? "Enter a valid wallet address." : ""
          }
          sx={{ mt: 1 }}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={closeDialog} disabled={busy}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!addressValid || busy}
          onClick={() => void handleTransfer()}
        >
          {busy ? "Transferring..." : "Confirm Transfer"}
        </Button>
      </DialogActions>
    </>
  );
};

export const ActivateProductDialog: React.FC<ProductDialogProps> = ({
  product,
  onSuccess,
}) => {
  const { closeDialog, setDialogCloseDisabled } = useDialog();
  const { getSigner } = useWallet();
  const [price, setPrice] = useState(String(product.price));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const validPrice =
    Boolean(price.trim()) &&
    Number.isFinite(Number(price)) &&
    Number(price) > 0;

  const handleActivate = async () => {
    setBusy(true);
    setError("");
    setDialogCloseDisabled(true);
    try {
      const signer = await getSigner();
      await activateProduct(product.id, price, signer);
      onSuccess();
      closeDialog();
    } catch (cause) {
      setError(errorHandler(cause, "Product activation failed."));
    } finally {
      setBusy(false);
      setDialogCloseDisabled(false);
    }
  };

  return (
    <>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Set the price buyers will pay for {product.name}.
        </Typography>
        <TextField
          fullWidth
          type="number"
          label="Listing Price (PHX)"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          slotProps={{ htmlInput: { min: 0, step: "any" } }}
          error={
            price.trim() !== "" &&
            (!Number.isFinite(Number(price)) || Number(price) <= 0)
          }
          helperText="Enter a price greater than zero."
          sx={{ mt: 1 }}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={closeDialog} disabled={busy}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => void handleActivate()}
          disabled={!validPrice || busy}
        >
          {busy ? "Activating..." : "Activate"}
        </Button>
      </DialogActions>
    </>
  );
};
