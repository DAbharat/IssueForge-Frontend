"use client"

import { CheckCircle2, Circle, Clock3, ListTodo, Users } from "lucide-react"
import type { Project } from "@/services/projects.service"
import type { ProjectIssueItem } from "@/components/projects/ProjectIssues"
import type { ProjectMemberItem } from "@/components/projects/ProjectMembers"

const STATUS_LABELS = {
  todo: "To do",
  in_progress: "In progress",
  done: "Completed",
} as const

const STATUS_DOTS = {
  todo: "bg-[#71717A]",
  in_progress: "bg-[#CA8A04]",
  done: "bg-[#22C55E]",
} as const

const PRIORITY_DOTS = {
  low: "bg-[#71717A]",
  medium: "bg-[#CA8A04]",
  high: "bg-[#EF4444]",
} as const

type ProjectOverviewProps = {
  project: Project
  issues: ProjectIssueItem[]
  members: ProjectMemberItem[]
  onCreateIssue: () => void
  onIssueSelect: (issueId: string | number) => void
  onViewIssues: () => void
  onViewMembers: () => void
}

export default function ProjectOverview({
  project,
  issues,
  members,
  onCreateIssue,
  onIssueSelect,
  onViewIssues,
  onViewMembers,
}: ProjectOverviewProps) {
  const counts = {
    total: issues.length,
    todo: issues.filter((issue) => issue.status === "todo").length,
    inProgress: issues.filter((issue) => issue.status === "in_progress").length,
    done: issues.filter((issue) => issue.status === "done").length,
  }

  const recentIssues = [...issues]
    .sort((left, right) => {
      const leftDate = left.createdAt ? new Date(left.createdAt).getTime() : 0
      const rightDate = right.createdAt ? new Date(right.createdAt).getTime() : 0
      return rightDate - leftDate
    })
    .slice(0, 5)

  const summaryCards = [
    { label: "Total issues", count: counts.total, icon: ListTodo },
    { label: "To do", count: counts.todo, icon: Circle },
    { label: "In progress", count: counts.inProgress, icon: Clock3 },
    { label: "Completed", count: counts.done, icon: CheckCircle2 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#E2E8F0]">Project overview</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#94A3B8]">
            A quick summary of {project.name}&apos;s current progress and work.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateIssue}
          className="inline-flex shrink-0 items-center justify-center rounded-md border border-[#3F3F46] bg-[#27272A] px-4 py-2 text-xs font-medium text-[#E2E8F0] transition-colors hover:bg-[#3F3F46]"
        >
          Create issue
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(({ label, count, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-[#27272A] bg-[#101012] p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-[#94A3B8]">{label}</p>
              <Icon className="h-4 w-4 text-[#71717A]" />
            </div>
            <p className="mt-4 text-3xl font-semibold leading-none tabular-nums text-[#E2E8F0]">
              {count}
            </p>
          </div>
        ))}
      </div>

      {issues.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#27272A] bg-[#101012] px-6 py-12 text-center">
          <p className="text-sm font-medium text-[#E2E8F0]">No issues in this project yet</p>
          <p className="mt-2 text-xs text-[#94A3B8]">
            Create the first issue to start tracking project work.
          </p>
          <button
            type="button"
            onClick={onCreateIssue}
            className="mt-5 inline-flex items-center justify-center rounded-md border border-[#3F3F46] bg-[#27272A] px-4 py-2 text-xs font-medium text-[#E2E8F0] transition-colors hover:bg-[#3F3F46]"
          >
            Create issue
          </button>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <section className="rounded-xl border border-[#27272A] bg-[#101012] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[#E2E8F0]">Recent issues</h3>
                <p className="mt-1 text-xs text-[#71717A]">Newest issues by creation date.</p>
              </div>
              <button
                type="button"
                onClick={onViewIssues}
                className="shrink-0 text-xs font-medium text-[#94A3B8] transition-colors hover:text-[#E2E8F0]"
              >
                View all issues
              </button>
            </div>

            <div className="mt-4 divide-y divide-[#27272A]">
              {recentIssues.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => issue.id != null && onIssueSelect(issue.id)}
                  className="flex w-full items-center gap-3 py-3 text-left transition-colors first:pt-0 last:pb-0 hover:text-[#E2E8F0]"
                >
                  <span className="w-12 shrink-0 text-xs tabular-nums text-[#71717A]">
                    #{issue.id}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-[#D4D4D8]">
                    {issue.title}
                  </span>
                  <span className="hidden items-center gap-1.5 text-[11px] text-[#94A3B8] sm:flex">
                    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[issue.status]}`} />
                    {STATUS_LABELS[issue.status]}
                  </span>
                  {issue.priority && (
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_DOTS[issue.priority]}`}
                      title={`${issue.priority} priority`}
                    />
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#27272A] bg-[#101012] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[#E2E8F0]">Project members</h3>
                <p className="mt-1 text-xs text-[#71717A]">{members.length} members</p>
              </div>
              <Users className="h-4 w-4 text-[#71717A]" />
            </div>

            <div className="mt-4 space-y-3">
              {members.slice(0, 4).map((member) => (
                <div key={member.id ?? member.username} className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#27272A] bg-[#18181B] text-[10px] font-semibold text-[#D4D4D8]">
                    {member.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-[#D4D4D8]">{member.fullname}</p>
                    <p className="truncate text-[11px] text-[#71717A]">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onViewMembers}
              className="mt-5 text-xs font-medium text-[#94A3B8] transition-colors hover:text-[#E2E8F0]"
            >
              View members
            </button>
          </section>
        </div>
      )}
    </div>
  )
}
