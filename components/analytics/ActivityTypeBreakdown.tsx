"use client"

import type { ActivityTypeBreakdown as ActivityTypeItem } from "@/services/analytics.service"

type ActivityTypeBreakdownProps = {
  data: ActivityTypeItem[]
}

const TYPE_CONFIG: Record<
  string,
  { label: string; color: string; dotClass: string; barColor: string }
> = {
  ISSUE_CREATED: {
    label: "Issues Created",
    color: "#10B981",
    dotClass: "bg-emerald-400",
    barColor: "bg-emerald-400",
  },
  ISSUE_STATUS_UPDATED: {
    label: "Status Changed",
    color: "#F59E0B",
    dotClass: "bg-amber-400",
    barColor: "bg-amber-400",
  },
  COMMENT_CREATED: {
    label: "Comments Added",
    color: "#DDE1E5",
    dotClass: "bg-[#DDE1E5]",
    barColor: "bg-[#DDE1E5]",
  },
  ISSUE_ASSIGNED: {
    label: "Assignee Updated",
    color: "#38BDF8",
    dotClass: "bg-sky-400",
    barColor: "bg-sky-400",
  },
  ISSUE_UNASSIGNED: {
    label: "Unassigned",
    color: "#94A3B8",
    dotClass: "bg-slate-400",
    barColor: "bg-slate-400",
  },
  ISSUE_TITLE_UPDATED: {
    label: "Title Edited",
    color: "#71717A",
    dotClass: "bg-zinc-500",
    barColor: "bg-zinc-500",
  },
  ISSUE_DESCRIPTION_UPDATED: {
    label: "Description Edited",
    color: "#71717A",
    dotClass: "bg-zinc-500",
    barColor: "bg-zinc-500",
  },
  PROJECT_MEMBER_ADDED: {
    label: "Member Added",
    color: "#14B8A6",
    dotClass: "bg-teal-400",
    barColor: "bg-teal-400",
  },
  PROJECT_MEMBER_REMOVED: {
    label: "Member Removed",
    color: "#F43F5E",
    dotClass: "bg-rose-500",
    barColor: "bg-rose-500",
  },
}

function formatActionType(action: string): { label: string; dotClass: string; barColor: string } {
  if (action && TYPE_CONFIG[action]) {
    return TYPE_CONFIG[action]
  }

  const str = action || "Activity"
  const formatted = str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return {
    label: formatted,
    dotClass: "bg-zinc-400",
    barColor: "bg-zinc-400",
  }
}

export function ActivityTypeBreakdown({ data }: ActivityTypeBreakdownProps) {
  const items = Array.isArray(data) ? data : []
  const validItems = items.map((item) => ({
    type: String(item.activity_type || item.action_type || "UNKNOWN"),
    count: Number.isFinite(Number(item.count)) ? Number(item.count) : 0,
  }))

  const total = validItems.reduce((sum, item) => sum + item.count, 0)
  const sorted = [...validItems].sort((a, b) => b.count - a.count)

  return (
    <div className="rounded-lg border border-[#27272A] bg-[#18181B] p-5 shadow-xs">
      <div className="border-b border-[#27272A] pb-4">
        <h3 className="text-sm font-medium text-[#E2E8F0]">Activity Breakdown</h3>
        <p className="mt-0.5 text-xs text-[#94A3B8]">
          Distribution of actions performed across the board
        </p>
      </div>

      {sorted.length === 0 || total === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center text-center">
          <p className="text-sm text-[#94A3B8]">No activity categories recorded</p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Proportional horizontal segmented bar */}
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#27272A]">
            {sorted.map((item) => {
              const rawPct = total > 0 ? (item.count / total) * 100 : 0
              const pct = Number.isFinite(rawPct) ? Math.max(rawPct, 0) : 0
              const cfg = formatActionType(item.type)
              return (
                <div
                  key={item.type}
                  style={{ width: `${pct}%` }}
                  title={`${cfg.label}: ${item.count} (${pct.toFixed(1)}%)`}
                  className={`${cfg.barColor} transition-all duration-300`}
                />
              )
            })}
          </div>

          {/* List of items */}
          <div className="space-y-2.5 pt-1">
            {sorted.map((item) => {
              const rawPct = total > 0 ? (item.count / total) * 100 : 0
              const pct = Number.isFinite(rawPct) ? Math.max(rawPct, 0) : 0
              const cfg = formatActionType(item.type)

              return (
                <div
                  key={item.type}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.dotClass}`} />
                    <span className="truncate text-[#E2E8F0] font-medium">
                      {cfg.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[#E2E8F0]">{item.count}</span>
                    <span className="w-10 text-right font-mono text-[#94A3B8]">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
