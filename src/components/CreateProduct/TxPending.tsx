import { Box, LinearProgress, Typography } from "@mui/material";

const TxPending = () => {
  return (
    <Box sx={{ mt: 2 }}>
      <LinearProgress />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Transaction pending... Please confirm in your wallet.
      </Typography>
    </Box>
  );
};

export default TxPending;
