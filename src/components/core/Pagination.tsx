import { Box, Pagination as MuiPagination } from "@mui/material";
import React from "react";

interface PaginationType {
  count: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationType> = ({ count, page, setPage }) => {
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

export default Pagination;
