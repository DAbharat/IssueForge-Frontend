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

const MAX_VISIBLE_MEMBERS = 3

export default function WorkspaceMembersOverview({
  title = "Members",
  members,
  activeCount = 0,
  pendingCount = 0,
  searchPlaceholder = "Search members...",
  onSearchChange,
  onStatusChange,
  onManageMembers,
  onShowAllMembers,
}: WorkspaceMembersOverviewProps) {
  const hasOverflow = members.length > MAX_VISIBLE_MEMBERS
  const visibleMembers = hasOverflow
    ? members.slice(0, MAX_VISIBLE_MEMBERS)
    : members

  const remainingCount = members.length - MAX_VISIBLE_MEMBERS

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
          <span>Active ({activeCount}) / Pending ({pendingCount})</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />
        </button>

        <button
          type="button"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-[#27272A] bg-transparent px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46] hover:bg-white/3"
        >
          <span>View All ({members.length})</span>
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

        {/* Overflow: blurred "+N" indicator when there are more than 3 members */}
        {hasOverflow ? (
          <button
            type="button"
            onClick={onShowAllMembers}
            className="flex w-16 flex-col items-center gap-1.5"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#27272A] bg-[#18181B] text-xs font-semibold text-[#E2E8F0] blur-[0.6px] transition-all hover:blur-0 hover:border-[#3F3F46] hover:bg-[#27272A]">
              +{remainingCount}
            </div>
            <span className="w-full truncate text-center text-[10px] leading-tight text-[#94A3B8]">
              Show all members
            </span>
          </button>
        ) : (
          /* Add Member action (only shown when all members fit) */
          <button
            type="button"
            onClick={onManageMembers}
            className="flex w-16 flex-col items-center gap-1.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#27272A] bg-[#18181B] text-[#E2E8F0] transition-colors hover:border-[#3F3F46] hover:bg-[#27272A]">
              <Plus className="h-4 w-4" />
            </div>
            <span className="w-full truncate text-center text-[10px] leading-tight text-[#94A3B8]">
              Add Member
            </span>
          </button>
        )}
      </div>
    </div>
  )
}