import { Alert, Box, Button, Card, TextField, Typography } from "@mui/material";
import { DollarSign } from "lucide-react";
import type { statusType } from "@/types";
import TxPending from "@/components/CreateProduct/TxPending";

interface AdminFeeSettingProps {
  title: string;
  description: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  buttonLabel: string;
  updatingLabel: string;
  updating: boolean;
  status: statusType;
  error: string;
  successMessage: string;
  transactionHash: string;
  currentValue?: string;
  inputWidth: number;
  inputProps: { min: number; max?: number; step: number | string };
  disabled: boolean;
}

const AdminFeeSetting: React.FC<AdminFeeSettingProps> = ({
  title,
  description,
  label,
  value,
  onChange,
  onSubmit,
  buttonLabel,
  updatingLabel,
  updating,
  status,
  error,
  successMessage,
  transactionHash,
  currentValue,
  inputWidth,
  inputProps,
  disabled,
}) => (
  <Card sx={{ mb: 4, p: 3 }}>
    <Typography
      variant="h6"
      sx={{
        mb: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <DollarSign size={20} /> {title}
    </Typography>
    <Alert severity="info" sx={{ mb: 2 }}>
      {description}
    </Alert>
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      <TextField
        label={label}
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        size="small"
        sx={{ width: inputWidth }}
        slotProps={{ htmlInput: inputProps }}
      />
      <Button variant="contained" onClick={onSubmit} disabled={disabled}>
        {updating
          ? updatingLabel
          : status === "success"
            ? "Updated!"
            : buttonLabel}
      </Button>
      {currentValue !== undefined && (
        <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
          Current fixed fee: {currentValue} PHX
        </Typography>
      )}
    </Box>
    {status === "pending" && <TxPending />}
    {status === "success" && (
      <Alert severity="success" sx={{ mt: 2 }}>
        {successMessage} Transaction: {transactionHash}
      </Alert>
    )}
    {error && (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    )}
  </Card>
);

export default AdminFeeSetting;
