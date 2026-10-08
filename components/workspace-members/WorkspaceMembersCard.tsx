"use client"

import { MoreHorizontal, UserPlus } from "lucide-react"

export type WorkspaceMember = {
  id: string | number
  fullname: string
  username?: string
  initials: string
  role?: string
  status?: string
  isCurrentUser?: boolean
}

type WorkspaceMembersCardProps = {
  members: WorkspaceMember[]
  totalMembers?: number
  onActionClick?: (member: WorkspaceMember) => void
  onManageClick?: () => void
}

export default function WorkspaceMembersCard({
  members,
  totalMembers,
  onActionClick,
  onManageClick,
}: WorkspaceMembersCardProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-md border border-[#27272A] bg-[#0E0E11] text-[#E2E8F0]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#27272A] px-4 py-3.5">
        <h2 className="text-sm font-semibold text-[#E2E8F0]">
          Workspace Members
        </h2>
        {totalMembers !== undefined && (
          <span className="text-xs text-[#71717A]">{totalMembers} members</span>
        )}
      </div>

      {/* Member list */}
      <ul className="flex flex-col p-2">
        {members.map((member) => {
          const isPrivileged =
            member.role?.toLowerCase() === "admin" ||
            member.role?.toLowerCase() === "owner"
          const isActive = member.status?.toLowerCase() === "active"
          const username = member.username
            ? member.username.startsWith("@")
              ? member.username
              : `@${member.username}`
            : ""

          return (
            <li
              key={member.id}
              className="grid grid-cols-[minmax(0,1fr)_64px_64px_28px] items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-white/[0.03]"
            >
              {/* Avatar + name */}
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#27272A] bg-[#18181B] text-[11px] font-medium text-[#A1A1AA]">
                  {member.initials}
                </div>

                <div className="flex min-w-0 flex-col gap-0.5">
                  <div className="flex min-w-0 items-baseline gap-1.5">
                    <span className="truncate text-[13px] font-medium leading-none text-[#E2E8F0]">
                      {member.fullname}
                    </span>
                    {member.isCurrentUser && (
                      <span className="shrink-0 text-[11px] leading-none text-[#52525B]">
                        (you)
                      </span>
                    )}
                  </div>
                  <span className="truncate text-[11px] leading-none text-[#71717A]">
                    {username}
                  </span>
                </div>
              </div>

              {/* Role — plain text, fixed column */}
              <span
                className={`text-[11px] font-medium capitalize ${
                  isPrivileged ? "text-[#A5B4FC]" : "text-[#71717A]"
                }`}
              >
                {member.role?.toLowerCase() || "member"}
              </span>

              {/* Status — dot + label, fixed column */}
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#A1A1AA]">
                {isActive && (
                  <>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C55E]" />
                    Active
                  </>
                )}
              </span>

              {/* Actions — fixed column */}
              <div className="flex justify-end">
                {!member.isCurrentUser && (
                  <button
                    type="button"
                    onClick={() => onActionClick?.(member)}
                    aria-label="More options"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-[#71717A] transition-colors hover:bg-[#18181B] hover:text-[#E2E8F0] focus:outline-none"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {/* Manage button */}
      {onManageClick && (
        <div className="mt-auto border-t border-[#27272A] p-3">
          <button
            type="button"
            onClick={onManageClick}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-[#27272A] bg-[#18181B] py-2 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46]"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Manage members
          </button>
        </div>
      )}
    </div>
  )
}