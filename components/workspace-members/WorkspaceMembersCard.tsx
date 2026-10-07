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
    <div className="h-full flex flex-col w-full rounded-xl border border-[#27272A] bg-[#0E0E11] text-[#E2E8F0] shadow-xl overflow-hidden">
      {/* Header with single separator */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272A]">
        <h2 className="text-base font-bold tracking-tight text-white">
          Workspace Members
        </h2>
        {totalMembers !== undefined && (
          <span className="text-[13px] font-medium text-[#94A3B8]">
            {totalMembers} members
          </span>
        )}
      </div>

      {/* Member List (no dividers between rows) */}
      <div className="flex flex-col py-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors gap-3"
          >
            {/* Left side: Avatar + User details */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E2E8F0] text-[13px] font-bold text-black">
                {member.initials}
              </div>
              <div className="flex flex-col min-w-0 justify-center">
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <span className="text-sm font-bold text-white truncate">
                    {member.fullname}
                  </span>
                  {member.isCurrentUser && (
                    <span className="text-[13px] font-medium text-[#71717A] shrink-0">(you)</span>
                  )}
                </div>
                <span className="text-[13px] font-medium text-[#71717A] truncate">
                  {member.username ? (member.username.startsWith('@') ? member.username : `@${member.username}`) : ""}
                </span>
              </div>
            </div>

            {/* Right side: Badges & Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Role Badge */}
              <div
                className={`flex h-[22px] shrink-0 items-center justify-center rounded-full px-2.5 text-[9px] font-bold uppercase tracking-wider ${
                  member.role?.toLowerCase() === "admin" || member.role?.toLowerCase() === "owner"
                    ? "border border-[#3730A3] bg-[#1E1B4B]/80 text-[#818CF8]"
                    : "border border-[#27272A] bg-transparent text-[#71717A]"
                }`}
              >
                {member.role || "MEMBER"}
              </div>

              {/* Status Badge */}
              {member.status?.toLowerCase() === "active" && (
                <div className="flex h-[22px] shrink-0 items-center justify-center rounded-full bg-[#064E3B]/80 px-2.5 text-[9px] font-bold capitalize tracking-wide text-[#34D399]">
                  Active
                </div>
              )}

              {/* Actions Icon */}
              <div className="flex w-5 justify-end shrink-0">
                {!member.isCurrentUser && (
                  <button
                    onClick={() => onActionClick?.(member)}
                    className="text-[#71717A] hover:text-white transition-colors focus:outline-none"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="h-[18px] w-[18px]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manage Members Button */}
      {onManageClick && (
        <div className="mt-auto px-5 pb-5 pt-2">
          <button
            onClick={onManageClick}
            className="w-full flex items-center justify-center gap-2 rounded-md border border-[#27272A] bg-transparent py-2 text-[13px] font-medium text-[#818CF8] text-white hover:bg-[#27272A]"
          >
            <UserPlus className="h-[14px] w-[14px]" />
            Manage members
          </button>
        </div>
      )}
    </div>
  )
}