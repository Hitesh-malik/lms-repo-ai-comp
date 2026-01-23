import { api } from "@/lib/api";
import { tokenStore } from "@/lib/token";
import { CONFIG } from "@/lib/config";

export type LoginReq = { username: string; password: string };

export type LoginRes = {
  success: boolean;
  detail : string;
  access_token?: string;
  refresh_token?: string;
 };

// login
export async function loginApi(payload: LoginReq): Promise<LoginRes> {
  const body = new URLSearchParams();
  body.append("username", payload.username);
  body.append("password", payload.password);
  const res = await api.post("/api/v1/auth/login", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    skipAuthRefresh: true,
  });
  return res.data as LoginRes;
}

// signup
export type SignupReq = { username: string; email: string; password: string };
export type SignupRes = {
  success: boolean;
  detail : string;
  access_token?: string;
  refresh_token?: string;
 };

export async function signupApi(payload: SignupReq): Promise<SignupRes> {
    const body = { 
        name: payload.username,
        username: payload.email,
        password: payload.password,
    }
  const res = await api.post("/api/v1/auth/signup", body, {
    skipAuthRefresh: true,
  });
  return res.data as SignupRes;
}

// logout
export async function logoutApi() {
  const res = await api.post("/api/v1/authlogout");
  return res.data;
}

// refresh access token using fetch
export async function refreshTokenApi() {
  const refresh_token = tokenStore.getRefresh();

  if (!refresh_token) {
    throw new Error("No refresh token found");
  }

  const res = await fetch(`${CONFIG.apiBaseUrl}/api/v1/auth/access-token`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${refresh_token}`,
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to refresh token");
  }

  const data = await res.json();

  return data;
}
