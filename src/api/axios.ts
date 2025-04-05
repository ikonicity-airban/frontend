// src/api/client.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { CONSTANTS } from "../lib/constants";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL:
    (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  timeoutErrorMessage: "Timeout Request took too long",
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get(CONSTANTS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      Cookies.remove(CONSTANTS.AUTH_TOKEN);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Type-safe API request wrapper
export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    // Add custom error handling here
    if (axiosError.response) {
      console.error(
        "API Error Response:",
        (axiosError.response.data as any).message.message
      );
    } else if (axiosError.request) {
      console.error("API Request Error:", axiosError.request);
    } else {
      console.error("API Error:", axiosError.message);
    }

    throw error;
  }
};

export default apiClient;
