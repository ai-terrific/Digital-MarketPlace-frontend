import type { AxiosRequestConfig } from "axios";

export interface ImageUploadResponse {
  url?: string;
}

export interface ApiRequest extends AxiosRequestConfig {
  errorMessage: string;
}
