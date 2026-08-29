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
  id,
  fullname,
  username,
  createdAt,
  workspaceName,
}: ProfileHeaderProps) {
  const memberSince = getMemberSince(createdAt)
  const displayName = fullname?.trim() || "User"
  const displayUsername = username?.trim() || "user"
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U"

  return (
    <section className="p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/6 text-2xl font-semibold text-white">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white">{displayName}</h1>
            <span className="rounded-full bg-white/4 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-white/55">
              Member #{id}
            </span>
          </div>

          <p className="mt-1 text-sm text-white/65">@{displayUsername}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-white/45">
            <span>Member since {memberSince}</span>
            {workspaceName.length > 0 && (
              <span>
                {workspaceName.length} workspace{workspaceName.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {workspaceName.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-white/40">Workspaces</p>
          <div className="flex flex-wrap gap-2">
            {workspaceName.map((workspace) => (
              <span
                key={workspace.id}
                className="rounded-sm bg-white/4 px-2.5 py-1.5 text-sm text-white/70"
              >
                {workspace.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}