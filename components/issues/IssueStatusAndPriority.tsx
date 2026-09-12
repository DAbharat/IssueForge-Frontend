"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown } from "lucide-react"
import type { ReactNode } from "react"

export type IssueStatus = "todo" | "in_progress" | "done"
export type IssuePriority = "low" | "medium" | "high"

export type IssueStatusAndPriorityProps = {
  status: IssueStatus
  priority: IssuePriority
  assignee?: {
    initials: string
    name: string
    email?: string
  }
  project?: {
    initials: string
    name: string
  }
  milestone?: string
  onStatusChange?: (status: IssueStatus) => void
  onPriorityChange?: (priority: IssuePriority) => void
}

const STATUS_LABELS: Record<IssueStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
}

const PRIORITY_LABELS: Record<IssuePriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

const STATUS_DOTS: Record<IssueStatus, string> = {
  todo: "bg-[#71717A]",
  in_progress: "bg-[#CA8A04]",
  done: "bg-[#22C55E]",
}

const PRIORITY_DOTS: Record<IssuePriority, string> = {
  low: "bg-[#71717A]",
  medium: "bg-[#CA8A04]",
  high: "bg-[#EF4444]",
}

function FieldRow<T extends string>({
  label,
  value,
  labels,
  dots,
  onChange,
}: {
  label: string
  value: T
  labels: Record<T, string>
  dots: Record<T, string>
  onChange?: (value: T) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium text-[#94A3B8]">{label}</span>

      <Select value={value} onValueChange={(v) => onChange?.(v as T)}>
        <SelectTrigger className="h-8 w-auto min-w-33 gap-2 border-[#27272A] bg-[#18181B] text-xs font-medium text-[#E2E8F0] hover:border-[#3F3F46] focus:ring-[#5E6AD2]/40">
          <span className="flex items-center gap-2">
            <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${dots[value]}`} />
            <SelectValue />
          </span>
        </SelectTrigger>

        <SelectContent className="border-[#27272A] bg-[#18181B]">
          {(Object.keys(labels) as T[]).map((key) => (
            <SelectItem
              key={key}
              value={key}
              className="text-xs text-[#E2E8F0] focus:bg-[#27272A] focus:text-[#E2E8F0]"
            >
              <span className="flex items-center gap-2">
                <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${dots[key]}`} />
                <span>{labels[key]}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function StaticRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium text-[#94A3B8]">{label}</span>
      {children}
    </div>
  )
}

export default function IssueStatusAndPriority({
  status,
  priority,
  assignee = { initials: "U", name: "Unassigned" },
  project = { initials: "P", name: "Project" },
  milestone = "No milestone",
  onStatusChange,
  onPriorityChange,
}: IssueStatusAndPriorityProps) {
  return (
    <div className="w-full rounded-md border border-[#27272A] bg-[#101012] p-3">
      <h2 className="mb-4 text-xs font-semibold text-[#E2E8F0]">
        Status &amp; Priority
      </h2>

      <div className="flex flex-col gap-4">
        <FieldRow
          label="Status"
          value={status}
          labels={STATUS_LABELS}
          dots={STATUS_DOTS}
          onChange={onStatusChange}
        />

        <FieldRow
          label="Priority"
          value={priority}
          labels={PRIORITY_LABELS}
          dots={PRIORITY_DOTS}
          onChange={onPriorityChange}
        />

        <StaticRow label="Assignee">
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            {/* <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5E6AD2] text-[10px] font-medium text-[#E2E8F0]">
              {assignee.initials}
            </span> */}
            <div className="min-w-0 flex-1 text-right">
              <p className="truncate text-xs font-medium text-[#E2E8F0]">
                {assignee.name}
              </p>
              {assignee.email && (
                <p className="truncate text-[10px] text-[#94A3B8]">
                  {assignee.email}
                </p>
              )}
            </div>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />
          </div>
        </StaticRow>

        <div className="h-px bg-[#27272A]" />

        <StaticRow label="Project">
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            {/* <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-[#5E6AD2] text-[9px] font-semibold text-[#E2E8F0]">
              {project.initials}
            </span> */}
            <span className="truncate text-xs text-[#E2E8F0]">
              {project.name}
            </span>
          </div>
        </StaticRow>

        <div className="h-px bg-[#27272A]" />

        <StaticRow label="Milestone">
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            <span className="truncate text-xs text-[#94A3B8]">{milestone}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />
          </div>
        </StaticRow>
      </div>
    </div>
  )
}