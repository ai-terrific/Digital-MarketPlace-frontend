import type { AxiosRequestConfig } from "axios";
import type { JsonRpcSigner } from "ethers";
import type { LucideIcon } from "lucide-react";

export type ProductStatus = "Active" | "Sold" | "Transferred" | "Inactive";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "PHX" | "ETH";
  seller: string;
  image: string;
  status: ProductStatus;
  specifications?: Record<string, string>;
  createdAt?: string;
  owner?: string;
  txHash?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  product?: string;
  productName?: string;
  from: string;
  to: string;
  amount: number;
  currency: "PHX" | "ETH";
  fee: number;
  txHash: string;
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
  blockNumber?: number;
}

export type TransactionType =
  "purchase" | "listing" | "transfer" | "update" | "withdrawal" | "fee-update";

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: string | null;
  chainId: number | null;
}

export interface MarketplaceStats {
  totalProducts: number;
  totalTransactions: number;
  activeSellers: number;
  totalVolume: number;
}

export interface ProductType {
  name: string;
  description: string;
  pricePHX: string;
  imageURI: string;
}

export interface ContractProduct {
  productId: bigint;
  name: string;
  description: string;
  imageURI: string;
  currentOwner: string;
  price: bigint;
  listed: boolean;
}

export interface ImageUploadResponse {
  url?: string;
}

export interface ApiRequest extends AxiosRequestConfig {
  errorMessage: string;
}

export interface ProductActivity {
  product: Product;
  counterparty: string;
  transactionHash: string;
  blockNumber: number;
  value?: number;
}

export interface WalletActivity {
  id: string;
  type: "listing" | "purchase" | "sale" | "transfer";
  productId: string;
  productName: string;
  counterparty: string;
  transactionHash: string;
  blockNumber: number;
  value?: number;
}

export interface AdminActivity {
  id: string;
  event: string;
  description: string;
  blockNumber: number;
  transactionHash: string;
  amount?: number;
}

export interface MarketplaceAdminData {
  owner: string;
  fixedListingFee: string;
  platformFeeBps: number;
  maxFeeBps: number;
  pendingPlatformFees: number;
  activity: AdminActivity[];
}

export interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  connecting: boolean;
  getSigner: () => Promise<JsonRpcSigner>;
}

export type ThemeMode = "light" | "dark";

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

export interface NavigationItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export enum sortType {
  Newest = "newest",
  PriceAsc = "price-asc",
  PriceDesc = "price-desc",
}

export type sortTypeUnion = `${sortType}`;

export type statusType = "idle" | "pending" | "success" | "error";

export type currencyType = "PHX" | "ETH";

export interface balanceType {
  phx: number;
  eth: number;
}

export interface formData {
  name: string;
  description: string;
  price: string;
  currency: currencyType;
}
