import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface RegisterVendorData {
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface LoginVendorData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  vendor: {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    is_verified: boolean;
  };
}

export const authApi = {
  register: async (data: RegisterVendorData) => {
    const response = await api.post<{ vendor_id: string; message: string }>(
      "/vendors/register",
      data
    );
    return response.data;
  },

  verifyOtp: async (vendor_id: string, otp: string) => {
    const response = await api.post<AuthResponse>("/vendors/verify-otp", {
      vendor_id,
      otp,
    });
    return response.data;
  },

  login: async (data: LoginVendorData) => {
    const response = await api.post<AuthResponse>("/vendors/login", data);
    // Store the token in localStorage
    localStorage.setItem("token", response.data.token);
    // Store the vendor data
    localStorage.setItem("vendor", JSON.stringify(response.data.vendor));
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("vendor");
  },

  requestNewOtp: async (vendor_id: string) => {
    const response = await api.post<{ message: string }>(
      `/vendors/${vendor_id}/request-otp`
    );
    return response.data;
  },
};

export default api;
