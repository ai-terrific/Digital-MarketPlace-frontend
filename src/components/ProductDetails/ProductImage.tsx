import { useThemeMode } from "@/context/ThemeContext";
import { Product } from "@/types";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

const ProductImage = ({ product }: { product: Product }) => {
  const { mode } = useThemeMode();

  return (
    <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 55%" }, minWidth: 0 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Box
          sx={{
            height: { xs: 280, md: 420 },
            borderRadius: 3,
            overflow: "hidden",
            border: 1,
            borderColor: "divider",
            bgcolor:
              mode === "dark"
                ? "rgba(14, 165, 233, 0.05)"
                : "rgba(14, 165, 233, 0.02)",
          }}
        >
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      </motion.div>
    </Box>
  );
};

export default ProductImage;
