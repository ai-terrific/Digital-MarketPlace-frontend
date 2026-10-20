import {
  ArrowRightLeft,
  List,
  Percent,
  RefreshCw,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { TransactionType } from "@/types";

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  purchase: "Purchase",
  listing: "Listing",
  transfer: "Transfer",
  update: "Update",
  withdrawal: "Withdrawal",
  "fee-update": "Fee Update",
};

export const TRANSACTION_DETAILS_LABELS: Record<TransactionType, string> = {
  purchase: "Purchase",
  listing: "Listing Creation",
  transfer: "Ownership Transfer",
  update: "Listing Update",
  withdrawal: "Withdrawal",
  "fee-update": "Fee Update",
};

export const TRANSACTION_TYPE_ICONS: Record<TransactionType, LucideIcon> = {
  purchase: ShoppingCart,
  listing: List,
  transfer: ArrowRightLeft,
  update: RefreshCw,
  withdrawal: Wallet,
  "fee-update": Percent,
};
