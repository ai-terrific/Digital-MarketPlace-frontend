import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import type { TypographyProps } from "@mui/material";

export const PageTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Typography variant="h3" sx={{ mb: 1 }}>
      {title}
    </Typography>
  );
};

export const PageDescription: React.FC<
  Omit<TypographyProps, "children"> & {
    description?: string;
  }
> = ({ description, ...props }) => {
  return (
    <Typography
      variant="body1"
      color="text.secondary"
      sx={{ mb: 4 }}
      {...props}
    >
      {description}
    </Typography>
  );
};

export const Loading: React.FC = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
      <CircularProgress />
    </Box>
  );
};
