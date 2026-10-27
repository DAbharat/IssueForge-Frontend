"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import { exchangeHandoff, handleGoogleCallback } from "@/services/account.service"
import { toast } from "@/components/ui/toast"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuthTokens } = useAuth()
  const [errorStatus, setErrorStatus] = useState<string | null>(null)
  const executedCodeRef = useRef<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      const msg = errorParam === "access_denied"
        ? "Google sign-in was canceled."
        : "Google authorization was not completed."
      setErrorStatus(msg)
      toast.error("Sign in failed", msg)
      router.push("/login")
      return
    }

    // 1. Direct tokens from backend redirect
    const directAccessToken = searchParams.get("access_token") ?? searchParams.get("accessToken")
    const directRefreshToken = searchParams.get("refresh_token") ?? searchParams.get("refreshToken")

    if (directAccessToken) {
      setAuthTokens({
        accessToken: directAccessToken,
        refreshToken: directRefreshToken,
      })
      toast.success("Welcome back!", "Signed in with Google successfully.")
      router.push("/profile")
      return
    }

    // 2. Authorization code exchange or handoff code exchange
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!code) {
      const msg = "Invalid or missing authentication code."
      setErrorStatus(msg)
      toast.error("Sign in failed", msg)
      router.push("/login")
      return
    }

    // Prevent double execution in React StrictMode or concurrent re-renders
    if (executedCodeRef.current === code) {
      return
    }
    executedCodeRef.current = code

    // If state is present, fallback to direct Google code/state callback.
    // If only code is present (standard navigation handoff flow), exchange the handoff code.
    const exchangePromise = state
      ? handleGoogleCallback(code, state).then((res) => ({
          accessToken: res.accessToken ?? res.access_token,
          refreshToken: res.refreshToken ?? res.refresh_token,
        }))
      : exchangeHandoff(code).then((res) => ({
          accessToken: res.access_token,
          refreshToken: res.refresh_token,
        }))

    exchangePromise
      .then(({ accessToken, refreshToken }) => {
        if (!accessToken) {
          throw new Error("No access token received from authentication server")
        }

        setAuthTokens({
          accessToken,
          refreshToken: refreshToken ?? null,
        })

        toast.success("Welcome back!", "Signed in with Google successfully.")
        router.push("/profile")
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Failed to complete Google authentication"
        setErrorStatus(msg)
        toast.error("Google sign-in failed", msg)
        router.push("/login")
      })
  }, [searchParams, setAuthTokens, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#000000] px-4 text-[#E2E8F0]">
      <div className="flex flex-col items-center space-y-4 text-center">
        {!errorStatus ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-[#94A3B8]" />
            <h1 className="text-xl font-medium tracking-tight text-[#E2E8F0]">
              Authenticating with Google...
            </h1>
            <p className="text-sm text-[#94A3B8]">
              Please wait while we verify your account and set up your session.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-medium tracking-tight text-red-400">
              Authentication Error
            </h1>
            <p className="text-sm text-[#94A3B8]">{errorStatus}</p>
            <p className="text-xs text-[#64748B]">Redirecting to login...</p>
          </>
        )}
      </div>
    </main>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#000000] text-[#E2E8F0]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#94A3B8]" />
            <div className="text-sm text-[#94A3B8]">Loading authentication...</div>
          </div>
        </main>
      }
    >
      <CallbackContent />
    </Suspense>
  )
}
