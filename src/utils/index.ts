import type { formData } from "@/types";
import type { ChangeEvent } from "react";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

export const errorHandler = (error: unknown, fallback: string): string => {
  if (!isRecord(error)) return getString(error) ?? fallback;

  const response = isRecord(error.response) ? error.response : undefined;
  const responseData =
    response && isRecord(response.data) ? response.data : undefined;

  return (
    getString(responseData?.message) ??
    getString(responseData?.error) ??
    getString(responseData?.detail) ??
    getString(error.shortMessage) ??
    getString(error.reason) ??
    getString(error.message) ??
    fallback
  );
};

export const validation = (form: formData, imageURI: string | null) => {
  const errs: Record<string, string> = {};
  if (!form.name.trim()) errs.name = "Product name is required";
  if (!form.description.trim()) errs.description = "Description is required";
  if (
    !/^\d+(\.\d{1,18})?$/.test(form.price.trim()) ||
    !Number.isFinite(Number(form.price)) ||
    Number(form.price) <= 0
  ) {
    errs.price = "Valid price is required";
  }
  if (!imageURI) errs.image = "Upload a product image to IPFS";

  return { validate: Object.keys(errs).length === 0, errs };
};

const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;
const PRODUCT_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const PRODUCT_IMAGE_ACCEPT = PRODUCT_IMAGE_TYPES.join(",");

export const validateProductImage = (file: File): string | null => {
  if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
    return "File size must be under 5MB";
  }
  if (!PRODUCT_IMAGE_TYPES.includes(file.type)) {
    return "Only PNG, JPEG, or WebP files are accepted";
  }

  return null;
};

export const readImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Could not read the selected image."));

        return;
      }

      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });

export const getSelectedImage = (
  event: ChangeEvent<HTMLInputElement>,
): File | null => {
  const file = event.currentTarget.files?.[0] ?? null;
  event.currentTarget.value = "";

  return file;
};
