"use client"

import React, { useMemo, useState } from "react"
import { Check, ChevronDown, Clock, Search, UserCheck, UserX, X } from "lucide-react"

import ProfileCard, { type ProfileCardUser } from "@/components/profile/ProfileCard"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type WorkspaceInvitation } from "@/services/invitations.service"
import { type WorkspaceMember } from "@/services/workspaceMembers.service"
import { useDebounce } from "@/hooks/use-debounce"
import { toast } from "@/components/ui/toast"

type PendingCancel = {
  invitationId: string | number
  user?: ProfileCardUser
}

export type InvitationTabFilter = "pending" | "accepted" | "rejected"

type WorkspaceInvitationsProps = {
  workspaceId: string | number | null
  isAdmin?: boolean
  currentUserId?: string | number
  currentUsername?: string
  pendingInvitations: WorkspaceInvitation[]
  acceptedMembers: WorkspaceMember[]
  rejectedInvitations: WorkspaceInvitation[]
  isLoading?: boolean
  cancellingId?: string | number | null
  invitingId?: string | number | null
  onCancelInvite: (invitationId: string | number, user?: ProfileCardUser) => Promise<boolean | void>
  onReInvite: (userId: string | number) => Promise<boolean | void>
}

export default function WorkspaceInvitations({
  workspaceId,
  isAdmin = false,
  currentUserId,
  currentUsername,
  pendingInvitations,
  acceptedMembers,
  rejectedInvitations,
  isLoading = false,
  cancellingId = null,
  invitingId = null,
  onCancelInvite,
  onReInvite,
}: WorkspaceInvitationsProps) {
  const [filter, setFilter] = useState<InvitationTabFilter>("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedQuery = useDebounce(searchQuery, 300)
  const [pendingCancel, setPendingCancel] = useState<PendingCancel | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  async function handleConfirmCancel() {
    if (!pendingCancel) return
    setIsConfirming(true)
    try {
      await onCancelInvite(pendingCancel.invitationId, pendingCancel.user)
    } catch {
      // toast is dispatched by useWorkspaceInvitations hook
    } finally {
      setIsConfirming(false)
      setPendingCancel(null)
    }
  }

  // Filtered lists based on debounced search query
  const query = debouncedQuery.trim().toLowerCase()

  const filteredPending = useMemo(() => {
    if (!query) return pendingInvitations
    return pendingInvitations.filter((inv) => {
      const name = (inv.fullname || "").toLowerCase()
      const username = (inv.username || "").toLowerCase()
      return name.includes(query) || username.includes(query)
    })
  }, [pendingInvitations, query])

  // Accepted members who were invited (excludes the current admin themselves)
  const acceptedInvitedMembers = useMemo(() => {
    return acceptedMembers.filter((m) => {
      const memberId = m.user_id ?? m.id
      if (
        currentUserId !== undefined &&
        memberId !== undefined &&
        String(memberId) === String(currentUserId)
      ) {
        return false
      }
      if (
        currentUsername &&
        m.username &&
        m.username.toLowerCase() === currentUsername.toLowerCase()
      ) {
        return false
      }
      return true
    })
  }, [acceptedMembers, currentUserId, currentUsername])

  const filteredAccepted = useMemo(() => {
    if (!query) return acceptedInvitedMembers
    return acceptedInvitedMembers.filter((m) => {
      const name = (m.fullname || "").toLowerCase()
      const username = (m.username || "").toLowerCase()
      return name.includes(query) || username.includes(query)
    })
  }, [acceptedInvitedMembers, query])

  const filteredRejected = useMemo(() => {
    if (!query) return rejectedInvitations
    return rejectedInvitations.filter((inv) => {
      const name = (inv.fullname || "").toLowerCase()
      const username = (inv.username || "").toLowerCase()
      return name.includes(query) || username.includes(query)
    })
  }, [rejectedInvitations, query])

  const currentCount =
    filter === "pending"
      ? filteredPending.length
      : filter === "accepted"
      ? filteredAccepted.length
      : filteredRejected.length

  const filterLabels: Record<InvitationTabFilter, string> = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
  }

  const totalCount =
    pendingInvitations.length + acceptedInvitedMembers.length + rejectedInvitations.length

  return (
    <div className="space-y-4">
      {/* ── Top Card Container ── */}
      <div className="rounded-xl border border-[#27272A] bg-[#0E0E11] p-5 shadow-sm">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#E2E8F0]">
              Invitations
            </h2>
            <p className="mt-0.5 text-xs text-[#94A3B8]">
              Manage invitations sent to prospective and current workspace collaborators.
            </p>
          </div>

          <div className="mt-2 flex items-center gap-2 sm:mt-0">
            <span className="rounded-md border border-[#27272A] bg-[#18181B] px-2.5 py-1 text-xs text-[#94A3B8]">
              Total:{" "}
              <strong className="text-[#E2E8F0]">
                {totalCount}
              </strong>
            </span>
          </div>
        </div>

        {/* ── Filter Bar: Search + Shadcn Dropdown Filter ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${filterLabels[filter].toLowerCase()} invitations…`}
              className="h-9 w-full rounded-lg border border-[#27272A] bg-[#101012] pl-9 pr-8 text-xs text-[#E2E8F0] placeholder:text-[#71717A] transition-colors focus:border-[#3F3F46] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#E2E8F0]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Shadcn Dropdown Filter */}
          <div className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex h-9 items-center justify-between gap-2.5 rounded-lg border border-[#27272A] bg-[#101012] px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46] hover:bg-[#18181B] focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#71717A]">Filter:</span>
                  <span className="font-semibold">{filterLabels[filter]}</span>
                  <span className="rounded bg-[#18181B] px-1.5 py-0.2 text-[10px] text-[#94A3B8]">
                    {currentCount}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[#71717A]" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="min-w-[170px] rounded-lg border border-[#27272A] bg-[#101012] p-1 text-[#E2E8F0] shadow-xl"
              >
                {/* Pending */}
                <DropdownMenuItem
                  onClick={() => setFilter("pending")}
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-[#E2E8F0] hover:bg-[#18181B]"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#71717A]">
                      ({pendingInvitations.length})
                    </span>
                    {filter === "pending" && (
                      <Check className="h-3.5 w-3.5 text-amber-400" />
                    )}
                  </div>
                </DropdownMenuItem>

                {/* Accepted */}
                <DropdownMenuItem
                  onClick={() => setFilter("accepted")}
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-[#E2E8F0] hover:bg-[#18181B]"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Accepted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#71717A]">
                      ({acceptedInvitedMembers.length})
                    </span>
                    {filter === "accepted" && (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    )}
                  </div>
                </DropdownMenuItem>

                {/* Rejected */}
                <DropdownMenuItem
                  onClick={() => setFilter("rejected")}
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-[#E2E8F0] hover:bg-[#18181B]"
                >
                  <div className="flex items-center gap-2">
                    <UserX className="h-3.5 w-3.5 text-red-400" />
                    <span>Rejected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#71717A]">
                      ({rejectedInvitations.length})
                    </span>
                    {filter === "rejected" && (
                      <Check className="h-3.5 w-3.5 text-red-400" />
                    )}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* ── Content View ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#27272A] bg-[#0E0E11] py-16 text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#27272A] border-t-[#DDE1E5]" />
          <p className="mt-3 text-xs text-[#94A3B8]">Loading workspace invitations…</p>
        </div>
      ) : filter === "pending" ? (
        filteredPending.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#27272A] bg-[#0E0E11] py-16 text-center">
            <Clock className="h-8 w-8 text-[#27272A]" />
            <h3 className="mt-3 text-sm font-medium text-[#E2E8F0]">No pending invitations</h3>
            <p className="mt-1 max-w-sm text-xs text-[#71717A]">
              Invitations you send to new members will appear here until they accept or decline.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredPending.map((inv) => (
              <ProfileCard
                key={inv.id}
                user={{
                  id: inv.invited_user_id ?? inv.id,
                  fullname: inv.fullname || inv.username || "Invited User",
                  username: inv.username,
                  created_at: inv.created_at,
                }}
                isAdmin={isAdmin}
                currentUserId={currentUserId}
                isPendingInvite={true}
                onCancelInvite={() => setPendingCancel({
                  invitationId: inv.id,
                  user: {
                    id: inv.invited_user_id,
                    fullname: inv.fullname,
                    username: inv.username,
                    created_at: inv.created_at,
                  },
                })}
                isCancelling={cancellingId === inv.id}
                cancelTooltipLabel="Cancel invitation"
                badge={
                  <span className="inline-flex items-center rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                    Pending
                  </span>
                }
              />
            ))}
          </div>
        )
      ) : filter === "accepted" ? (
        filteredAccepted.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#27272A] bg-[#0E0E11] py-16 text-center">
            <UserCheck className="h-8 w-8 text-[#27272A]" />
            <h3 className="mt-3 text-sm font-medium text-[#E2E8F0]">No accepted invitations</h3>
            <p className="mt-1 max-w-sm text-xs text-[#71717A]">
              When invited users accept their invitation, their profile cards will be listed here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredAccepted.map((member) => (
              <ProfileCard
                key={member.id ?? member.user_id}
                user={{
                  id: member.user_id ?? member.id,
                  fullname: member.fullname || member.username || "Member",
                  username: member.username,
                  created_at: member.joined_at || member.created_at,
                }}
                isAdmin={isAdmin}
                isAlreadyMember={true}
                currentUserId={currentUserId}
                badge={
                  <span className="inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                    Accepted
                  </span>
                }
              />
            ))}
          </div>
        )
      ) : (
        /* filter === "rejected" */
        filteredRejected.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#27272A] bg-[#0E0E11] py-16 text-center">
            <UserX className="h-8 w-8 text-[#27272A]" />
            <h3 className="mt-3 text-sm font-medium text-[#E2E8F0]">No rejected invitations</h3>
            <p className="mt-1 max-w-sm text-xs text-[#71717A]">
              Invitations that were cancelled or declined will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredRejected.map((inv) => (
              <ProfileCard
                key={inv.id}
                user={{
                  id: inv.invited_user_id ?? inv.id,
                  fullname: inv.fullname || inv.username || "User",
                  username: inv.username,
                  created_at: inv.created_at,
                }}
                isAdmin={isAdmin}
                currentUserId={currentUserId}
                isAlreadyMember={false}
                onInvite={async () => {
                  const uid = inv.invited_user_id ?? inv.id
                  if (uid !== undefined) {
                    try {
                      await onReInvite(uid)
                    } catch {
                      // toast handled by useWorkspaceInvitations
                    }
                  }
                }}
                isInviting={invitingId === (inv.invited_user_id ?? inv.id)}
                tooltipLabel="Re-send invitation"
                badge={
                  <span className="inline-flex items-center rounded-md border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
                    Rejected
                  </span>
                }
              />
            ))}
          </div>
        )
      )}
      {/* ── Cancel Invitation Confirmation Dialog ── */}
      <AlertDialog
        open={pendingCancel !== null}
        onOpenChange={(open) => {
          if (!open && !isConfirming) setPendingCancel(null)
        }}
      >
        <AlertDialogContent
          className="border border-[#27272A] bg-[#0E0E11] text-[#E2E8F0] shadow-2xl"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#E2E8F0]">
              Cancel invitation?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#94A3B8]">
              {pendingCancel?.user?.fullname || pendingCancel?.user?.username
                ? <>Are you sure you want to cancel the invitation for <span className="font-medium text-[#E2E8F0]">{pendingCancel.user?.fullname || pendingCancel.user?.username}</span>? They will no longer be able to join the workspace with this invitation.</>
                : "Are you sure you want to cancel this invitation? The invitee will no longer be able to join the workspace with this invitation."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t border-[#27272A] bg-[#09090B]">
            <AlertDialogCancel
              className="border border-[#27272A] bg-transparent text-[#94A3B8] hover:bg-[#18181B] hover:text-[#E2E8F0]"
              disabled={isConfirming}
            >
              Keep invitation
            </AlertDialogCancel>
            <button
              type="button"
              disabled={isConfirming}
              onClick={handleConfirmCancel}
              className="inline-flex h-9 items-center justify-center rounded-md border border-red-500/20 bg-red-500/10 px-4 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConfirming ? "Cancelling…" : "Yes, cancel invitation"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
