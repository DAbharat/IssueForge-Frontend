"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MoreHorizontal, Search, ShieldCheck, Trash2, X } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

// ─── Types ────────────────────────────────────────────────────────────────────

export type WorkspaceMemberDialogItem = {
  id?: string | number
  user_id?: string | number
  fullname: string
  username: string
  initials: string
  role?: string
  status?: "active" | "pending"
}

export type WorkspaceMembersDialogProps = {
  members: WorkspaceMemberDialogItem[]
  onClose: () => void
  /** Whether the currently-logged-in user has admin/owner rights in this workspace */
  isAdmin?: boolean
  /** The id of the currently-logged-in user — their row will not show the menu */
  currentUserId?: string | number
  /** Show a loading spinner instead of the member list */
  isLoading?: boolean
  /** Called when the admin confirms "Promote to Admin" */
  onPromote?: (member: WorkspaceMemberDialogItem) => Promise<void>
  /** Called when the admin confirms "Remove Member" */
  onRemove?: (member: WorkspaceMemberDialogItem) => Promise<void>
}

// ─── MemberRowMenu ─────────────────────────────────────────────────────────────
// The "..." button and its dropdown for a single member row.

type MemberRowMenuProps = {
  member: WorkspaceMemberDialogItem
  isAlreadyAdmin: boolean
  onPromoteClick: () => void
  onRemoveClick: () => void
}

function MemberRowMenu({ member, isAlreadyAdmin, onPromoteClick, onRemoveClick }: MemberRowMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onOutside)
    return () => document.removeEventListener("mousedown", onOutside)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-label={`Actions for ${member.fullname}`}
        onClick={() => setOpen((p) => !p)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-[#52525B] transition-colors hover:bg-[#27272A] hover:text-[#E2E8F0] focus:outline-none"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[170px] overflow-hidden rounded-lg border border-[#27272A] bg-[#101012] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <button
            type="button"
            disabled={isAlreadyAdmin}
            onClick={() => {
              if (isAlreadyAdmin) return
              setOpen(false)
              onPromoteClick()
            }}
            className={[
              "flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors",
              isAlreadyAdmin
                ? "cursor-not-allowed text-[#3F3F46]"
                : "text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#E2E8F0]",
            ].join(" ")}
          >
            <ShieldCheck className={["h-3.5 w-3.5", isAlreadyAdmin ? "text-[#3F3F46]" : "text-[#DDE1E5]"].join(" ")} />
            Promote to Admin
            {isAlreadyAdmin && (
              <span className="ml-auto text-[9px] text-[#3F3F46]">Already admin</span>
            )}
          </button>
          <div className="mx-2 my-0.5 border-t border-[#27272A]" />
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onRemoveClick()
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-[#F87171] transition-colors hover:bg-[#18181B] hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove Member
          </button>
        </div>
      )}
    </div>
  )
}

// ─── ConfirmDialog ──────────────────────────────────────────────────────────────

