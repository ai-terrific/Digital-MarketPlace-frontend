import { CurrencyType } from "./ui";

export interface Transaction {
  id: string;
  type: TransactionType;
  product?: string;
  productName?: string;
  from: string;
  to: string;
  amount: number;
  currency: CurrencyType;
  fee: number;
  txHash: string;
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
  blockNumber?: number;
}

export type TransactionType =
  "purchase" | "listing" | "transfer" | "update" | "withdrawal" | "fee-update";
