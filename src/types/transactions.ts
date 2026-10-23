import { CurrencyType } from "./marketplace";
import { StatusType } from "./system";

export enum TransactionType {
  Purchase = "purchase",
  Listing = "listing",
  Transfer = "transfer",
  Update = "update",
  Withdrawal = "withdrawal",
  FeeUpdate = "fee-update",
}

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
  status: StatusType;
  blockNumber?: number;
}
