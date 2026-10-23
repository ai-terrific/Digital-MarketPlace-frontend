import { useRefresh } from "@/hooks/useRefresh";
import { Alert, Button } from "@mui/material";
import React from "react";

const LoadingError: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { refresh } = useRefresh();
  
return (
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
  );
};

export default LoadingError;
