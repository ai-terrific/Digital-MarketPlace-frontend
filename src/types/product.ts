import { CurrencyType } from "./marketplace";

export enum ProductStatus {
  Active = "Active",
  Sold = "Sold",
  Transferred = "Transferred",
  Inactive = "Inactive",
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
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

export interface CreateProductFormData {
  name: string;
  description: string;
  price: string;
  currency: CurrencyType;
}
