"use client"

import { Plus, Search, Filter, ChevronDown } from "lucide-react"

export type ProjectIssueItem = {
  id?: string | number
  title: string
  description?: string
  status: "todo" | "in_progress" | "done"
  priority?: "low" | "medium" | "high"
  assignee?: string
  createdAt?: string
}

type ProjectIssuesProps = {
  projectName: string
  issues: ProjectIssueItem[]
  onCreateIssue?: () => void
  onSearchChange?: (value: string) => void
  onFilterChange?: () => void
  onSortChange?: (order: "asc" | "desc") => void
}

const STATUS_LABELS = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
}

const STATUS_COLORS: Record<string, string> = {
  todo: "bg-[#2A2F3A]",
  in_progress: "bg-[#3D3E5C]",
  done: "bg-[#1F3A1F]",
}

export default function ProjectIssues({
  projectName,
  issues,
  onCreateIssue,
  onSearchChange,
  onFilterChange,
  onSortChange,
}: ProjectIssuesProps) {
  const groupedIssues = {
    todo: issues.filter((i) => i.status === "todo"),
    in_progress: issues.filter((i) => i.status === "in_progress"),
    done: issues.filter((i) => i.status === "done"),
  }

  return (
    <div className="w-full space-y-4">
      {/* Header row: Title + Create Issue Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#E2E8F0]">
          Issues of <span className="text-[#5E6AD2]">{projectName}</span>
        </h2>

        <button
          type="button"
          onClick={onCreateIssue}
          className="inline-flex items-center gap-2 rounded-md border border-[#2A2F3A] bg-[#11151A] px-3 py-1.5 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3A4050] hover:bg-[#171C22]"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Issue
        </button>
      </div>

      {/* Control row: Search + Filter + Sort */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search issues..."
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="h-9 w-full rounded-md border border-[#2A2F3A] bg-[#101419] pl-8 pr-3 text-xs text-[#E2E8F0] placeholder:text-[#94A3B8]/70 focus:border-[#5E6AD2]/60 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={onFilterChange}
          className="inline-flex h-9 items-center gap-2.5 rounded-md border border-[#2A2F3A] bg-[#101419] px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3A4050]"
        >
          <Filter className="h-3.5 w-3.5" />
          <span>Filter</span>
        </button>

        <button
          type="button"
          onClick={() => onSortChange?.("asc")}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-[#2A2F3A] bg-[#101419] px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3A4050]"
        >
          <span>Sort: asc, desc</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Issues by status columns */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Todo Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-md bg-[#101419] px-3 py-2">
            <div className={`h-2 w-2 rounded-full ${STATUS_COLORS.todo}`} />
            <h3 className="text-sm font-semibold text-[#E2E8F0]">
              {STATUS_LABELS.todo} ({groupedIssues.todo.length})
            </h3>
          </div>
          <div className="space-y-2">
            {groupedIssues.todo.map((issue) => (
              <div
                key={issue.id}
                className="rounded-lg border border-[#2A2F3A] bg-[#11151A] p-3 transition-colors hover:border-[#3A4050]"
              >
                <p className="line-clamp-2 text-sm font-medium text-[#E2E8F0]">
                  {issue.title}
                </p>
                {issue.description && (
                  <p className="line-clamp-1 text-xs text-[#94A3B8]">
                    {issue.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-md bg-[#101419] px-3 py-2">
            <div className={`h-2 w-2 rounded-full ${STATUS_COLORS.in_progress}`} />
            <h3 className="text-sm font-semibold text-[#E2E8F0]">
              {STATUS_LABELS.in_progress} ({groupedIssues.in_progress.length})
            </h3>
          </div>
          <div className="space-y-2">
            {groupedIssues.in_progress.map((issue) => (
              <div
                key={issue.id}
                className="rounded-lg border border-[#2A2F3A] bg-[#11151A] p-3 transition-colors hover:border-[#3A4050]"
              >
                <p className="line-clamp-2 text-sm font-medium text-[#E2E8F0]">
                  {issue.title}
                </p>
                {issue.description && (
                  <p className="line-clamp-1 text-xs text-[#94A3B8]">
                    {issue.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Done Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-md bg-[#101419] px-3 py-2">
            <div className={`h-2 w-2 rounded-full ${STATUS_COLORS.done}`} />
            <h3 className="text-sm font-semibold text-[#E2E8F0]">
              {STATUS_LABELS.done} ({groupedIssues.done.length})
            </h3>
          </div>
          <div className="space-y-2">
            {groupedIssues.done.map((issue) => (
              <div
                key={issue.id}
                className="rounded-lg border border-[#2A2F3A] bg-[#11151A] p-3 transition-colors hover:border-[#3A4050]"
              >
                <p className="line-clamp-2 text-sm font-medium text-[#E2E8F0]">
                  {issue.title}
                </p>
                {issue.description && (
                  <p className="line-clamp-1 text-xs text-[#94A3B8]">
                    {issue.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
