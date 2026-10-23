import type { Dispatch, SetStateAction } from "react";
import {
  Box,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { Search, SlidersHorizontal } from "lucide-react";
import { SortType } from "@/types";
import FilterPanel from "./FilterPanel";
import { useDeviceType } from "@/hooks";

interface MarketplaceFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  sort: SortType;
  setSort: Dispatch<SetStateAction<SortType>>;
  activeOnly: boolean;
  setActiveOnly: Dispatch<SetStateAction<boolean>>;
  filterOpen: boolean;
  setFilterOpen: Dispatch<SetStateAction<boolean>>;
  setPage: Dispatch<SetStateAction<number>>;
  resetFilters: () => void;
}

const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  search,
  setSearch,
  sort,
  setSort,
  activeOnly,
  setActiveOnly,
  filterOpen,
  setFilterOpen,
  setPage,
  resetFilters,
}) => {
  const { isMobile } = useDeviceType();

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search products..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ maxWidth: { md: 400 } }}
        />
        {!isMobile && (
          <>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Sort</InputLabel>
              <Select
                value={sort}
                label="Sort"
                onChange={(event) => setSort(event.target.value)}
              >
                {Object.entries(SortType).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {key}
                  </MenuItem>
                ))}
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
              label="Active only"
            />
          </>
        )}
        {isMobile && (
          <Button
            variant="outlined"
            startIcon={<SlidersHorizontal size={16} />}
            onClick={() => setFilterOpen(true)}
          >
            Filters
          </Button>
        )}
      </Box>
      <Drawer
        anchor="right"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        sx={{ "& .MuiDrawer-paper": { width: 280 } }}
      >
        <FilterPanel
          sort={sort}
          setSort={setSort}
          activeOnly={activeOnly}
          setActiveOnly={setActiveOnly}
          setPage={setPage}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
        />
      </Drawer>
    </>
  );
};

export default MarketplaceFilters;
