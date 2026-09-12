"use client"

import { FolderKanban, User2 } from "lucide-react"

type ProjectCardProps = {
  id?: string | number
  title: string
  description?: string
  lead_name?: string
  issueCount?: number
  onClick?: () => void
}

function truncateText(value?: string, maxLength = 110) {
  if (!value) return "No description provided."

  const trimmed = value.trim()
  if (trimmed.length <= maxLength) return trimmed

  return `${trimmed.slice(0, maxLength).trim()}...`
}

export default function ProjectCard({
  id,
  title,
  description,
  lead_name,
  issueCount,
  onClick,
}: ProjectCardProps) {
  return (
    <article
      id={id ? String(id) : undefined}
      className="group relative mx-auto flex w-full max-w-155 min-h-55 cursor-pointer flex-col overflow-hidden rounded-sm border border-white/8 bg-[#18181B] p-5 text-[#E2E8F0] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/16 focus:outline-none focus:ring-2 focus:ring-[#5E6AD2]/60 sm:min-h-57.5"
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
      {/* Top highlight stroke */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />

      {/* Header row: icon + title, both vertically centered on the same line */}
      <header className="flex items-center gap-2.5">
        <FolderKanban className="h-4 w-4 shrink-0 text-[#94A3B8]" />
        <h3 className="min-w-0 truncate text-base font-semibold leading-snug tracking-[-0.01em] text-[#E2E8F0] sm:text-[17px]">
          {title || "Project Title"}
        </h3>
      </header>

      {/* Description — aligned to the same left edge as the title */}
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#B4BFCC]">
        {truncateText(description, 110)}
      </p>

      {/* Spacer pushes footer to bottom */}
      <div className="flex-1" />

      {/* Footer: lead + issue count */}
      <footer className="mt-5 flex items-center justify-between gap-4 border-t border-white/6 pt-3.5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/8 text-[#E2E8F0]">
            <User2 className="h-3 w-3" />
          </span>
          <span className="truncate text-sm leading-5 text-[#E2E8F0]">
            <span className="text-[#94A3B8]">Lead: </span>
            {lead_name || "Unknown lead"}
          </span>
        </div>

        <div className="shrink-0 rounded-full bg-white/6 px-2.5 py-1 text-xs font-medium tabular-nums text-[#E2E8F0]">
          {typeof issueCount === "number" ? `${issueCount} issues` : "0 issues"}
        </div>
      </footer>
    </article>
  )
}