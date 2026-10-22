import { Button, DialogActions } from "@mui/material";

interface ActionDialogActionsProps {
  cancelLabel: string;
  confirmLabel: string;
  busyLabel: string;
  busy: boolean;
  disabled?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ActionDialogActions: React.FC<ActionDialogActionsProps> = ({
  cancelLabel,
  confirmLabel,
  busyLabel,
  busy,
  disabled = false,
  onCancel,
  onConfirm,
}) => (
  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button onClick={onCancel} disabled={busy}>
      {cancelLabel}
    </Button>
    <Button variant="contained" onClick={onConfirm} disabled={busy || disabled}>
      {busy ? busyLabel : confirmLabel}
    </Button>
  </DialogActions>
);

export default ActionDialogActions;
