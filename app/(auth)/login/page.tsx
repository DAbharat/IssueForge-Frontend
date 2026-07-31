"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { useRouter } from "next/navigation"

import Login from "@/components/auth/login"
import { login } from "@/services/account.service"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)

    try {
      const result = await login({
        email,
        password,
      })

      if (typeof window !== "undefined") {
        window.localStorage.setItem("accessToken", result.accessToken)
      }

      router.push("/")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred while logging in user")
    } finally {
      setIsSubmitting(false)
    }
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
    />
  )
}