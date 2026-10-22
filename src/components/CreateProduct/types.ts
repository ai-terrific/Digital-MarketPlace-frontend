import type { currencyType } from "@/types";

export interface CreateProductFormData {
  name: string;
  description: string;
  price: string;
  currency: currencyType;
}
