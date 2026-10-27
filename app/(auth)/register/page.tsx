"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { useRouter } from "next/navigation"

import Register from "@/components/auth/register"
import { register, getGoogleOAuthUrl } from "@/services/account.service"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/toast"

export default function RegisterPage() {
  const router = useRouter()
  const { clearAuthTokens } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const fullname = `${firstName.trim()} ${lastName.trim()}`.trim()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")

    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      const msg = "Please enter your first name, last name, and username."
      setErrorMessage(msg)
      toast.warning("Missing required fields", msg)
      return
    }

    setIsSubmitting(true)

    try {
      clearAuthTokens()
      await register({
        username: username.trim(),
        fullname,
        email,
        password,
      })
      clearAuthTokens()
      toast.success("Account created", "Your account has been created. Please sign in.")
      router.push("/login")
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred while registering user"
      setErrorMessage(message)
      toast.error("Registration failed", message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleGoogleSignUp() {
    setIsSubmitting(true)
    window.location.href = getGoogleOAuthUrl()
  }

  return (
    <Register
      firstName={firstName}
      lastName={lastName}
      username={username}
      email={email}
      password={password}
      acceptedTerms={acceptedTerms}
      showPassword={showPassword}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      onFirstNameChange={setFirstName}
      onLastNameChange={setLastName}
      onUsernameChange={setUsername}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onAcceptedTermsChange={setAcceptedTerms}
      onTogglePassword={() => setShowPassword((current) => !current)}
      onSubmit={handleSubmit}
      onGoogleSignUp={handleGoogleSignUp}
    />
  )
}