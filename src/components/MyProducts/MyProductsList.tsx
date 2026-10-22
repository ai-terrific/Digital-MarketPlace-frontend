import type { Product, ProductActivity } from "@/types";
import { Box, Typography } from "@mui/material";
import ProductItem from "./ProductItem";
import { EMPTY_MESSAGES } from "@/constants";

const MyProductsList = ({
  tab,
  list,
  loading,
  loadError,
  onProductChange,
}: {
  tab: number;
  list: (Product | ProductActivity)[];
  loading: boolean;
  loadError: string;
  onProductChange: () => void;
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
      }}
    >
      {list.map((item) => (
        <ProductItem
          key={"product" in item ? item.transactionHash : item.id}
          item={item}
          tab={tab}
          onProductChange={onProductChange}
        />
      ))}
      {!loading && !loadError && list.length === 0 && (
        <Typography
          color="text.secondary"
          sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}
        >
          {EMPTY_MESSAGES[tab]}
        </Typography>
      )}
    </Box>
  );
};

export default MyProductsList;
