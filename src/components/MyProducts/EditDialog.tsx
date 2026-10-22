import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import ActionDialogActions from "./ActionDialogActions";
import ActionDialogError from "./ActionDialogError";

interface EditDialogProps {
  open: boolean;
  name: string;
  description: string;
  actionBusy: boolean;
  actionError: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  name,
  description,
  actionBusy,
  actionError,
  onNameChange,
  onDescriptionChange,
  onClose,
  onConfirm,
}) => (
  <Dialog
    open={open}
    onClose={() => !actionBusy && onClose()}
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle>Edit Product</DialogTitle>
    <DialogContent>
      <TextField
        fullWidth
        label="Product Name"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        sx={{ mt: 1, mb: 2 }}
      />
      <TextField
        fullWidth
        multiline
        minRows={4}
        label="Description"
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
      />
      <ActionDialogError error={actionError} />
    </DialogContent>
    <ActionDialogActions
      cancelLabel="Cancel"
      confirmLabel="Save Changes"
      busyLabel="Saving..."
      busy={actionBusy}
      disabled={!name.trim()}
      onCancel={onClose}
      onConfirm={onConfirm}
    />
  </Dialog>
);

export default EditDialog;
