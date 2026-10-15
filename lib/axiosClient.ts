import axios from "axios"

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

let isRefreshing = false
let refreshQueue: Array<() => void> = []

function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === "undefined") return
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

function clearAuthTokens() {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem("accessToken")
  window.localStorage.removeItem("access_token")
  window.localStorage.removeItem("refreshToken")
  window.localStorage.removeItem("refresh_token")
  deleteCookie("accessToken")
  deleteCookie("access_token")
  deleteCookie("refreshToken")
  deleteCookie("refresh_token")
}

async function refreshAccessToken() {
  if (typeof window === "undefined") {
    throw new Error("Cannot refresh token outside the browser")
  }

  const refreshToken =
    window.localStorage.getItem("refreshToken") ?? window.localStorage.getItem("refresh_token")

  if (!refreshToken) {
    clearAuthTokens()
    throw new Error("No refresh token available")
  }

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
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

  return nextAccessToken
}

axiosClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config
  }

  const token = window.localStorage.getItem("accessToken") ?? window.localStorage.getItem("access_token")

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      await new Promise<void>((resolve) => {
        refreshQueue.push(resolve)
      })

      const retryToken = window.localStorage.getItem("accessToken") ?? window.localStorage.getItem("access_token")

      if (retryToken) {
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${retryToken}`
      }

      return axiosClient(originalRequest)
    }

    isRefreshing = true

    try {
      const refreshedToken = await refreshAccessToken()

      refreshQueue.forEach((resolve) => resolve())
      refreshQueue = []

      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${refreshedToken}`

      return axiosClient(originalRequest)
    } catch (refreshError) {
      clearAuthTokens()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default axiosClient