import axios from "axios";
import type { AxiosRequestConfig } from "axios";

// API Response Types
export interface VendorLoginResponse {
  token: string;
  vendor: {
    id: string;
    name: string;
    email: string;
  };
}

// Create an axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the auth token
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem("auth_token");
      // Redirect to login if needed
      window.location.href = "/vendor/login";
    }
    return Promise.reject(error);
  }
);

// Vendor API endpoints
export const vendorApi = {
  login: async (
    email: string,
    password: string
  ): Promise<VendorLoginResponse> => {
    const response = await api.post<VendorLoginResponse>("/vendors/login", {
      email,
      password,
    });
    return response.data;
  },
};
