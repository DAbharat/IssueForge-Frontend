"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import { handleGoogleCallback } from "@/services/account.service"
import { toast } from "@/components/ui/toast"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuthTokens } = useAuth()
  const [errorStatus, setErrorStatus] = useState<string | null>(null)

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

    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!code || !state) {
      const msg = "Invalid or missing OAuth authorization parameters."
      setErrorStatus(msg)
      toast.error("Sign in failed", msg)
      router.push("/login")
      return
    }

    handleGoogleCallback(code, state)
      .then((result) => {
        const accessToken = result.accessToken ?? result.access_token
        const refreshToken = result.refreshToken ?? result.refresh_token

        setAuthTokens({
          accessToken,
          refreshToken,
        })

        toast.success("Welcome!", "Signed in with Google successfully.")
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
