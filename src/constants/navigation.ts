import { Package, PlusCircle, Settings, Store } from "lucide-react";

import { routers } from "./routers";
import type { NavigationItem } from "@/types";

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { path: routers.MARKETPLACE, label: "Marketplace", icon: Store },
  { path: routers.CREATE, label: "Create Listing", icon: PlusCircle },
  { path: routers.MY_PRODUCTS, label: "My Products", icon: Package },
  { path: routers.ADMIN, label: "Admin", icon: Settings },
];
