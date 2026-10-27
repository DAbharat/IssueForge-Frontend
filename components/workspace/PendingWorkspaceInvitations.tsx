"use client"

import { Check, Mail, X } from "lucide-react"
import type { WorkspaceInvitation } from "@/services/invitations.service"
import { toast } from "@/components/ui/toast"

type PendingWorkspaceInvitationsProps = {
  invitations: WorkspaceInvitation[]
  isLoading?: boolean
  updatingId?: string | number | null
  error?: string | null
  onAccept: (invitationId: string | number) => Promise<void>
  onDecline: (invitationId: string | number) => Promise<void>
}

export default function PendingWorkspaceInvitations({
  invitations,
  isLoading = false,
  updatingId = null,
  error,
  onAccept,
  onDecline,
}: PendingWorkspaceInvitationsProps) {
  async function handleAccept(invitationId: string | number) {
    try {
      await onAccept(invitationId)
    } catch {
      // toast is dispatched by usePendingInvitations
    }
  }

  async function handleDecline(invitationId: string | number) {
    try {
      await onDecline(invitationId)
    } catch {
      // toast is dispatched by usePendingInvitations
    }
  }

  return (
    <section className="rounded-xl border border-[#27272A] bg-[#0E0E11] p-5">
      <div className="flex items-start gap-3">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#71717A]" />
        <div>
          <h2 className="text-base font-semibold text-[#E2E8F0]">Workspace invitations</h2>
          <p className="mt-1 text-xs leading-5 text-[#94A3B8]">Review invitations to join other workspaces.</p>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-5 text-xs text-[#71717A]">Loading invitations…</p>
      ) : error ? (
        <p className="mt-5 text-xs text-red-400">{error}</p>
      ) : invitations.length === 0 ? (
        <p className="mt-5 text-xs text-[#71717A]">You have no pending invitations.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {invitations.map((invitation) => {
            const isUpdating = updatingId !== null && String(updatingId) === String(invitation.id)
            const workspaceName = invitation.workspace_name ?? `Workspace #${invitation.workspace_id}`
            const inviter = invitation.inviter_fullname ?? invitation.inviter_username ?? invitation.invited_username

            return (
              <div key={invitation.id} className="flex flex-col gap-3 rounded-lg border border-[#27272A] bg-[#18181B] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#E2E8F0]">{workspaceName}</p>
                  {inviter && <p className="mt-1 text-xs text-[#94A3B8]">Invited by {inviter}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" disabled={isUpdating} onClick={() => handleDecline(invitation.id)} className="inline-flex items-center gap-1.5 rounded-md border border-[#27272A] bg-transparent px-3 py-2 text-xs font-medium text-[#94A3B8] transition-colors hover:border-red-500/30 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"><X className="h-3.5 w-3.5" />Decline</button>
                  <button type="button" disabled={isUpdating} onClick={() => handleAccept(invitation.id)} className="inline-flex items-center gap-1.5 rounded-md border border-[#3F3F46] bg-[#27272A] px-3 py-2 text-xs font-medium text-[#E2E8F0] transition-colors hover:bg-[#3F3F46] disabled:cursor-not-allowed disabled:opacity-40"><Check className="h-3.5 w-3.5" />Accept</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
