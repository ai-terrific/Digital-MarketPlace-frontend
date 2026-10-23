import type { AdminActivity } from "./activities";

export interface MarketplaceStats {
  totalProducts: number;
  totalTransactions: number;
  activeSellers: number;
  totalVolume: number;
}

export interface MarketplaceAdminData {
  owner: string;
  fixedListingFee: string;
  platformFeeBps: number;
  maxFeeBps: number;
  pendingPlatformFees: number;
  activity: AdminActivity[];
}

export enum SortType {
  Newest = "newest",
  PriceAsc = "price-asc",
  PriceDesc = "price-desc",
}

export enum CurrencyType {
  PHX = "PHX",
  ETH = "ETH",
}
