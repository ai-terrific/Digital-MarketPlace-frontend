import { motion } from "framer-motion";
import type { Product, ProductActivity } from "@/types";
import MyProductsHeader from "./MyProductsHeader";
import MyProductsPanels from "./MyProductsPanels";

interface MyProductsBodyProps {
  tab: number;
  onTabChange: (tab: number) => void;
  myListings: Product[];
  ownedProducts: Product[];
  soldProducts: ProductActivity[];
  transferredProducts: ProductActivity[];
  loading: boolean;
  loadError: string;
  actionError: string;
  hasOpenDialog: boolean;
  actionBusy: boolean;
  onCreate: () => void;
  onRetry: () => void;
  onView: (id: string) => void;
  onEdit: (product: Product) => void;
  onTransfer: (product: Product) => void;
  onActivate: (product: Product) => void;
}

const MyProductsBody: React.FC<MyProductsBodyProps> = ({
  tab,
  onTabChange,
  myListings,
  ownedProducts,
  soldProducts,
  transferredProducts,
  loading,
  loadError,
  actionError,
  hasOpenDialog,
  actionBusy,
  onCreate,
  onRetry,
  onView,
  onEdit,
  onTransfer,
  onActivate,
}) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <MyProductsHeader onCreate={onCreate} />
    <MyProductsPanels
      tab={tab}
      onTabChange={onTabChange}
      myListings={myListings}
      ownedProducts={ownedProducts}
      soldProducts={soldProducts}
      transferredProducts={transferredProducts}
      loading={loading}
      loadError={loadError}
      actionError={actionError}
      hasOpenDialog={hasOpenDialog}
      actionBusy={actionBusy}
      onRetry={onRetry}
      onView={onView}
      onEdit={onEdit}
      onTransfer={onTransfer}
      onActivate={onActivate}
    />
  </motion.div>
);

export default MyProductsBody;
