import type { LucideIcon } from "lucide-react";

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

export type StatusType = "idle" | "pending" | "success" | "error";

export type CurrencyType = "PHX" | "ETH";

export interface CreateProductFormData {
  name: string;
  description: string;
  price: string;
  currency: CurrencyType;
}
