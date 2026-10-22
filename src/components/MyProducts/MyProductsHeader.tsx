import { Box, Button } from "@mui/material";
import { PlusCircle } from "lucide-react";
import { PageTitle } from "@/components/core/Common";

const MyProductsHeader: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 3,
      flexWrap: "wrap",
      gap: 2,
    }}
  >
    <PageTitle title="My Products" />
    <Button
      variant="contained"
      startIcon={<PlusCircle size={16} />}
      onClick={onCreate}
    >
      New Listing
    </Button>
  </Box>
);

export default MyProductsHeader;
