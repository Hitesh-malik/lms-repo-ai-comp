const KEY = "access_token";

export const tokenStore = {
  get() {
    if (typeof window === "undefined") return null; // safety
    return localStorage.getItem(KEY);
  },
  set(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, token);
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(KEY);
  },
};