type ConfirmDialogProps = {
  title: string
  description: string
  confirmLabel: string
  confirmVariant?: "danger" | "primary"
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({
  title,
  description,
  confirmLabel,
  confirmVariant = "primary",
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onCancel()
      }}
    >
      <div className="w-full max-w-sm rounded-xl border border-[#27272A] bg-[#101012] shadow-2xl">
        <div className="border-b border-[#27272A] px-5 py-4">
          <p className="text-sm font-semibold text-[#E2E8F0]">{title}</p>
        </div>

        <div className="px-5 py-4">
          <p className="text-xs leading-relaxed text-[#94A3B8]">{description}</p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#27272A] px-5 py-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-md border border-[#27272A] bg-transparent px-4 py-2 text-xs font-medium text-[#94A3B8] transition-colors hover:border-[#3F3F46] hover:text-[#E2E8F0] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={[
              "inline-flex items-center justify-center rounded-md px-4 py-2 text-xs font-semibold transition-colors disabled:opacity-50",
              confirmVariant === "danger"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-[#DDE1E5] text-black hover:bg-[#DDE1E5]/90 hover:text-black",
            ].join(" ")}
          >
            {isLoading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── WorkspaceMembersDialog ─────────────────────────────────────────────────────

type PendingAction =
  | { type: "promote"; member: WorkspaceMemberDialogItem }
  | { type: "remove"; member: WorkspaceMemberDialogItem }

export default function WorkspaceMembersDialog({
  members,
  onClose,
  isAdmin = false,
  currentUserId,
  isLoading = false,
  onPromote,
  onRemove,
}: WorkspaceMembersDialogProps) {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [isActioning, setIsActioning] = useState(false)

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    if (!q) return members
    return members.filter(
      (m) =>
        m.fullname.toLowerCase().includes(q) ||
        m.username.toLowerCase().includes(q)
    )
  }, [members, debouncedSearch])

  async function handleConfirm() {
    if (!pendingAction) return
    setIsActioning(true)

    try {
      if (pendingAction.type === "promote" && onPromote) {
        await onPromote(pendingAction.member)
      } else if (pendingAction.type === "remove" && onRemove) {
        await onRemove(pendingAction.member)
      }
      setPendingAction(null)
    } finally {
      setIsActioning(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget && !pendingAction) onClose()
        }}
      >
        <div className="w-full max-w-lg rounded-xl border border-[#27272A] bg-[#101012] shadow-2xl">

          {/* ── Header ── */}
          <div className="flex items-center justify-between border-b border-[#27272A] px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-[#E2E8F0]">
                Workspace Members
              </p>
              <p className="mt-0.5 text-xs text-[#94A3B8]">
                {members.length} {members.length === 1 ? "member" : "members"} in this workspace
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#71717A] transition-colors hover:bg-[#18181B] hover:text-[#E2E8F0]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── Search ── */}
          <div className="border-b border-[#27272A] px-5 py-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#52525B]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members…"
                autoFocus
                className="w-full rounded-md border border-[#27272A] bg-[#18181B] py-2 pl-8 pr-3 text-xs text-[#E2E8F0] placeholder:text-[#52525B] outline-none transition-colors focus:border-[#3F3F46]"
              />
            </div>
          </div>

          {/* ── Member List ── */}
          <div
            className="max-h-[420px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#101012] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#27272A] hover:[&::-webkit-scrollbar-thumb]:bg-[#3F3F46]"
            style={{ scrollbarColor: "#27272A #101012", scrollbarWidth: "thin" }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#27272A] border-t-[#DDE1E5]" />
                <p className="text-xs text-[#52525B]">Loading members…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#52525B]">
                No members match your search.
              </div>
            ) : (
              <ul className="divide-y divide-[#18181B]">
                {filtered.map((member) => {
                  const memberId = member.user_id ?? member.id
                  const isSelf = currentUserId !== undefined && String(memberId) === String(currentUserId)
                  const isElevated = (member.role ?? "").toLowerCase() === "admin" || (member.role ?? "").toLowerCase() === "owner"
                  const showMenu = isAdmin && !isSelf && !isElevated

                  return (
                    <li
                      key={member.id ?? member.username}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[#18181B]"
                    >
                      {/* Avatar */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#000] bg-[#DDE1E5] text-xs font-semibold text-[#000] shadow-[0_0_0_2px_rgba(0,0,0,0.8)]">
                        {member.initials}
                      </div>

                      {/* Name / username */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-[#E2E8F0]">
                          {member.fullname}
                          {isSelf && (
                            <span className="ml-1.5 text-[10px] font-normal text-[#52525B]">(you)</span>
                          )}
                        </p>
                        <p className="truncate text-[11px] text-[#71717A]">
                          @{member.username}
                        </p>
                      </div>

                      {/* Role badge — indigo tint for admin/owner, neutral for regular members */}
                      {(() => {
                        const r = (member.role || "MEMBER").toLowerCase()
                        const isElevated = r === "admin" || r === "owner"
                        return (
                          <span
                            className={[
                              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                              isElevated
                                ? "border border-[#DDE1E5]/40 bg-[#DDE1E5]/10 text-[#DDE1E5]"
                                : "border border-[#27272A] bg-transparent text-[#52525B]",
                            ].join(" ")}
                          >
                            {member.role || "MEMBER"}
                          </span>
                        )
                      })()}

                      {/* Status badge */}
                      <span
                        className={[
                          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                          member.status === "pending"
                            ? "bg-[#27272A] text-[#94A3B8]"
                            : "bg-[#1A2B1A] text-[#4ADE80]",
                        ].join(" ")}
                      >
                        {member.status === "pending" ? "Pending" : "Active"}
                      </span>

                      {/* ··· Actions menu (admin only, not for self) */}
                      {showMenu && (
                        <MemberRowMenu
                          member={member}
                          isAlreadyAdmin={(() => {
                            const r = (member.role ?? "").toLowerCase()
                            return r === "admin" || r === "owner"
                          })()}
                          onPromoteClick={() => setPendingAction({ type: "promote", member })}
                          onRemoveClick={() => setPendingAction({ type: "remove", member })}
                        />
                      )}

                      {/* Placeholder spacer for non-admin / self rows to keep layout consistent */}
                      {!showMenu && isAdmin && (
                        <div className="h-7 w-7 shrink-0" />
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>


          {/* ── Footer ── */}
          <div className="flex justify-end border-t border-[#27272A] px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md border border-[#27272A] bg-transparent px-4 py-2 text-xs font-medium text-[#94A3B8] transition-colors hover:border-[#3F3F46] hover:text-[#E2E8F0]"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* ── Confirm Alert Dialog ── */}
      {pendingAction && (
        <ConfirmDialog
          title={
            pendingAction.type === "promote"
              ? `Promote ${pendingAction.member.fullname}?`
              : `Remove ${pendingAction.member.fullname}?`
          }
          description={
            pendingAction.type === "promote"
              ? `Are you sure you want to promote @${pendingAction.member.username} to Admin? They will gain full administrative access to this workspace.`
              : `Are you sure you want to remove @${pendingAction.member.username} from this workspace? This action cannot be undone.`
          }
          confirmLabel={pendingAction.type === "promote" ? "Yes, Promote" : "Yes, Remove"}
          confirmVariant={pendingAction.type === "remove" ? "danger" : "primary"}
          isLoading={isActioning}
          onConfirm={handleConfirm}
          onCancel={() => {
            if (!isActioning) {
              setPendingAction(null)
            }
          }}
        />
      )}
    </>
  )
}