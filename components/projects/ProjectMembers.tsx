"use client"

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
}

export default function ProjectMembers({ members }: ProjectMembersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <div
          key={member.id ?? member.username}
          className="relative rounded-lg border border-[#2A2F3A] bg-[#11151A] p-4 transition-colors hover:border-[#3A4050]"
        >
          {/* Role badge top-right */}
          <div className="absolute right-4 top-4 text-xs font-medium text-[#94A3B8]">
            Role: <span className="text-[#E2E8F0]">{member.role}</span>
          </div>

          {/* Avatar + Name section */}
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#2A2F3A] bg-[#DDE1E5] text-sm font-semibold text-[#0F1115]">
              {member.initials}
            </div>

            {/* Fullname + Username */}
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="truncate text-sm font-semibold text-[#E2E8F0]">
                {member.fullname}
              </p>
              <p className="truncate text-xs text-[#94A3B8]">
                @{member.username}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

