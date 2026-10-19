"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDown, Filter, Plus, Search, Check } from "lucide-react"
import type { Label } from "@/services/labels.service"
import { useDebounce } from "@/hooks/use-debounce"

export type ProjectIssueItem = {
  id?: string | number
  title: string
  description?: string
  status: "todo" | "in_progress" | "done"
  priority?: "low" | "medium" | "high"
  assignee?: string
  labels?: Label[]
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

const PRIORITY_CONFIG = {
  low: { label: "Low", dot: "bg-[#71717A]" },
  medium: { label: "Medium", dot: "bg-[#CA8A04]" },
  high: { label: "High", dot: "bg-[#EF4444]" },
}

function IssueCard({
  issue,
  onClick,
}: {
  issue: ProjectIssueItem
  onClick?: (issueId: string | number) => void
}) {
  const prio = issue.priority ? PRIORITY_CONFIG[issue.priority] : null

  return (
    <button
      type="button"
      onClick={() => {
        if (issue.id == null) return
        onClick?.(issue.id)
      }}
      className="flex w-full flex-col rounded-lg border border-[#2A2A2E] bg-[#18181B] p-3 text-left transition-all duration-200 hover:border-[#3F3F46] hover:bg-[#1E1E22]"
    >
      <p className="line-clamp-2 text-[13px] font-medium leading-relaxed text-[#E2E8F0]">
        {issue.title}
      </p>

      <div className="mt-3 flex w-full items-center justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {issue.labels?.map((label) => (
            <span
              key={label.id}
              className="max-w-28 truncate rounded-md border border-[#27272A] bg-[#101012] px-1.5 py-0.5 text-[10px] font-medium text-[#A1A1AA]"
            >
              {label.name}
            </span>
          ))}

          {prio && (
            <div className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${prio.dot}`} />
              <span className="text-[11px] font-medium text-[#94A3B8]">{prio.label}</span>
            </div>
          )}
        </div>

        {issue.id != null && (
          <span className="ml-2 shrink-0 text-[11px] font-medium text-[#71717A]">
            #{issue.id}
          </span>
        )}
      </div>
    </button>
  )
}

function EmptyColumnState({ status }: { status: keyof typeof STATUS_LABELS }) {
  const text = status === "done" ? "You're all caught up!" : "All Clear!"
  const subtext = status === "done" ? "" : "No tasks in this stage"

  return (
    <div className="my-auto flex h-full flex-1 flex-col items-center justify-center px-4 py-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#27272A] bg-[#141417] text-[#94A3B8]">
        <Check className="h-6 w-6" />
      </div>
      <p className="text-[15px] font-semibold text-[#E2E8F0]">{text}</p>
      {subtext && (
        <p className="mt-1.5 max-w-[200px] text-xs leading-relaxed text-[#94A3B8]">
          {subtext}
        </p>
      )}
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
  const debouncedSearch = useDebounce(searchValue, 300)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Debounced callback to notify parent without spamming
  useEffect(() => {
    onSearchChange?.(debouncedSearch)
  }, [debouncedSearch, onSearchChange])

  const filteredIssues = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase()

    const list = query
      ? issues.filter((issue) => {
          const haystack = `${issue.title} ${issue.description ?? ""}`.toLowerCase()
          return haystack.includes(query) || String(issue.id).includes(query)
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
  }, [issues, debouncedSearch, sortOrder])

  const groupedIssues = {
    todo: filteredIssues.filter((i) => i.status === "todo"),
    in_progress: filteredIssues.filter((i) => i.status === "in_progress"),
    done: filteredIssues.filter((i) => i.status === "done"),
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handleSort = () => {
    const nextOrder = sortOrder === "asc" ? "desc" : "asc"
    setSortOrder(nextOrder)
    onSortChange?.(nextOrder)
  }

  return (
    <div className="w-full">
      {/* ── Header: title left, Create Issue right ── */}
      {/* <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-[-0.01em] text-[#E2E8F0]">
          Issues of <span className="text-[#DDE1E5]">{projectName}</span>
        </h2>

        <button
          type="button"
          onClick={onCreateIssue}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-[#3A3A40] bg-[#18181B] px-3 py-1.5 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#4B4B52] hover:bg-[#202026]"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Issue
        </button>
      </div> */}

      {/* ── Controls row: search + filter + sort ── */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
        <div className="relative w-full sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={searchValue}
            placeholder="Search issues..."
            onChange={(e) => handleSearch(e.target.value)}
            className="h-9 w-full rounded-md border border-[#27272A] bg-[#18181B] pl-8 pr-3 text-xs text-[#E2E8F0] placeholder:text-[#94A3B8]/70 focus:border-[#DDE1E5]/60 focus:outline-none"
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
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#27272A] rounded-xl border border-[#27272A] bg-[#0E0E11] overflow-hidden">
        {Object.entries(STATUS_LABELS).map(([statusKey, label]) => {
          const key = statusKey as keyof typeof STATUS_LABELS
          const items = groupedIssues[key]
          const isEmpty = items.length === 0

          return (
            <section
              key={statusKey}
              className="flex h-full min-h-[460px] min-w-0 flex-col bg-[#101012]"
            >
              {/* Column header */}
              <div className="flex h-11 items-center justify-between border-b border-[#27272A] bg-[#18181B] px-3.5">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 shrink-0 rounded-full ${STATUS_COLORS[key]}`} />
                  <h3 className="text-[13px] font-semibold text-[#E2E8F0]">
                    {label}
                  </h3>
                </div>
                <span 
                  className={`flex h-5 min-w-[20px] items-center justify-center rounded px-1.5 text-[10px] font-semibold ${
                    key === "todo" ? "bg-[#27272A] text-[#94A3B8]" :
                    key === "in_progress" ? "bg-[#CA8A04] text-white" :
                    "bg-[#166534] text-white"
                  }`}
                >
                  {items.length}
                </span>
              </div>

              {/* Column body: same box for empty and filled states */}
              <div
                className={`flex h-full flex-1 flex-col p-3.5 ${
                  isEmpty ? "items-center justify-center" : ""
                }`}
              >
                {isEmpty ? (
                  <EmptyColumnState status={key} />
                ) : (
                  <div
                    className="
                      flex w-full flex-col gap-2.5 overflow-y-auto max-h-[460px]
                      [scrollbar-width:thin]
                      [scrollbar-color:#3F3F46_transparent]
                      [&::-webkit-scrollbar]:w-1.5
                      [&::-webkit-scrollbar-track]:bg-transparent
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
            </section>
          )
        })}
      </div>
    </div>
  )
}