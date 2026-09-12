"use client"

import React, { useState } from "react"
import { Search, UserPlus } from "lucide-react"

export type ProjectMemberItem = {
  id?: string | number
  fullname: string
  username: string
  role: string
  initials: string
  avatar?: string
}

type ProjectMembersProps = {
  members: ProjectMemberItem[]
  onAddMember?: () => void
}

export default function ProjectMembers({ members, onAddMember }: ProjectMembersProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMembers = members.filter(
    (member) =>
      member.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* ── Top Bar Controls: Add Button & Search Directory ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onAddMember}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <UserPlus className="h-4 w-4 text-zinc-400" />
          Add New Member
        </button>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search directory"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-4 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-700 focus:bg-zinc-900"
          />
        </div>
      </div>

      {/* ── Member Directory Grid ── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <div
            key={member.id ?? member.username}
            className="relative flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 backdrop-blur-sm transition-all hover:border-zinc-700 hover:bg-zinc-900"
          >
            {/* Avatar & User Details */}
            <div className="flex items-center gap-3 min-w-0 pr-2">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.fullname}
                  className="h-10 w-10 shrink-0 rounded-full object-cover border border-zinc-800"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-700/60 bg-zinc-800 text-xs font-semibold text-zinc-200">
                  {member.initials}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-zinc-100">
                  {member.fullname}
                </p>
                <p className="truncate text-[11px] text-zinc-500">
                  @{member.username}
                </p>
              </div>
            </div>

            {/* Role Badge */}
            <div className="shrink-0 text-right">
              <span className="text-[11px] font-medium text-zinc-400">
                Role: <span className="text-zinc-200">{member.role}</span>
              </span>
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-zinc-800 p-8 text-center text-xs text-zinc-500">
            No members found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}