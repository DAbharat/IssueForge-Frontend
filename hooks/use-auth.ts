"use client"

import { useCallback, useMemo, useState } from "react"

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
    }

    if (refreshToken) {
      window.localStorage.setItem("refreshToken", refreshToken)
      window.localStorage.setItem("refresh_token", refreshToken)
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
    setTokens({ accessToken: null, refreshToken: null })
  }, [])

  const isAuthenticated = useMemo(() => Boolean(tokens.accessToken), [tokens.accessToken])

  return {
    tokens,
    isAuthenticated,
    loadTokens,
    setAuthTokens,
    clearAuthTokens,
  }
}
