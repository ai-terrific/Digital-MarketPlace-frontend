import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { type Product } from "@/types";
import ProductImage from "./ProductImage";
import ProductPrice from "./ProductPrice";
import ProductAction from "./ProductAction";
import PageHeader from "../core/PageHeader";

interface ProductOverviewProps {
  product: Product;
  address: string | null;
  listedPrice: string;
  platformFee: string;
  platformFeeBps: number;
  total: string;
  onPurchase: () => void;
}

const ProductOverview: React.FC<ProductOverviewProps> = ({
  product,
  address,
  listedPrice,
  platformFee,
  platformFeeBps,
  total,
  onPurchase,
}) => {
  const isOwner = product.owner?.toLowerCase() === address?.toLowerCase();

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      <ProductImage product={product} />

      <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 40%" }, minWidth: 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PageHeader title={product.name} description={product.description} />

          <ProductPrice
            product={product}
            listedPrice={listedPrice}
            platformFee={platformFee}
            platformFeeBps={platformFeeBps}
            total={total}
          />

          <ProductAction
            product={product}
            isOwner={isOwner}
            onPurchase={onPurchase}
          />
        </motion.div>
      </Box>
    </Box>
  );
};

export default ProductOverview;
