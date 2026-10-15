"use client"

export type ProfileIssueLabel = {
  id?: string | number
  name: string
  color?: string
}

type ProfileIssueCardProps = {
  id?: string | number
  title: string
  workspaceName?: string
  labels?: ProfileIssueLabel[]
  createdAt?: string
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

function truncateIssueTitle(title: string, maxWords = 8) {
  if (!title) return "Issue"
  const words = title.trim().split(/\s+/)
  if (words.length > maxWords) {
    return `${words.slice(0, maxWords).join(" ")}......`
  }
  return title
}

function formatCreationDate(value?: string) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime()) || date.getFullYear() <= 1970) return null
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function ProfileIssueCard({
  id,
  title,
  workspaceName,
  labels = [],
  createdAt,
  onClick,
}: ProfileIssueCardProps) {
  const initials = getInitials(workspaceName || "Workspace")
  const truncatedTitle = truncateIssueTitle(title, 8)
  const formattedDate = formatCreationDate(createdAt)

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
        {/* Left column: Avatar + Title + Labels */}
        <div className="flex min-w-0 flex-1 items-center gap-3.5 sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#3F3F46]/60 bg-[#27272A] text-xs font-medium text-[#94A3B8] sm:h-12 sm:w-12 sm:text-sm">
            {initials}
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <h2
              className="truncate text-sm font-bold text-[#E2E8F0] sm:text-base"
              title={title}
            >
              {truncatedTitle}
            </h2>

            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {labels && labels.length > 0 ? (
                labels.map((label) => (
                  <span
                    key={String(label.id || label.name)}
                    className="inline-flex max-w-28 items-center gap-1 truncate rounded-md border border-[#27272A] bg-[#101012] px-1.5 py-0.5 text-[10px] font-medium text-[#A1A1AA]"
                  >
                    {label.color && (
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: label.color }}
                      />
                    )}
                    <span className="truncate">{label.name}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#94A3B8]">No labels</span>
              )}
            </div>
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
