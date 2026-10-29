"use client"

import {
  Archive,
  CircleDot,
  Crown,
  FolderPlus,
  Pencil,
  RotateCcw,
  Trash2,
  UserMinus,
  UserPlus,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import type { ProjectActivityItem } from "@/hooks/use-project-activities"

export type { ProjectActivityItem }

type ProjectActivityProps = {
  activities?: ProjectActivityItem[]
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  onViewIssues?: () => void
}

const ACTIVITY_ICONS = {
  created: FolderPlus,
  update: Pencil,
  member_add: UserPlus,
  member_remove: UserMinus,
  lead: Crown,
  archive: Archive,
  delete: Trash2,
  restore: RotateCcw,
  issue: CircleDot,
}

export default function ProjectActivity({
  activities = [],
  isLoading = false,
  error = null,
  onRetry,
  onViewIssues,
}: ProjectActivityProps) {
  return (
    <div className="w-full">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#E2E8F0]">Activity</h2>
          <p className="mt-1 text-xs text-[#71717A]">
            Changes and updates made to this project.
          </p>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#27272A] bg-[#101012] px-2.5 py-1 text-xs text-[#A1A1AA] transition-colors hover:border-[#3F3F46] hover:text-[#E2E8F0] disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {isLoading && activities.length === 0 ? (
        <div className="space-y-6 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-6 w-6 shrink-0 animate-pulse rounded-full border border-[#27272A] bg-[#18181B]" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-48 animate-pulse rounded bg-[#18181B]" />
                <div className="h-2.5 w-32 animate-pulse rounded bg-[#141416]" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-900/40 bg-red-950/20 px-4 py-6 text-center">
          <AlertCircle className="mx-auto h-5 w-5 text-red-400" />
          <p className="mt-2 text-xs text-red-300">{error}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[#27272A] bg-[#101012] px-3 py-1.5 text-xs text-[#E2E8F0] hover:bg-[#18181B]"
            >
              Retry
            </button>
          )}
        </div>
      ) : activities.length === 0 ? (
        <div className="rounded-lg border border-[#27272A] bg-[#101012] px-4 py-8 text-center">
          <p className="text-xs text-[#71717A]">No activity yet.</p>
          {onViewIssues && (
            <button
              type="button"
              onClick={onViewIssues}
              className="mt-4 inline-flex items-center justify-center rounded-md border border-[#27272A] bg-[#18181B] px-3 py-1.5 text-xs font-medium text-[#D4D4D8] transition-colors hover:border-[#3F3F46] hover:text-[#E2E8F0]"
            >
              View issues
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          {activities.map((activity, index) => {
            const Icon = ACTIVITY_ICONS[activity.type] ?? Pencil
            const isLast = index === activities.length - 1

            return (
              <div
                key={activity.id ?? `${activity.actor}-${index}`}
                className="relative flex gap-3 pb-6"
              >
                {!isLast && (
                  <div className="absolute left-[11px] top-6 h-[calc(100%-10px)] w-px bg-[#27272A]" />
                )}

                <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#27272A] bg-[#101012] text-[#71717A]">
                  <Icon className="h-3 w-3" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-1.5">
                    <span className="text-xs font-medium text-[#E2E8F0]">
                      {activity.actor}
                    </span>

                    <span className="text-xs text-[#A1A1AA]">
                      {activity.action}
                    </span>
                  </div>

                  {activity.details && (
                    <p className="mt-1 text-xs leading-5 text-[#71717A]">
                      {activity.details}
                    </p>
                  )}

                  <p className="mt-1.5 text-[10px] text-[#52525B]">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
