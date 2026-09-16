"use client"

import { CornerDownLeft } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type CommentCardProps = {
  /** Author's display name */
  authorName: string
  /** Author's username — shown as @handle */
  authorUsername: string
  /** Two-letter initials rendered inside the avatar circle */
  authorInitials: string
  /** Optional avatar image URL; falls back to initials when absent */
  authorAvatar?: string
  /** The comment body text */
  content: string
  /**
   * Pre-formatted relative time string.
   * The parent/hook is responsible for formatting (e.g. "1 hr ago", "2 days ago").
   * This component is purely presentational.
   */
  relativeTime: string
  /** Called when the user clicks the Reply button */
  onReply?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CommentCard({
  authorName,
  authorUsername,
  authorInitials,
  authorAvatar,
  content,
  relativeTime,
  onReply,
}: CommentCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 flex flex-col gap-2.5">
      {/* ── Header: avatar + author + time ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={authorName}
              className="h-7 w-7 rounded-full object-cover border border-white/10 shrink-0"
            />
          ) : (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-[10px] font-semibold text-[#E2E8F0] select-none">
              {authorInitials}
            </div>
          )}

          {/* Name + username */}
          <span className="text-xs font-semibold text-[#E2E8F0]">{authorName}</span>
          <span className="text-[11px] text-[#94A3B8]">@{authorUsername}</span>
        </div>

        {/* Time */}
        <span className="text-[11px] text-[#94A3B8] shrink-0">{relativeTime}</span>
      </div>

      {/* ── Content ── */}
      <p className="text-sm text-[#E2E8F0]/90 leading-relaxed whitespace-pre-wrap break-words">
        {content}
      </p>

      {/* ── Reply ── */}
      <div>
        <button
          type="button"
          onClick={onReply}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-[#94A3B8] transition-colors hover:bg-white/6 hover:text-[#E2E8F0]"
        >
          <CornerDownLeft className="h-3.5 w-3.5" />
          Reply
        </button>
      </div>
    </div>
  )
}
