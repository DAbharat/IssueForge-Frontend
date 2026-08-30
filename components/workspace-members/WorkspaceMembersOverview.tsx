"use client"

import { ChevronDown, Plus, Search } from "lucide-react"

export type WorkspaceMemberOverviewItem = {
  id?: string | number
  fullname: string
  username?: string
  initials: string
  status?: "active" | "pending"
  isRecent?: boolean
}

export type WorkspaceMembersOverviewProps = {
  title?: string
  members: WorkspaceMemberOverviewItem[]
  activeCount?: number
  pendingCount?: number
  searchPlaceholder?: string
  onSearchChange?: (value: string) => void
  onStatusChange?: () => void
  onManageMembers?: () => void
}

export default function WorkspaceMembersOverview({
  title = "Members",
  members,
  activeCount = 0,
  pendingCount = 0,
  searchPlaceholder = "Search members...",
  onSearchChange,
  onStatusChange,
  onManageMembers,
}: WorkspaceMembersOverviewProps) {
  return (
    <section className="w-full rounded-xl border border-[#2A2F3A] bg-[#101419] p-5">
      {/* Header row: Title + Manage Button */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold leading-none tracking-[-0.03em] text-[#E2E8F0] sm:text-2xl">
          {title}
        </h2>

        <button
          type="button"
          onClick={onManageMembers}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-[#2A2F3A] bg-[#11151A] px-3 py-1.5 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3A4050] hover:bg-[#171C22]"
        >
          <span className="hidden sm:inline">Manage Workspace Members</span>
          <span className="sm:hidden">Manage</span>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#3A4050] bg-[#1A1D24] text-[#E2E8F0]">
            <Plus className="h-3 w-3" />
          </span>
        </button>
      </div>

      {/* Control row: Search field + Active/Pending filter inline */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(event) => onSearchChange?.(event.target.value)}
            className="h-9 w-full rounded-md border border-[#2A2F3A] bg-[#101419] pl-8 pr-3 text-sm text-[#E2E8F0] placeholder:text-[#94A3B8]/70 focus:border-[#5E6AD2]/60 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={onStatusChange}
          className="inline-flex h-9 shrink-0 items-center justify-between gap-2.5 rounded-md border border-[#2A2F3A] bg-[#101419] px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3A4050] sm:w-auto"
        >
          <span className="truncate">
            Active ({activeCount}) / Pending ({pendingCount})
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />
        </button>
      </div>

      {/* Bottom row: Member list items + View All inline trigger */}
      <div className="flex flex-wrap items-center gap-4">
        {members.slice(0, 6).map((member) => (
          <div
            key={member.id ?? member.username ?? member.fullname}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0F1115] bg-[#DDE1E5] text-xs font-semibold text-[#0F1115] shadow-[0_0_0_2px_rgba(15,17,21,0.8)]"
              title={member.fullname}
            >
              {member.initials}
            </div>
            <span className="max-w-17.5 truncate text-center text-[10px] text-[#94A3B8]">
              {member.fullname}
            </span>
          </div>
        ))}

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-[#2A2F3A] bg-transparent px-3 py-1.5 text-xs text-[#E2E8F0] transition-colors hover:border-[#3A4050] hover:bg-white/3"
        >
          <span>View All ({members.length})</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
        </button>
      </div>
    </section>
  )
}