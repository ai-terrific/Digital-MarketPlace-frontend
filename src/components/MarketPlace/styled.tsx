import { Card, styled, Typography } from "@mui/material";

export const ProductCard = styled(Card)({
  cursor: "pointer",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(14, 165, 233, 0.12)",
  },
});

export const ProductName = styled(Typography)({
  fontWeight: 600,
  mb: 0.5,
  lineHeight: 1.3,
});

export const ProductDescription = styled(Typography)({
  fontSize: "0.8rem",
  mb: 2,
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
});
