import axios from "axios";
import { CONFIG } from "@/lib/config";
import { tokenStore } from "@/lib/token";

export const api = axios.create({
  baseURL: CONFIG.apiBaseUrl,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = tokenStore.get();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      tokenStore.clear();
    }
    return Promise.reject(error);
  }
);
