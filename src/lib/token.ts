const KEY = "access_token";
const REFRESH_KEY = "refresh_token";
export const tokenStore = {
  get() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(KEY);
  },
  set(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, token);
  },
  getRefresh() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  setRefresh(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(REFRESH_KEY, token);
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(KEY);
  },
};
