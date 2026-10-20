import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Chip,
  Button,
  Select,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useThemeMode } from "../ThemeContext";
import { MARKETPLACE_PAGE_SIZE } from "@/constants";
import type { Product } from "../types";
import { getProductCount, getProducts } from "@/services/productService";

const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const [pageProducts, count] = await Promise.all([
          getProducts(page * MARKETPLACE_PAGE_SIZE, MARKETPLACE_PAGE_SIZE),
          getProductCount(),
        ]);
        if (!active) return;
        setProducts(pageProducts);
        setTotalProducts(count);
      } catch (error) {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load on-chain products.",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadPage();
    
return () => {
      active = false;
    };
  }, [page, reloadIndex]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      );
    }
    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => Number(BigInt(b.id) - BigInt(a.id)));
        break;
    }
    
return filtered;
  }, [products, search, sort]);

  const FilterPanel = () => (
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
          <MenuItem value="newest">Newest First</MenuItem>
          <MenuItem value="price-asc">Price: Low to High</MenuItem>
          <MenuItem value="price-desc">Price: High to Low</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        fullWidth
        size="small"
        onClick={() => {
          setSearch("");
          setSort("newest");
        }}
      >
        Reset Filters
      </Button>
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{ fontFamily: "'Space Grotesk', sans-serif", mb: 1 }}
        >
          Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover premium digital technology products powered by PHX Token
        </Typography>
      </Box>

      {/* Search and Filters Bar */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
                onChange={(e) => setSort(e.target.value)}
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="price-asc">Price ↑</MenuItem>
                <MenuItem value="price-desc">Price ↓</MenuItem>
              </Select>
            </FormControl>
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

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        sx={{ "& .MuiDrawer-paper": { width: 280 } }}
      >
        <FilterPanel />
      </Drawer>

      {/* Results Count */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""} found
        </Typography>
        {search && (
          <Button size="small" onClick={() => setSearch("")}>
            Clear filters
          </Button>
        )}
      </Box>

      {/* Product Grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={28} />
        </Box>
      ) : loadError ? (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setReloadIndex((value) => value + 1)}
            >
              Retry
            </Button>
          }
        >
          {loadError}
        </Alert>
      ) : filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                sx={{
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 40px rgba(14, 165, 233, 0.12)",
                  },
                }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <Box
                  sx={{
                    height: 180,
                    borderBottom: 1,
                    borderColor: "divider",
                    position: "relative",
                    overflow: "hidden",
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
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s",
                      ".MuiCard-root:hover &": { transform: "scale(1.05)" },
                    }}
                  />
                  <Chip
                    label={product.status}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor:
                        product.status === "Active"
                          ? "rgba(16, 185, 129, 0.9)"
                          : "rgba(245, 158, 11, 0.9)",
                      color: "#fff",
                      fontSize: "0.65rem",
                      backdropFilter: "blur(4px)",
                    }}
                  />
                </Box>
                <CardContent
                  sx={{
                    p: 2,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.3 }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: "0.8rem",
                      mb: 2,
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: "auto",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "primary.main" }}
                    >
                      {product.price} {product.currency}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.seller}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      )}

      {!loading && !loadError && totalProducts > MARKETPLACE_PAGE_SIZE && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            disabled={page === 0}
            onClick={() => setPage((value) => value - 1)}
          >
            Previous
          </Button>
          <Typography variant="body2" color="text.secondary">
            Page {page + 1} of{" "}
            {Math.ceil(totalProducts / MARKETPLACE_PAGE_SIZE)}
          </Typography>
          <Button
            disabled={(page + 1) * MARKETPLACE_PAGE_SIZE >= totalProducts}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MarketplacePage;
