import { api } from "@/lib/api";

export type LoginReq = { username: string; password: string };

export type LoginRes = {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
};

export async function loginApi(payload: LoginReq): Promise<LoginRes> {
  const body = new URLSearchParams();
  body.append("username", payload.username);
  body.append("password", payload.password);
  const res = await api.post("/api/v1/auth/login", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
}

export type SignupReq = { username: string; email: string; password: string };

export async function signupApi(payload: SignupReq) {
    const body = { 
        name: payload.username,
        username: payload.email,
        password: payload.password,
    }
  const res = await api.post("/api/v1/auth/signup", body);
  return res.data;
}
