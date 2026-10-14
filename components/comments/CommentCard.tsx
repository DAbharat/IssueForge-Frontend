"use client"

import { Check, CornerDownLeft, Pencil, Trash2, X } from "lucide-react"
import { useState, type ReactNode } from "react"
import type { Attachment } from "@/services/attachments.service"

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
  commentId: string | number
  isAuthor?: boolean
  isEdited?: boolean
  attachments?: Attachment[]
  isUpdating?: boolean
  replyCount?: number
  isRepliesOpen?: boolean
  onToggleReplies?: () => void
  replyComposer?: ReactNode
  children?: ReactNode
  /** Called when the user clicks the Reply button */
  onReply?: () => void
  onEdit?: (commentId: string | number, content: string) => Promise<void>
  onDelete?: (commentId: string | number) => Promise<void>
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CommentCard({
  authorName,
  authorUsername,
  authorInitials,
  authorAvatar,
  content,
  relativeTime,
  commentId,
  isAuthor = false,
  isEdited = false,
  attachments = [],
  isUpdating = false,
  replyCount = 0,
  isRepliesOpen = false,
  onToggleReplies,
  replyComposer,
  children,
  onReply,
  onEdit,
  onDelete,
}: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)

  async function handleEdit() {
    if (!onEdit || editContent.trim().length < 3) return
    await onEdit(commentId, editContent)
    setIsEditing(false)
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 flex flex-col gap-2.5">
      {/* ── Header: avatar + author + time ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          {authorAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
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
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#94A3B8] shrink-0">{relativeTime}</span>
          {isAuthor && !isEditing && (
            <>
              <button type="button" aria-label="Edit comment" onClick={() => setIsEditing(true)} disabled={isUpdating} className="text-[#71717A] hover:text-[#E2E8F0] disabled:opacity-40">
                <Pencil className="h-3 w-3" />
              </button>
              <button type="button" aria-label="Delete comment" onClick={() => onDelete?.(commentId)} disabled={isUpdating} className="text-[#71717A] hover:text-red-400 disabled:opacity-40">
                <Trash2 className="h-3 w-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      {isEditing ? (
        <div className="space-y-2">
          <textarea value={editContent} onChange={(event) => setEditContent(event.target.value)} disabled={isUpdating} className="min-h-20 w-full resize-y rounded-md border border-[#27272A] bg-[#18181B] px-3 py-2 text-sm text-[#E2E8F0] outline-none focus:border-[#3F3F46]" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setEditContent(content); setIsEditing(false) }} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-[#94A3B8] hover:text-[#E2E8F0]"><X className="h-3 w-3" />Cancel</button>
            <button type="button" onClick={handleEdit} disabled={isUpdating || editContent.trim().length < 3} className="inline-flex items-center gap-1 rounded-md border border-[#3F3F46] bg-[#27272A] px-2 py-1 text-[11px] text-[#E2E8F0] disabled:opacity-40"><Check className="h-3 w-3" />Save</button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#E2E8F0]/90 leading-relaxed whitespace-pre-wrap break-words">
          {content} {isEdited && <span className="text-[11px] text-[#71717A]">(edited)</span>}
        </p>
      )}

      {attachments.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {attachments.map((attachment) => attachment.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={attachment.id} src={attachment.url} alt="Comment attachment" className="max-h-40 w-full rounded-md border border-[#27272A] object-cover" />
          ))}
        </div>
      )}

      {/* ── Reply ── */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onReply}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-[#94A3B8] transition-colors hover:bg-white/6 hover:text-[#E2E8F0]"
        >
          <CornerDownLeft className="h-3.5 w-3.5" />
          Reply
        </button>
        {replyCount > 0 && (
          <button
            type="button"
            onClick={onToggleReplies}
            className="rounded-md px-1.5 py-1 text-[11px] text-[#94A3B8] transition-colors hover:bg-white/6 hover:text-[#E2E8F0]"
          >
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </button>
        )}
      </div>

      {replyComposer}
      {isRepliesOpen && children && (
        <div className="ml-3 border-l border-[#27272A] pl-3 sm:ml-6 sm:pl-4">
          <div className="space-y-3">{children}</div>
        </div>
      )}
    </div>
  )
}
