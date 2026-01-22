import { api } from "@/lib/api";

export type LoginReq = { username: string; password: string };

export type LoginRes = {
  success: boolean;
  detail : string;
  access_token?: string;
  resfresh_token?: string;
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
  resfresh_token?: string;
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

// refresh access token
export async function refreshTokenApi(refresh_token: string) {
  const res = await api.post("/api/v1/auth/access-token", {
    refresh_token: refresh_token,
  }, {
    skipAuthRefresh: true,
  });
  return res.data;
}