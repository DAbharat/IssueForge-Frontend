"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type WorkspaceMemberDialogItem = {
  id?: string | number
  fullname: string
  username: string
  initials: string
  status?: "active" | "pending"
}

export type WorkspaceMembersDialogProps = {
  members: WorkspaceMemberDialogItem[]
  onClose: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WorkspaceMembersDialog({
  members,
  onClose,
}: WorkspaceMembersDialogProps) {
  const [search, setSearch] = useState("")

  const filtered = members.filter(
    (m) =>
      m.fullname.toLowerCase().includes(search.toLowerCase()) ||
      m.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
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
        <div className="max-h-[420px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#101012] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#27272A] hover:[&::-webkit-scrollbar-thumb]:bg-[#3F3F46]" style={{ scrollbarColor: "#27272A #101012", scrollbarWidth: "thin" }}>
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#52525B]">
              No members match your search.
            </div>
          ) : (
            <ul className="divide-y divide-[#18181B]">
              {filtered.map((member) => (
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
                    </p>
                    <p className="truncate text-[11px] text-[#71717A]">
                      @{member.username}
                    </p>
                  </div>

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
                </li>
              ))}
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
  )
}