"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { useRouter } from "next/navigation"

import Register from "@/components/auth/register"
import { register } from "@/services/account.service"

export default function RegisterPage() {
  const router = useRouter()
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

    // if (!acceptedTerms) {
    //   setErrorMessage("You must agree to the Terms & Conditions to continue.")
    //   return
    // }

    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      setErrorMessage("Please enter your first name, last name, and username.")
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        username: username.trim(),
        fullname,
        email,
        password,
      })
      router.push("/login")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred while registering user")
    } finally {
      setIsSubmitting(false)
    }
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
    />
  )
}