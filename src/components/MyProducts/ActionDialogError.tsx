import { Alert } from "@mui/material";

const ActionDialogError: React.FC<{ error: string }> = ({ error }) =>
  error ? (
    <Alert severity="error" sx={{ mt: 2 }}>
      {error}
    </Alert>
  ) : null;

export default ActionDialogError;
