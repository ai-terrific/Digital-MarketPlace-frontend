import axios, { AxiosError, AxiosInstance } from "axios";

import { BASE_URL } from "@/constants";
import type { ApiRequest } from "@/types";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/`,
  timeout: 60000, // Timeout in milliseconds
});

/**
 * Generic function to handle API requests
 * @param config - Axios request configuration
 * @param errorMessage - Default error message in case of failure
 */
const apiRequest = async <T>(config: ApiRequest): Promise<T> => {
  try {
    const response = await axiosInstance(config);

    return response.data;
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : "An unknown error occurred";
    throw new Error(message || config.errorMessage);
  }
};

export default apiRequest;
