"use client"

type Workspace = {
  id: string
  name: string
}

type ProfileHeaderProps = {
  id: string
  fullname: string
  username: string
  createdAt: string
  workspaceName: Workspace[]
}

function getMemberSince(createdAt: string) {
  const date = new Date(createdAt)
  return Number.isNaN(date.getTime()) ? "—" : date.getFullYear()
}

export default function ProfileHeader({
  fullname,
  username,
  createdAt,
}: ProfileHeaderProps) {
  const memberSince = getMemberSince(createdAt)
  const displayName = fullname?.trim() || "User"
  const displayUsername = username?.trim() || ""
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U"

  return (
    <header className="w-full">
      <div className="mx-auto flex w-full max-w-96 flex-col items-center text-center sm:max-w-100 lg:max-w-110">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-[#27272A] bg-[#DDE1E5] text-[1.8rem] font-semibold text-[#000000] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] sm:h-24 sm:w-24 sm:text-[2rem] lg:h-28 lg:w-28 lg:text-[2.2rem]">
          {initials}
        </div>

        <div className="w-full space-y-1">
          <h1 className="text-[1.6rem] font-semibold tracking-[-0.04em] text-[#E2E8F0] sm:text-[1.8rem] lg:text-[2rem]">
            {displayName}
          </h1>

          {displayUsername ? (
            <p className="text-sm text-[#94A3B8] sm:text-[0.95rem]">{displayUsername}</p>
          ) : null}

          <p className="text-sm text-[#94A3B8] sm:text-[0.95rem]">Member since {memberSince}</p>
        </div>

        <button
          type="button"
          className="mt-5 inline-flex w-full items-center justify-center rounded-md border border-[#A8B0BE]/30 bg-transparent px-4 py-2.5 text-sm font-medium text-[#E2E8F0] transition-colors hover:border-[#DDE1E5]/40 hover:bg-white/5 sm:mt-6 sm:text-base"
        >
          Edit Profile
        </button>
      </div>
    </header>
  )
}