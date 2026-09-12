"use client"

import { useMemo, useState } from "react"
import { ChevronDown, Filter, Plus, Search, Check } from "lucide-react"

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
  onClick?: (issueId: string | number) => void
}

const STATUS_LABELS = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
} as const

const STATUS_COLORS: Record<keyof typeof STATUS_LABELS, string> = {
  todo: "bg-[#71717A]",          // gray
  in_progress: "bg-[#CA8A04]",   // dark yellow / amber
  done: "bg-[#22C55E]",          // green
}

function IssueCard({
  issue,
  onClick,
}: {
  issue: ProjectIssueItem
  onClick?: (issueId: string | number) => void
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (issue.id == null) return
        onClick?.(issue.id)
      }}
      className="flex h-11 w-full items-center rounded-lg border border-[#2A2A2E] bg-[#18181B] px-3 text-left transition-all duration-200 hover:border-[#3F3F46] hover:bg-[#1E1E22]"
    >
      <p className="line-clamp-1 text-[13px] font-medium text-[#E2E8F0]">
        {issue.title}
      </p>
    </button>
  )
}

function EmptyColumnState() {
  return (
    <div className="flex h-[440px] items-center justify-center rounded-xl border border-dashed border-[#2A2A2E] bg-[#101012]">
      <div className="flex flex-col items-center px-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#3F3F46] bg-[#141417] text-[#D4D4D8]">
          <Check className="h-6 w-6" />
        </div>
        <p className="text-base font-semibold text-[#E2E8F0]">All Clear!</p>
        <p className="mt-1.5 max-w-[200px] text-xs leading-relaxed text-[#94A3B8]">
          Empty state message tin with refined padding.
        </p>
      </div>
    </div>
  )
}

export default function ProjectIssues({
  projectName,
  issues,
  onCreateIssue,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onClick,
}: ProjectIssuesProps) {
  const [searchValue, setSearchValue] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filteredIssues = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    const list = query
      ? issues.filter((issue) => {
          const haystack = `${issue.title} ${issue.description ?? ""}`.toLowerCase()
          return haystack.includes(query)
        })
      : issues

    const sorted = [...list].sort((a, b) => {
      const left = a.createdAt ?? a.title
      const right = b.createdAt ?? b.title

      if (sortOrder === "asc") {
        return String(left).localeCompare(String(right))
      }

      return String(right).localeCompare(String(left))
    })

    return sorted
  }, [issues, searchValue, sortOrder])

  const groupedIssues = {
    todo: filteredIssues.filter((i) => i.status === "todo"),
    in_progress: filteredIssues.filter((i) => i.status === "in_progress"),
    done: filteredIssues.filter((i) => i.status === "done"),
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    onSearchChange?.(value)
  }

  const handleSort = () => {
    const nextOrder = sortOrder === "asc" ? "desc" : "asc"
    setSortOrder(nextOrder)
    onSortChange?.(nextOrder)
  }

  return (
    <div className="w-full">
      {/* ── Header: title left, Create Issue right ── */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-[-0.01em] text-[#E2E8F0]">
          Issues of <span className="text-[#5E6AD2]">{projectName}</span>
        </h2>

        <button
          type="button"
          onClick={onCreateIssue}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-[#3A3A40] bg-[#18181B] px-3 py-1.5 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#4B4B52] hover:bg-[#202026]"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Issue
        </button>
      </div>

      {/* ── Controls row: search + filter + sort ── */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
        <div className="relative w-full sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={searchValue}
            placeholder="Search issues..."
            onChange={(e) => handleSearch(e.target.value)}
            className="h-9 w-full rounded-md border border-[#27272A] bg-[#18181B] pl-8 pr-3 text-xs text-[#E2E8F0] placeholder:text-[#94A3B8]/70 focus:border-[#5E6AD2]/60 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0 sm:gap-2.5">
          <button
            type="button"
            onClick={onFilterChange}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-[#27272A] bg-[#18181B] px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46] sm:w-auto"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
          </button>

          <button
            type="button"
            onClick={handleSort}
            className="inline-flex h-9 w-full items-center justify-between gap-2 rounded-md border border-[#27272A] bg-[#18181B] px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46] sm:w-auto"
          >
            <span className="truncate">Sort: {sortOrder}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />
          </button>
        </div>
      </div>

      {/* ── Kanban board: responsive 1 / 2 / 3 columns ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(STATUS_LABELS).map(([statusKey, label]) => {
          const key = statusKey as keyof typeof STATUS_LABELS
          const items = groupedIssues[key]
          const isEmpty = items.length === 0

          return (
            <div key={statusKey} className="min-w-0">
              {/* Column header */}
              <div className="mb-2.5 flex items-center gap-2 rounded-md bg-[#18181B] px-3 py-2.5">
                <div className={`h-2 w-2 shrink-0 rounded-full ${STATUS_COLORS[key]}`} />
                <h3 className="text-[13px] font-semibold text-[#E2E8F0]">
                  {label} ({items.length})
                </h3>
              </div>

              {/* Column body */}
              {isEmpty ? (
                <EmptyColumnState />
              ) : (
                <div
                  className="
                    max-h-[440px] space-y-2 overflow-y-auto pr-2
                    [scrollbar-width:thin]
                    [scrollbar-color:#3F3F46_#000000]
                    [&::-webkit-scrollbar]:h-2
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-[#000000]
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-[#3F3F46]
                    hover:[&::-webkit-scrollbar-thumb]:bg-[#52525B]
                  "
                >
                  {items.map((issue) => (
                    <IssueCard
                      key={issue.id ?? issue.title}
                      issue={issue}
                      onClick={onClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}