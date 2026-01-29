import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** API error detail can be string, array of { type, loc, msg, input }, or single object. Never pass raw detail to React (e.g. toast) or you get "Objects are not valid as a React child". */
type ApiErrorDetail =
  | string
  | Array<{ type?: string; loc?: unknown; msg?: string; input?: unknown }>
  | { type?: string; loc?: unknown; msg?: string; input?: unknown }

export function getApiErrorMessage(
  error: unknown,
  fallback: string = "Something went wrong"
): string {
  const err = error as {
    response?: { data?: { detail?: ApiErrorDetail } }
    message?: string
  }
  const detail = err?.response?.data?.detail
  if (detail == null) return err?.message ?? fallback
  if (typeof detail === "string") return detail
  if (Array.isArray(detail)) {
    const parts = detail.map((d) =>
      typeof d === "object" && d !== null && d && "msg" in d
        ? (d as { msg?: string }).msg
        : String(d)
    )
    const joined = parts.filter(Boolean).join(" ")
    return joined || err?.message || fallback
  }
  if (typeof detail === "object" && detail !== null && "msg" in detail)
    return (detail as { msg?: string }).msg ?? err?.message ?? fallback
  return err?.message ?? fallback
}
