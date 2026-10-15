"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Circle,
  Clock3,
  CheckCircle2,
  ListTodo,
} from "lucide-react"
import { PREVIEW_ISSUES, PRIORITY_CONFIG, AUDIT_ITEMS } from "../../constants"
import type { PreviewIssue } from "../../types"

export function ProductPreview() {
  const [filterText, setFilterText] = useState("")
  const [activeTab, setActiveTab] = useState<"board" | "overview">("board")

  const filtered = PREVIEW_ISSUES.filter((issue) =>
    issue.title.toLowerCase().includes(filterText.toLowerCase())
  )

  const todoList = filtered.filter((i) => i.status === "todo")
  const inProgressList = filtered.filter((i) => i.status === "in_progress")
  const completedList = filtered.filter((i) => i.status === "done")

  return (
    <div
      id="product-preview"
      className="relative w-full overflow-hidden rounded-2xl border border-[#27272A] bg-[#0A0A0C] shadow-2xl transition-all"
    >
      {/* Window Title Bar */}
      <div className="flex h-11 items-center justify-between border-b border-[#27272A] bg-[#101012] px-4">
        {/* Left window control dots */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#27272A]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27272A]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27272A]" />
        </div>

        {/* Center Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#94A3B8]">Core Team</span>
          <span className="text-[#3F3F46]">/</span>
          <span className="font-medium text-[#E2E8F0]">IssueForge Web</span>
        </div>

        {/* Right Tab Toggle */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "board" ? "overview" : "board")}
            className="rounded-md border border-[#27272A] bg-[#18181B] px-2.5 py-0.5 text-[11px] font-medium text-[#E2E8F0] hover:bg-[#27272A] transition-colors"
          >
            {activeTab === "board" ? "Board" : "Overview"}
          </button>
        </div>
      </div>

      {/* Main Board Content */}
      <div className="p-4 sm:p-6 bg-[#0A0A0C]">
        {activeTab === "board" ? (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-xs">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#71717A]"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Filter issues..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="h-8 w-full rounded-md border border-[#27272A] bg-[#141416] pl-8 pr-3 text-xs text-[#E2E8F0] placeholder:text-[#71717A] focus:border-[#DDE1E5] focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#3F3F46] bg-[#27272A] px-3 py-1.5 text-xs font-medium text-[#E2E8F0] hover:bg-[#3F3F46] transition-colors"
                >
                  <Plus className="h-3 w-3" aria-hidden="true" />
                  <span>+ New issue</span>
                </button>
              </div>
            </div>

            {/* 3 Kanban Columns */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* TO DO Column */}
              <div className="flex flex-col rounded-xl border border-[#27272A] bg-[#101012] p-3.5">
                <div className="mb-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#71717A]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">
                      TO DO
                    </span>
                  </div>
                  <span className="rounded bg-[#18181B] px-1.5 py-0.5 text-[10px] font-mono text-[#A1A1AA]">
                    {todoList.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {todoList.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#71717A]">
                      No tasks in this stage
                    </div>
                  ) : (
                    todoList.map((issue) => (
                      <KanbanCard key={issue.id} issue={issue} />
                    ))
                  )}
                </div>
              </div>

              {/* IN PROGRESS Column */}
              <div className="flex flex-col rounded-xl border border-[#27272A] bg-[#101012] p-3.5">
                <div className="mb-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#CA8A04]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">
                      IN PROGRESS
                    </span>
                  </div>
                  <span className="rounded bg-[#18181B] px-1.5 py-0.5 text-[10px] font-mono text-[#A1A1AA]">
                    {inProgressList.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {inProgressList.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#71717A]">
                      No tasks in this stage
                    </div>
                  ) : (
                    inProgressList.map((issue) => (
                      <KanbanCard key={issue.id} issue={issue} />
                    ))
                  )}
                </div>
              </div>

              {/* COMPLETED Column */}
              <div className="flex flex-col rounded-xl border border-[#27272A] bg-[#101012] p-3.5">
                <div className="mb-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">
                      COMPLETED
                    </span>
                  </div>
                  <span className="rounded bg-[#18181B] px-1.5 py-0.5 text-[10px] font-mono text-[#A1A1AA]">
                    {completedList.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {completedList.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#71717A]">
                      All caught up!
                    </div>
                  ) : (
                    completedList.map((issue) => (
                      <KanbanCard key={issue.id} issue={issue} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Overview Tab */
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-[#27272A] bg-[#18181B] p-4">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span>Total issues</span>
                  <ListTodo className="h-4 w-4 text-[#71717A]" aria-hidden="true" />
                </div>
                <div className="mt-2 text-2xl font-semibold text-[#E2E8F0]">18</div>
              </div>
              <div className="rounded-lg border border-[#27272A] bg-[#18181B] p-4">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span>To do</span>
                  <Circle className="h-4 w-4 text-[#71717A]" aria-hidden="true" />
                </div>
                <div className="mt-2 text-2xl font-semibold text-[#E2E8F0]">6</div>
              </div>
              <div className="rounded-lg border border-[#27272A] bg-[#18181B] p-4">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span>In progress</span>
                  <Clock3 className="h-4 w-4 text-[#CA8A04]" aria-hidden="true" />
                </div>
                <div className="mt-2 text-2xl font-semibold text-[#E2E8F0]">5</div>
              </div>
              <div className="rounded-lg border border-[#27272A] bg-[#18181B] p-4">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span>Completed</span>
                  <CheckCircle2 className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />
                </div>
                <div className="mt-2 text-2xl font-semibold text-[#E2E8F0]">7</div>
              </div>
            </div>

            {/* Audit Trail list */}
            <div className="rounded-lg border border-[#27272A] bg-[#18181B] p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
                Recent Audit Trail
              </h4>
              <div className="divide-y divide-[#27272A]/60 text-xs">
                {AUDIT_ITEMS.map((item, index) => (
                  <div key={index} className="py-2.5 flex items-center justify-between">
                    <span className="text-[#E2E8F0]">
                      <span className="font-medium text-[#DDE1E5]">{item.user}</span>{" "}
                      {item.action}{" "}
                      {item.target && (
                        <span className={item.highlight || "font-medium"}>
                          {item.target}
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-[#71717A]">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function KanbanCard({ issue }: { issue: PreviewIssue }) {
  const prio = PRIORITY_CONFIG[issue.priority]

  return (
    <div className="group rounded-lg border border-[#27272A] bg-[#18181B] p-3 transition-colors hover:border-[#3F3F46]">
      <p className="text-xs font-medium leading-snug text-[#E2E8F0] line-clamp-2">
        {issue.title}
      </p>

      <div className="mt-3 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          {/* Priority indicator */}
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${prio.dot}`} />
            <span className="text-[#94A3B8]">{prio.label}</span>
          </div>

          <span className="text-[#3F3F46]">·</span>

          {/* Project Label Chip */}
          <span
            className={`rounded border px-1.5 py-0.5 text-[10px] font-mono ${issue.labelClass}`}
          >
            {issue.label}
          </span>
        </div>

        {/* Issue Key */}
        <span className="font-mono text-[11px] text-[#71717A]">#{issue.id}</span>
      </div>
    </div>
  )
}
