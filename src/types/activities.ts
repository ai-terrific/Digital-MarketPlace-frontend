import type { Product } from "./product";

export enum WalletActivityTypeEnum {
  Listing = "listing",
  Purchase = "purchase",
  Sale = "sale",
  Transfer = "transfer",
}

export interface ProductActivity {
  product: Product;
  counterparty: string;
  transactionHash: string;
  blockNumber: number;
  value?: string;
}

export interface WalletActivity {
  id: string;
  type: WalletActivityTypeEnum;
  productId: string;
  productName: string;
  counterparty: string;
  transactionHash: string;
  blockNumber: number;
  value?: string;
}

export interface AdminActivity {
  id: string;
  event: string;
  description: string;
  blockNumber: number;
  transactionHash: string;
  amount?: number;
}
