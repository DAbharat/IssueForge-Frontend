import axios from "axios"
import { isTokenExpiringSoon } from "@/lib/auth"

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/+$/, "")

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

let refreshPromise: Promise<string> | null = null

function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === "undefined") return
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`
}

function clearAuthTokens() {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem("accessToken")
  window.localStorage.removeItem("access_token")
  window.localStorage.removeItem("refreshToken")
  window.localStorage.removeItem("refresh_token")
  window.localStorage.removeItem("user")
  window.localStorage.removeItem("activeWorkspaceId")
  try {
    window.sessionStorage.clear()
  } catch {
    // ignore
  }
  deleteCookie("accessToken")
  deleteCookie("access_token")
  deleteCookie("refreshToken")
  deleteCookie("refresh_token")
}

async function refreshAccessToken(): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("Cannot refresh token outside the browser")
  }

  const refreshToken =
    window.localStorage.getItem("refreshToken") ??
    window.localStorage.getItem("refresh_token") ??
    getCookie("refreshToken") ??
    getCookie("refresh_token")

  if (!refreshToken) {
    clearAuthTokens()
    throw new Error("No refresh token available")
  }

  const response = await axios.post(
    `${API_BASE_URL}/api/auth/refresh`,
    { refresh_token: refreshToken },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )

  const nextAccessToken = response.data.accessToken ?? response.data.access_token

  if (!nextAccessToken) {
    clearAuthTokens()
    throw new Error("Refresh response did not include an access token")
  }

  window.localStorage.setItem("accessToken", nextAccessToken)
  window.localStorage.setItem("access_token", nextAccessToken)
  setCookie("accessToken", nextAccessToken, 7)
  setCookie("access_token", nextAccessToken, 7)

  const nextRefreshToken = response.data.refreshToken ?? response.data.refresh_token
  if (nextRefreshToken) {
    window.localStorage.setItem("refreshToken", nextRefreshToken)
    window.localStorage.setItem("refresh_token", nextRefreshToken)
    setCookie("refreshToken", nextRefreshToken, 30)
    setCookie("refresh_token", nextRefreshToken, 30)
  }

  return nextAccessToken
}

function getRefreshedToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

axiosClient.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") {
    return config
  }

  const isAuthEndpoint =
    config.url?.includes("/api/login") ||
    config.url?.includes("/api/register") ||
    config.url?.includes("/api/auth/refresh") ||
    config.url?.includes("/api/auth/google") ||
    config.url?.includes("/api/auth/exchange")

  let token =
    window.localStorage.getItem("accessToken") ??
    window.localStorage.getItem("access_token") ??
    getCookie("accessToken") ??
    getCookie("access_token")

  const refreshToken =
    window.localStorage.getItem("refreshToken") ??
    window.localStorage.getItem("refresh_token") ??
    getCookie("refreshToken") ??
    getCookie("refresh_token")

  // Proactively refresh expired access token before sending non-auth requests
  if (!isAuthEndpoint && refreshToken && isTokenExpiringSoon(token, 10)) {
    try {
      token = await getRefreshedToken()
    } catch {
      // If refresh fails here, let request proceed so 401 interceptor can handle it
    }
  }

  if (token) {
    if (config.headers && typeof (config.headers as any).set === "function") {
      (config.headers as any).set("Authorization", `Bearer ${token}`)
    } else {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const isAuthEndpoint =
      originalRequest?.url?.includes("/api/login") ||
      originalRequest?.url?.includes("/api/register") ||
      originalRequest?.url?.includes("/api/auth/refresh") ||
      originalRequest?.url?.includes("/api/auth/google") ||
      originalRequest?.url?.includes("/api/auth/exchange")

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const refreshedToken = await getRefreshedToken()

      if (originalRequest.headers && typeof originalRequest.headers.set === "function") {
        originalRequest.headers.set("Authorization", `Bearer ${refreshedToken}`)
      } else {
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${refreshedToken}`
      }

      return axiosClient(originalRequest)
    } catch (refreshError) {
      clearAuthTokens()
      return Promise.reject(refreshError)
    }
  },
)

export default axiosClient