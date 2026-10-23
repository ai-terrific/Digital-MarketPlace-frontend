import { useRefresh } from "@/hooks/useRefresh";
import { Alert, Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const LoadingError: React.FC<React.PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const { refresh } = useRefresh();

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", py: 6 }}>
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={refresh}>
            Retry
          </Button>
        }
      >
        {children}
      </Alert>
      <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
        Back to Marketplace
      </Button>
    </Box>
  );
};

export default LoadingError;
