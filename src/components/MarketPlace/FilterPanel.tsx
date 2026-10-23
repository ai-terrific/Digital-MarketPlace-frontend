import { FC, Dispatch, SetStateAction } from "react";
import { SortType } from "@/types";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { X } from "lucide-react";

interface FilterPanelType {
  sort: SortType;
  setSort: Dispatch<SetStateAction<SortType>>;
  setFilterOpen: Dispatch<SetStateAction<boolean>>;
  activeOnly: boolean;
  setActiveOnly: Dispatch<SetStateAction<boolean>>;
  setPage: Dispatch<SetStateAction<number>>;
  resetFilters: () => void;
}

const FilterPanel: FC<FilterPanelType> = ({
  sort,
  setSort,
  setFilterOpen,
  activeOnly,
  setActiveOnly,
  setPage,
  resetFilters,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Filters
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setFilterOpen(false)}>
            <X size={20} />
          </IconButton>
        )}
      </Box>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sort}
          label="Sort By"
          onChange={(e) => setSort(e.target.value)}
        >
          <MenuItem value={SortType.Newest}>Newest First</MenuItem>
          <MenuItem value={SortType.PriceAsc}>Price: Low to High</MenuItem>
          <MenuItem value={SortType.PriceDesc}>Price: High to Low</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={activeOnly}
            onChange={(event) => {
              setActiveOnly(event.target.checked);
              setPage(0);
            }}
          />
        }
        label="Show active products only"
        sx={{ mb: 2 }}
      />

      <Button variant="outlined" fullWidth size="small" onClick={resetFilters}>
        Reset Filters
      </Button>
    </Box>
  );
};

export default FilterPanel;
