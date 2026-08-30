"use client"

import { useEffect, useState } from "react"

import { useAuth } from "@/hooks/use-auth"
import { me } from "@/services/account.service"

type ProfileWorkspace = {
  id: string | number
  name: string
  role?: string
  created_at?: string
}

type ProfileUser = {
  id?: string | number
  fullname?: string
  username?: string
  created_at?: string
  workspaces?: ProfileWorkspace[]
}

export function useProfile() {
  const { loadTokens } = useAuth()
  const [profile, setProfile] = useState<ProfileUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const { accessToken } = loadTokens()

    if (!accessToken) {
      setError("Please log in to view your profile.")
      setIsLoading(false)
      return
    }

    let isMounted = true

    async function loadProfile() {
      try {
        const user = await me()

        if (!isMounted) return
        setProfile(user)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : "Unable to load profile")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [loadTokens])

  return { profile, isLoading, error }
}
