import type { LucideIcon } from "lucide-react";

export enum ThemeMode {
  Light = "light",
  Dark = "dark",
}

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

export interface NavigationItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export enum StatusType {
  Idle = "idle",
  Pending = "pending",
  Success = "success",
  Error = "error",
}
