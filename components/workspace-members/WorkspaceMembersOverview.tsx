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
  onShowAllMembers?: () => void
}

const MAX_VISIBLE_MEMBERS = 2

export default function WorkspaceMembersOverview({
  title = "Members",
  members = [],
  activeCount,
  pendingCount = 0,
  searchPlaceholder = "Search members...",
  onSearchChange,
  onStatusChange,
  onManageMembers,
  onShowAllMembers,
}: WorkspaceMembersOverviewProps) {
  const visibleMembers = members.slice(0, MAX_VISIBLE_MEMBERS)

  const totalMembersCount = members.length
  const computedActiveCount =
    activeCount !== undefined && activeCount > 0
      ? activeCount
      : members.filter((m) => m.status !== "pending").length

  return (
    <div className="w-full">
      {/* Header row: Title + Manage Button */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold leading-none tracking-[-0.03em] text-[#E2E8F0]">
          {title}
        </h2>

        <button
          type="button"
          onClick={onManageMembers}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#27272A] bg-transparent px-2.5 py-1 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46] hover:bg-white/3"
        >
          <span>Manage Workspace Members</span>
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Control row: Search field + Active/Pending + View All */}
      <div className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(event) => onSearchChange?.(event.target.value)}
            className="h-9 w-full rounded-md border border-[#27272A] bg-[#18181B] pl-8 pr-3 text-xs text-[#E2E8F0] placeholder:text-[#94A3B8]/70 focus:border-[#5E6AD2]/60 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={onStatusChange}
          className="inline-flex h-9 shrink-0 items-center justify-between gap-1.5 rounded-md border border-[#27272A] bg-[#18181B] px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46]"
        >
          <span>Active ({computedActiveCount}) / Pending ({pendingCount})</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />
        </button>

        <button
          type="button"
          onClick={onShowAllMembers}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-[#27272A] bg-transparent px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46] hover:bg-white/3"
        >
          <span>View All ({totalMembersCount})</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
        </button>
      </div>

      {/* Member list — fixed-width items for consistent grid alignment */}
      <div className="flex flex-wrap items-start gap-3">
        {visibleMembers.map((member) => (
          <div
            key={member.id ?? member.username ?? member.fullname}
            className="flex w-16 flex-col items-center gap-1.5"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#000000] bg-[#DDE1E5] text-xs font-semibold text-[#000000] shadow-[0_0_0_2px_rgba(0,0,0,0.8)]"
              title={member.fullname}
            >
              {member.initials}
            </div>
            <span className="w-full truncate text-center text-[10px] leading-tight text-[#94A3B8]">
              {member.fullname}
            </span>
          </div>
        ))}

        {/* View All Members Avatar Button */}
        <button
          type="button"
          onClick={onShowAllMembers}
          className="group flex w-16 flex-col items-center gap-1.5 text-left focus:outline-none"
          title="View all members"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#000000] bg-[#DDE1E5] text-xs font-semibold text-[#000000] shadow-[0_0_0_2px_rgba(0,0,0,0.8)] blur-[0.8px] transition-all group-hover:blur-none group-hover:scale-105">
            A
          </div>
          <span className="w-full truncate text-center text-[10px] leading-tight text-[#94A3B8] transition-colors group-hover:text-[#E2E8F0]">
            All Members
          </span>
        </button>
      </div>
    </div>
  )
}