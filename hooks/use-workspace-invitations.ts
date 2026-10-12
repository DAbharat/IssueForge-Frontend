"use client"

import { useCallback, useEffect, useState } from "react"
import {
    listPendingWorkspaceInvitationsForWorkspace,
    cancelInvitation,
    createWorkspaceInvitation,
    type WorkspaceInvitation,
} from "@/services/invitations.service"
import { listWorkspaceMembers, type WorkspaceMember } from "@/services/workspaceMembers.service"
import { type ProfileCardUser } from "@/components/profile/ProfileCard"

export type InvitationFilter = "pending" | "accepted" | "rejected"

export function useWorkspaceInvitations(workspaceId: string | number | null) {
    const [pendingInvitations, setPendingInvitations] = useState<WorkspaceInvitation[]>([])
    const [acceptedMembers, setAcceptedMembers] = useState<WorkspaceMember[]>([])
    const [rejectedInvitations, setRejectedInvitations] = useState<WorkspaceInvitation[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [cancellingId, setCancellingId] = useState<string | number | null>(null)
    const [invitingId, setInvitingId] = useState<string | number | null>(null)

    const storageKey = workspaceId ? `issueforge:rejected_invites:${workspaceId}` : null

    // Load persisted rejected invitations from localStorage
    const loadPersistedRejected = useCallback(() => {
        if (!storageKey || typeof window === "undefined") return []
        try {
            const raw = localStorage.getItem(storageKey)
            if (raw) {
                const parsed = JSON.parse(raw)
                if (Array.isArray(parsed)) return parsed
            }
        } catch {
            // Ignore parse errors
        }
        return []
    }, [storageKey])

    const savePersistedRejected = useCallback(
        (items: WorkspaceInvitation[]) => {
            if (!storageKey || typeof window === "undefined") return
            try {
                localStorage.setItem(storageKey, JSON.stringify(items))
            } catch {
                // Ignore storage errors
            }
        },
        [storageKey]
    )

    const fetchInvitationsData = useCallback(async () => {
        if (!workspaceId) {
            setPendingInvitations([])
            setAcceptedMembers([])
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const [pendingList, membersList] = await Promise.all([
                listPendingWorkspaceInvitationsForWorkspace(workspaceId).catch(() => []),
                listWorkspaceMembers(workspaceId).catch(() => []),
            ])

            setPendingInvitations(Array.isArray(pendingList) ? pendingList : [])
            setAcceptedMembers(Array.isArray(membersList) ? membersList : [])

            // Load rejected items
            const persisted = loadPersistedRejected()
            setRejectedInvitations(persisted)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load invitations.")
        } finally {
            setIsLoading(false)
        }
    }, [workspaceId, loadPersistedRejected])

    useEffect(() => {
        fetchInvitationsData()
    }, [fetchInvitationsData])

    // Cancel a pending invitation (moves from pending to rejected)
    const cancelInvite = useCallback(
        async (invitationId: string | number, user?: ProfileCardUser) => {
            setCancellingId(invitationId)
            setError(null)

            try {
                await cancelInvitation(invitationId)

                // Locate the pending record
                const existing = pendingInvitations.find((i) => String(i.id) === String(invitationId))

                // Remove from pending
                setPendingInvitations((prev) => prev.filter((i) => String(i.id) !== String(invitationId)))

                // Create a record for rejected list
                const rejectedRecord: WorkspaceInvitation = {
                    id: invitationId,
                    workspace_id: workspaceId || "",
                    invited_user_id: existing?.invited_user_id ?? user?.id,
                    fullname: existing?.fullname ?? user?.fullname,
                    username: existing?.username ?? user?.username,
                    status: "CANCELLED",
                    created_at: existing?.created_at ?? (user?.created_at ? String(user.created_at) : new Date().toISOString()),
                    responded_at: new Date().toISOString(),
                }

                setRejectedInvitations((prev) => {
                    const filtered = prev.filter((i) => String(i.invited_user_id) !== String(rejectedRecord.invited_user_id))
                    const updated = [rejectedRecord, ...filtered]
                    savePersistedRejected(updated)
                    return updated
                })

                return true
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to cancel invitation."
                setError(message)
                throw err
            } finally {
                setCancellingId(null)
            }
        },
        [pendingInvitations, workspaceId, savePersistedRejected]
    )

    // Re-invite a user (e.g. from rejected list)
    const reInvite = useCallback(
        async (userId: string | number) => {
            if (!workspaceId) return false
            setInvitingId(userId)
            setError(null)

            try {
                const created = await createWorkspaceInvitation(workspaceId, { user_id: userId })

                // Remove from rejected if it was there
                setRejectedInvitations((prev) => {
                    const updated = prev.filter((i) => String(i.invited_user_id) !== String(userId))
                    savePersistedRejected(updated)
                    return updated
                })

                // Add to pending
                setPendingInvitations((prev) => [created, ...prev])

                return true
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to send invitation."
                setError(message)
                throw err
            } finally {
                setInvitingId(null)
            }
        },
        [workspaceId, savePersistedRejected]
    )

    return {
        pendingInvitations,
        acceptedMembers,
        rejectedInvitations,
        isLoading,
        error,
        cancellingId,
        invitingId,
        cancelInvite,
        reInvite,
        refetch: fetchInvitationsData,
    }
}
