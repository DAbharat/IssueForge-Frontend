"use client"

import { useCallback, useMemo, useState } from "react"
import { logout as apiLogout } from "@/services/account.service"

type AuthTokens = {
  accessToken: string | null
  refreshToken: string | null
}

function readStorageToken(key: "accessToken" | "access_token" | "refreshToken" | "refresh_token") {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage.getItem(key)
}

function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === "undefined") return
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`
}

export function useAuth() {
  const [tokens, setTokens] = useState<AuthTokens>({
    accessToken: null,
    refreshToken: null,
  })

  const loadTokens = useCallback(() => {
    if (typeof window === "undefined") {
      return { accessToken: null, refreshToken: null }
    }

    const accessToken = readStorageToken("accessToken") ?? readStorageToken("access_token")
    const refreshToken = readStorageToken("refreshToken") ?? readStorageToken("refresh_token")

    if (accessToken) {
      setCookie("accessToken", accessToken, 7)
      setCookie("access_token", accessToken, 7)
    }
    if (refreshToken) {
      setCookie("refreshToken", refreshToken, 30)
      setCookie("refresh_token", refreshToken, 30)
    }

    const nextTokens = {
      accessToken,
      refreshToken,
    }

    setTokens(nextTokens)
    return nextTokens
  }, [])

  const setAuthTokens = useCallback((nextTokens: Partial<AuthTokens>) => {
    if (typeof window === "undefined") {
      return
    }

    const accessToken = nextTokens.accessToken ?? readStorageToken("accessToken") ?? readStorageToken("access_token")
    const refreshToken = nextTokens.refreshToken ?? readStorageToken("refreshToken") ?? readStorageToken("refresh_token")

    if (accessToken) {
      window.localStorage.setItem("accessToken", accessToken)
      window.localStorage.setItem("access_token", accessToken)
      setCookie("accessToken", accessToken, 7)
      setCookie("access_token", accessToken, 7)
    }

    if (refreshToken) {
      window.localStorage.setItem("refreshToken", refreshToken)
      window.localStorage.setItem("refresh_token", refreshToken)
      setCookie("refreshToken", refreshToken, 30)
      setCookie("refresh_token", refreshToken, 30)
    }

    setTokens({
      accessToken,
      refreshToken,
    })
  }, [])

  const clearAuthTokens = useCallback(() => {
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
    setTokens({ accessToken: null, refreshToken: null })
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = tokens.refreshToken ?? readStorageToken("refreshToken") ?? readStorageToken("refresh_token")
    try {
      await apiLogout(refreshToken || undefined)
    } catch (error) {
      console.warn("Logout request error on server:", error)
    } finally {
      clearAuthTokens()
    }
  }, [tokens.refreshToken, clearAuthTokens])

  const isAuthenticated = useMemo(
    () => Boolean(tokens.accessToken || tokens.refreshToken),
    [tokens.accessToken, tokens.refreshToken],
  )

  return {
    tokens,
    isAuthenticated,
    loadTokens,
    setAuthTokens,
    clearAuthTokens,
    logout,
  }
}

