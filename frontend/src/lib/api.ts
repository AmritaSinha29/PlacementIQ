// Base URL for the backend API. Configured via NEXT_PUBLIC_API_URL
// (see infra/docker-compose.yml and .env.example); falls back to the
// local dev server when unset.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Join the API base with a path, tolerating a leading slash on the path.
export function apiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, "")
  const suffix = path.startsWith("/") ? path : `/${path}`
  return `${base}${suffix}`
}
