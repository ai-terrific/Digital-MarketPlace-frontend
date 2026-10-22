import React from "react";
import { Box, Typography, Pagination as MuiPagination } from "@mui/material";

export const PageTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Typography variant="h3" sx={{ mb: 1 }}>
      {title}
    </Typography>
  );
};

export const PageDescription: React.FC<{
  description: string;
}> = ({ description, ...props }) => {
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

interface PaginationType {
  count: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const Pagination: React.FC<PaginationType> = ({
  count,
  page,
  setPage,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
      }}
    >
      <MuiPagination
        count={count}
        page={page + 1}
        onChange={(_, value) => setPage(value - 1)}
        color="primary"
        showFirstButton
        showLastButton
        aria-label="Marketplace product pages"
      />
    </Box>
  );
};
