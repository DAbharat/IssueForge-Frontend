"use client"

import { useCallback, useEffect, useState } from "react"
import {
  acceptInvitation,
  declineInvitation,
  listPendingWorkspaceInvitations,
  type WorkspaceInvitation,
} from "@/services/invitations.service"

export function usePendingInvitations() {
  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      setInvitations(await listPendingWorkspaceInvitations())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load invitations")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  async function respond(invitationId: string | number, action: typeof acceptInvitation) {
    setUpdatingId(invitationId)
    setError(null)
    try {
      await action(invitationId)
      setInvitations((current) => current.filter((invitation) => String(invitation.id) !== String(invitationId)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update invitation")
      throw err
    } finally {
      setUpdatingId(null)
    }
  }

  return {
    invitations,
    isLoading,
    updatingId,
    error,
    accept: (id: string | number) => respond(id, acceptInvitation),
    decline: (id: string | number) => respond(id, declineInvitation),
    reload,
  }
}
