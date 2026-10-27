"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import Login from "@/components/auth/login"
import { useAuth } from "@/hooks/use-auth"
import { login, getGoogleOAuthUrl, handleGoogleCallback, exchangeHandoff } from "@/services/account.service"
import { toast } from "@/components/ui/toast"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuthTokens } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const executedCodeRef = useRef<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      const msg = errorParam === "access_denied"
        ? "Google sign-in was canceled."
        : "Google sign-in was not completed."
      setErrorMessage(msg)
      toast.error("Sign in failed", msg)
      return
    }

    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (code) {
      if (executedCodeRef.current === code) {
        return
      }
      executedCodeRef.current = code

      setIsSubmitting(true)

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
          const msg = err instanceof Error ? err.message : "Google sign-in failed"
          setErrorMessage(msg)
          toast.error("Google sign-in failed", msg)
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    }
  }, [searchParams, setAuthTokens, router])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)

    try {
      const result = await login({
        email,
        password,
      })

      const accessToken = result.accessToken ?? result.access_token
      const refreshToken = result.refreshToken ?? result.refresh_token

      setAuthTokens({
        accessToken,
        refreshToken,
      })

      toast.success("Welcome back!", "Signed in successfully.")
      router.push("/profile")
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred while logging in user"
      setErrorMessage(message)
      toast.error("Sign in failed", message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleGoogleSignIn() {
    setIsSubmitting(true)
    window.location.href = getGoogleOAuthUrl()
  }

  return (
    <Login
      email={email}
      password={password}
      showPassword={showPassword}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onTogglePassword={() => setShowPassword((current) => !current)}
      onSubmit={handleSubmit}
      onGoogleSignIn={handleGoogleSignIn}
    />
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-[#000000] text-[#E2E8F0]">
        <div className="text-sm text-[#94A3B8]">Loading...</div>
      </main>
    }>
      <LoginContent />
    </Suspense>
  )
}