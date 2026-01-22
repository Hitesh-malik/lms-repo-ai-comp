import axios from "axios";
import { CONFIG } from "@/lib/config";
import { tokenStore } from "@/lib/token";
import { refreshTokenApi } from "@/services/authApi";

/**
 * IMPORTANT:
 * - tokenStore should provide:
 *    - getAccess(): string | null
 *    - getRefresh(): string | null
 *    - set({ accessToken, refreshToken })
 *    - clear()
 *
 * If your current tokenStore only has get()/set(), update it accordingly.
 */

export const api = axios.create({
  baseURL: CONFIG.apiBaseUrl,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

// ✅ Routes that should NEVER trigger refresh logic
const EXCLUDED_PATHS = [
  "/api/v1/auth/login",
  "/api/v1/auth/signup",
  "/api/v1/auth/refresh",
];

// ✅ Single refresh call control + pending request queue
let isRefreshing = false;
let pendingQueue: Array<(newToken: string | null) => void> = [];

function processQueue(newToken: string | null) {
  pendingQueue.forEach((cb) => cb(newToken));
  pendingQueue = [];
}

function redirectToLogin() {
  if (typeof window !== "undefined") {
    // change to your actual auth route if different
    window.location.href = "/auth";
  }
}

// ✅ Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    // 🔁 Change this based on your tokenStore:
    // const token = tokenStore.get(); // your old version
    const token = tokenStore.get?.(); // supports both

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: handle 401 -> refresh -> retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    // If there's no response (network error)
    if (!error?.response) return Promise.reject(error);

    const status = error.response.status;
    const url: string = originalRequest?.url || "";

    // ✅ Do not refresh for excluded endpoints (login/signup/refresh)
    if (EXCLUDED_PATHS.some((p) => url.includes(p))) {
      return Promise.reject(error);
    }

    // Only handle 401
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Avoid infinite retry loop
    if (originalRequest?._retry) {
      tokenStore.clear?.();
      redirectToLogin();
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // Get refresh token
    const refreshToken =
      tokenStore.getRefresh?.() ?? null; // if your tokenStore supports it

    // If you don't have refresh token stored, logout immediately
    if (!refreshToken) {
      tokenStore.clear?.();
      redirectToLogin();
      return Promise.reject(error);
    }

    // If refresh already running, wait and then retry
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((newToken) => {
          if (!newToken) return reject(error);

          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${newToken}`,
          };

          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      // ✅ Call refresh token API (must NOT use refresh logic itself)
      const refreshed = await refreshTokenApi(refreshToken);

      const newAccessToken = refreshed.access_token;
      const newRefreshToken = refreshed.refresh_token ?? refreshToken;

      // Save tokens
      if (tokenStore.set) {
        tokenStore.set({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        } as any);
      }

      processQueue(newAccessToken);

      // Retry original request with new token
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshErr) {
      processQueue(null);
      tokenStore.clear?.();
      redirectToLogin();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);
