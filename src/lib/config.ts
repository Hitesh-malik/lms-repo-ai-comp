type AppEnv = "local" | "staging" | "production";

const appEnv = (process.env.NEXT_PUBLIC_APP_ENV as AppEnv) || "local";

const URLS: Record<AppEnv, string> = {
  local: process.env.NEXT_PUBLIC_API_LOCAL || "",
  staging: process.env.NEXT_PUBLIC_API_STAGING || "",
  production: process.env.NEXT_PUBLIC_API_PRODUCTION || "",
};

export const CONFIG = {
  env: appEnv,
  apiBaseUrl: URLS[appEnv],
};

if (!CONFIG.apiBaseUrl) {
  console.warn(`API base URL missing for env: ${CONFIG.env}`);
}
