"use client"

import { FolderKanban, MoreVertical, CircleDot, Users } from "lucide-react"

type ProjectCardProps = {
  id?: string | number
  title: string
  description?: string
  lead_name?: string
  issueCount?: number
  memberCount?: number
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
  issueCount = 0,
  memberCount = 0,
  onClick,
}: ProjectCardProps) {
  // Extract initials for the avatar
  const leadInitials = lead_name
    ? lead_name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p.charAt(0).toUpperCase())
        .join("")
    : "U"

  return (
    <article
      id={id ? String(id) : undefined}
      className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-[#27272A] bg-[#0E0E11] p-5 text-[#E2E8F0] transition-all duration-200 hover:border-[#3F3F46] focus:outline-none focus:ring-2 focus:ring-[#E2E8F0]/30 min-h-[220px]"
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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-to-r_from-transparent_via-white/10_to-transparent]" />

      <header className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#27272A]">
            <FolderKanban className="h-5 w-5 text-[#E2E8F0]" />
          </div>
          <h3 className="min-w-0 truncate text-base font-semibold leading-snug tracking-tight text-[#E2E8F0]">
            {title || "Project Title"}
          </h3>
        </div>
        <button
          type="button"
          className="text-[#94A3B8] transition-colors hover:text-[#E2E8F0]"
          onClick={(e) => {
            e.stopPropagation()
            // Three dots menu placeholder
          }}
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </header>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#94A3B8]">
        {truncateText(description, 110)}
      </p>

      <div className="flex-1" />

      <footer className="mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#27272A] text-xs font-medium text-[#E2E8F0]">
            {leadInitials}
          </span>
          <span className="text-sm text-[#94A3B8]">
            Lead: <span className="text-[#E2E8F0]">{lead_name || "Unknown lead"}</span>
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <CircleDot className="h-4 w-4" />
            <span>{issueCount} issues</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{memberCount} members</span>
          </div>
        </div>
      </footer>
    </article>
  )
}