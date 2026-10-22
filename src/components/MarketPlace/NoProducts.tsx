import { Box, Typography } from "@mui/material";
import React from "react";

const NoProducts: React.FC = () => {
  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
        No products found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Try adjusting your search or filters
      </Typography>
    </Box>
  );
};

export default NoProducts;
