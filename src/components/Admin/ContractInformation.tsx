import { Box, Card, Typography } from "@mui/material";
import React from "react";

interface ContractInformation {
  name: string;
  value: string;
  icon: React.JSX.Element;
}

const ContractInformation: React.FC<ContractInformation> = ({
  name,
  value,
  icon,
}) => {
  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        {icon}
        <Typography variant="caption" color="text.secondary">
          {name}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          fontFamily: "monospace",
          fontSize: "0.75rem",
          wordBreak: "break-all",
        }}
      >
        {value}
      </Typography>
    </Card>
  );
};

export default ContractInformation;
