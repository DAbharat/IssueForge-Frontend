"use client"

import React from "react"
import { UserPlus, X } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type ProfileCardUser = {
  id?: string | number
  fullname?: string
  username?: string
  email?: string
  created_at?: string | Date
  createdAt?: string | Date
  avatar?: string
  initials?: string
  role?: string
}

export type ProfileCardProps = {
  /** User data object */
  user?: ProfileCardUser

  /** Direct user attributes */
  id?: string | number
  fullname?: string
  username?: string
  created_at?: string | Date
  createdAt?: string | Date
  avatar?: string
  initials?: string

  /** Whether the viewer has admin/owner rights in the active workspace */
  isAdmin?: boolean
  /** Active viewer's role in the workspace (e.g. "admin", "owner", "member") */
  currentUserRole?: string

  /** Whether the user is already a member of the active workspace */
  isAlreadyMember?: boolean
  isInWorkspace?: boolean

  /** Whether this card represents the currently logged-in user */
  isCurrentUser?: boolean
  currentUserId?: string | number

  /** Callback when the "Send invite" action is triggered */
  onInvite?: (user?: ProfileCardUser) => void
  onSendInvite?: (user?: ProfileCardUser) => void

  /** Loading state during invitation dispatch */
  isInviting?: boolean

  /** Custom tooltip text (defaults to "Send invite") */
  tooltipLabel?: string

  /** Whether there is a pending invitation sent to this user */
  isPendingInvite?: boolean

  /** Callback when "Cancel invite" action is triggered */
  onCancelInvite?: (user?: ProfileCardUser) => void

  /** Loading state during invitation cancellation */
  isCancelling?: boolean

  /** Custom tooltip text for cancellation (defaults to "Cancel invitation") */
  cancelTooltipLabel?: string

  /** Optional status badge component to display alongside user name */
  badge?: React.ReactNode

  /** Optional card click handler */
  onClick?: () => void

  className?: string
}

function getInitials(name?: string, fallback = "U") {
  if (!name) return fallback
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return fallback
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function formatCreatedAt(dateInput?: string | Date) {
  if (!dateInput) return null
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    if (Number.isNaN(date.getTime())) return null
    return `Joined ${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`
  } catch {
    return null
  }
}

export default function ProfileCard({
  user,
  id,
  fullname,
  username,
  created_at,
  createdAt,
  avatar,
  initials,
  isAdmin = false,
  currentUserRole,
  isAlreadyMember = false,
  isInWorkspace = false,
  isCurrentUser = false,
  currentUserId,
  onInvite,
  onSendInvite,
  isInviting = false,
  tooltipLabel = "Send invite",
  isPendingInvite = false,
  onCancelInvite,
  isCancelling = false,
  cancelTooltipLabel = "Cancel invitation",
  badge,
  onClick,
  className = "",
}: ProfileCardProps) {
  const resolvedId = user?.id ?? id
  const resolvedFullname = (user?.fullname ?? fullname ?? "User").trim()
  const rawUsername = user?.username ?? username ?? ""
  const resolvedUsername = rawUsername ? rawUsername.replace(/^@/, "") : ""
  const resolvedCreatedAt = user?.created_at ?? user?.createdAt ?? created_at ?? createdAt
  const resolvedAvatar = user?.avatar ?? avatar
  const resolvedInitials =
    user?.initials ??
    initials ??
    getInitials(resolvedFullname, resolvedUsername || "U")

  const formattedDate = formatCreatedAt(resolvedCreatedAt)

  // Visibility rules for actions:
  // 1. Must be a workspace admin (isAdmin is true or currentUserRole is admin/owner)
  // 2. Must not already be a member of the workspace
  // 3. Must not be the admin themselves (current user)
  const isViewerAdmin = Boolean(
    isAdmin ||
      (currentUserRole &&
        ["admin", "owner"].includes(currentUserRole.toLowerCase()))
  )

  const isMember = Boolean(isAlreadyMember || isInWorkspace)

  const isSelf = Boolean(
    isCurrentUser ||
      (currentUserId !== undefined &&
        resolvedId !== undefined &&
        String(resolvedId) === String(currentUserId))
  )

  const showCancelButton = isViewerAdmin && !isMember && !isSelf && Boolean(isPendingInvite)
  const showInviteButton = isViewerAdmin && !isMember && !isSelf && !isPendingInvite

  const handleInvite = (e: React.MouseEvent) => {
    e.stopPropagation()
    const payload = user ?? {
      id: resolvedId,
      fullname: resolvedFullname,
      username: resolvedUsername,
      created_at: resolvedCreatedAt,
    }
    onInvite?.(payload)
    onSendInvite?.(payload)
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    const payload = user ?? {
      id: resolvedId,
      fullname: resolvedFullname,
      username: resolvedUsername,
      created_at: resolvedCreatedAt,
    }
    onCancelInvite?.(payload)
  }

  return (
    <article
      onClick={onClick}
      className={[
        "group relative flex w-full items-center justify-between rounded-xl border border-[#27272A] bg-[#101012] p-4 text-[#E2E8F0] transition-all hover:border-[#3F3F46] hover:bg-[#18181B]",
        onClick ? "cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Left & Center: Circle avatar + user metadata ── */}
      <div className="flex min-w-0 flex-1 items-center gap-3.5 pr-3">
        {resolvedAvatar ? (
          <img
            src={resolvedAvatar}
            alt={resolvedFullname}
            className="h-11 w-11 shrink-0 rounded-full border border-[#27272A] object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#27272A] bg-[#DDE1E5] text-xs font-semibold text-[#000000] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] sm:text-sm">
            {resolvedInitials}
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="truncate text-sm font-semibold tracking-tight text-[#E2E8F0]">
              {resolvedFullname}
            </p>
            {badge}
          </div>

          {resolvedUsername ? (
            <p className="truncate text-xs font-normal text-[#94A3B8]">
              @{resolvedUsername}
            </p>
          ) : null}

          {formattedDate ? (
            <p className="truncate text-[11px] font-normal text-[#71717A]">
              {formattedDate}
            </p>
          ) : null}
        </div>
      </div>

      {/* ── Right-most corner: Cancel invitation button (when pending) ── */}
      {showCancelButton && (
        <div className="shrink-0">
          <TooltipProvider delay={150}>
            <Tooltip>
              <TooltipTrigger
                type="button"
                onClick={handleCancel}
                disabled={isCancelling}
                aria-label={cancelTooltipLabel}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#27272A] bg-[#18181B] text-[#94A3B8] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCancelling ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#27272A] border-t-red-500" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </TooltipTrigger>
              <TooltipContent side="top">
                <span>{cancelTooltipLabel}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* ── Right-most corner: Send invite button with Tooltip ── */}
      {showInviteButton && (
        <div className="shrink-0">
          <TooltipProvider delay={150}>
            <Tooltip>
              <TooltipTrigger
                type="button"
                onClick={handleInvite}
                disabled={isInviting}
                aria-label={tooltipLabel}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#27272A] bg-[#18181B] text-[#94A3B8] transition-colors hover:border-[#3F3F46] hover:bg-[#27272A] hover:text-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#5E6AD2] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isInviting ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#27272A] border-t-[#5E6AD2]" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
              </TooltipTrigger>
              <TooltipContent side="top">
                <span>{tooltipLabel}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </article>
  )
}