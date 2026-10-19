"use client"

import { useCallback, useEffect, useState } from "react"
import {
  acceptInvitation,
  declineInvitation,
  listPendingWorkspaceInvitations,
  type WorkspaceInvitation,
} from "@/services/invitations.service"
import { toast } from "@/components/ui/toast"

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
    const isAccept = action === acceptInvitation
    const target = invitations.find((inv) => String(inv.id) === String(invitationId))
    const wsName = target?.workspace_name ? `"${target.workspace_name}"` : "the workspace"

    try {
      await action(invitationId)
      setInvitations((current) => current.filter((invitation) => String(invitation.id) !== String(invitationId)))
      if (isAccept) {
        toast.success("Invitation accepted", `You have successfully joined ${wsName}!`)
      } else {
        toast.info("Invitation declined", `Invitation to join ${wsName} was declined.`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update invitation"
      setError(message)
      toast.error(isAccept ? "Failed to accept invitation" : "Failed to decline invitation", message)
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
