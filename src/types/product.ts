import { CurrencyType } from "./ui";

export type ProductStatus = "Active" | "Sold" | "Transferred" | "Inactive";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: CurrencyType;
  seller: string;
  image: string;
  status: ProductStatus;
  specifications?: Record<string, string>;
  createdAt?: string;
  owner?: string;
  txHash?: string;
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
