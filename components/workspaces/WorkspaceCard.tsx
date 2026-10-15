"use client"

type WorkspaceCardProps = {
    id?: string | number
    name: string
    createdAt?: string
    ownerName?: string
    onClick?: () => void
}

function getInitials(name: string) {
    return (
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("") || "W"
    )
}

function formatJoinedDate(value?: string) {
    if (!value) return null

    const date = new Date(value)
    if (Number.isNaN(date.getTime()) || date.getFullYear() <= 1970) {
        return null
    }

    return `Joined ${date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    })}`
}

export default function WorkspaceCard({ id, name, createdAt, ownerName, onClick }: WorkspaceCardProps) {
    const initials = getInitials(name)
    const workspaceName = name?.trim() || "Workspace"
    const owner = ownerName?.trim() || "Workspace creator"
    const formattedDate = formatJoinedDate(createdAt)

    return (
        <article
            className="mx-auto w-full max-w-2xl cursor-pointer rounded-md border border-[#27272A] bg-[#18181B] px-3.5 py-3 text-[#E2E8F0] shadow-[0_1px_0_rgba(255,255,255,0.02)] transition-colors hover:border-[#3F3F46] focus:outline-none focus:ring-2 focus:ring-[#DDE1E5]/60 sm:px-4 sm:py-3.5"
            onClick={onClick}
            onKeyDown={(event) => {
                if ((event.key === "Enter" || event.key === " ") && onClick) {
                    event.preventDefault()
                    onClick()
                }
            }}
            role="button"
            tabIndex={0}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Left column: Avatar + Title + Owner */}
                <div className="flex min-w-0 flex-1 items-center gap-3.5 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#3F3F46]/60 bg-[#27272A] text-xs font-medium text-[#94A3B8] sm:h-12 sm:w-12 sm:text-sm">
                        {initials}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                        <h2 className="truncate text-sm font-bold text-[#E2E8F0] sm:text-base">
                            {workspaceName}
                        </h2>

                        <p className="truncate text-xs text-[#94A3B8]">
                            Owner: {owner}
                        </p>
                    </div>
                </div>

                {/* Right column: #id + Date */}
                <div className="flex shrink-0 flex-col items-end justify-center space-y-1 text-right">
                    {id !== undefined && id !== null && (
                        <span className="text-xs font-medium text-[#94A3B8]">
                            #{String(id)}
                        </span>
                    )}

                    {formattedDate && (
                        <span className="text-xs font-normal text-[#94A3B8]">
                            {formattedDate}
                        </span>
                    )}
                </div>
            </div>
        </article>
    )
}