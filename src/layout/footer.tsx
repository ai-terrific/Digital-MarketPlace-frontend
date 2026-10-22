import { Box, Typography } from "@mui/material";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: "divider",
        py: 3,
        px: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2026 PHX Marketplace. Decentralized digital commerce platform.
      </Typography>
    </Box>
  );
};
