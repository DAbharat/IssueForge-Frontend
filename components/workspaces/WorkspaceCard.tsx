"use client"

type WorkspaceCardProps = {
    id?: string | number
    name: string
    createdAt?: string
    ownerName?: string
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
    if (!value) {
        return "Joined 2026"
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return "Joined —"
    }

    return `Joined ${date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    })}`
}

export default function WorkspaceCard({ id, name, createdAt, ownerName }: WorkspaceCardProps) {
    const initials = getInitials(name)
    const workspaceName = name?.trim() || "Workspace"
    const owner = ownerName?.trim() || "Workspace creator"

    return (
        <article className="mx-auto w-full max-w-2xl rounded-md border border-[#222631] bg-[#1A1D24] px-3.5 py-3 text-[#E2E8F0] shadow-[0_1px_0_rgba(255,255,255,0.02)] transition-colors hover:bg-[#1B1E27] sm:px-4 sm:py-3.5">
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#222631] bg-[#DDE1E5] text-sm font-semibold text-[#0F1115] sm:h-12 sm:w-12 sm:text-base">
                    {initials}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="truncate text-sm font-semibold leading-none text-[#E2E8F0] sm:text-base">
                            {workspaceName}
                        </h2>

                        {id !== undefined && id !== null && (
                            <span className="shrink-0 text-[10px] font-medium text-[#94A3B8] sm:text-xs">
                                #{String(id)}
                            </span>
                        )}
                    </div>

                    <div className="mt-1 flex items-center gap-x-2 text-[12px] text-[#94A3B8] sm:text-sm">
                        <span className="truncate">{formatJoinedDate(createdAt)}</span>
                        <span className="shrink-0 text-[#222631]">•</span>
                        <span className="truncate">Owner: {owner}</span>
                    </div>
                </div>
            </div>
        </article>
    )
}