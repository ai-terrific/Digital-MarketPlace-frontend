import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { MARKETPLACE_PAGE_SIZE } from "@/constants";
import { Product, sortTypeUnion } from "@/types";
import { getProductCount, getProducts } from "@/services/productService";
import { PageTitle, Pagination } from "@/components/core/Common";
import Filters from "@/components/MarketPlace/MarketplaceFilters";
import Results from "@/components/MarketPlace/MarketplaceResults";
import { errorHandler } from "@/utils";

const MarketplacePage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<sortTypeUnion>("newest");
  const [activeOnly, setActiveOnly] = useState(false);
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
        setLoadError(errorHandler(error, "Could not load on-chain products."));
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
    let filtered = products.filter(
      (product) =>
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()),
    );

    if (activeOnly) {
      filtered = filtered.filter((product) => product.status === "Active");
    }

    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => Number(b.id) - Number(a.id));
        break;
    }

    return filtered;
  }, [products, search, sort, activeOnly]);

  const resetFilters = () => {
    setSearch("");
    setSort("newest");
    setActiveOnly(false);
    setPage(0);
  };

  return (
    <Box>
      <PageTitle title="Marketplace" />
      <Filters
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        activeOnly={activeOnly}
        setActiveOnly={setActiveOnly}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        setPage={setPage}
        resetFilters={resetFilters}
      />
      <Results
        loading={loading}
        error={loadError}
        products={filteredProducts}
        search={search}
        onClearSearch={() => {
          setSearch("");
          setPage(0);
        }}
        onRetry={() => setReloadIndex((index) => index + 1)}
      />
      {!loading && !loadError && totalProducts > MARKETPLACE_PAGE_SIZE && (
        <Pagination
          count={Math.ceil(totalProducts / MARKETPLACE_PAGE_SIZE)}
          page={page}
          setPage={setPage}
        />
      )}
    </Box>
  );
};

export default MarketplacePage;
