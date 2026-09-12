"use client"

import {
  CircleDot,
  MessageSquare,
  Pencil,
  UserPlus,
} from "lucide-react"

export type IssueActivityTabItem = {
  id?: string | number
  actor: string
  action: string
  timestamp: string
  details?: string
  type?: "status" | "comment" | "assignee" | "update"
}

type IssueActivityTabProps = {
  activities: IssueActivityTabItem[]
}

const ACTIVITY_ICONS = {
  status: CircleDot,
  comment: MessageSquare,
  assignee: UserPlus,
  update: Pencil,
}

export default function IssueActivityTab({
  activities,
}: IssueActivityTabProps) {
  return (
    <div className="w-full">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-[#E2E8F0]">
          Activity
        </h2>
        <p className="mt-1 text-xs text-[#71717A]">
          Changes and updates made to this issue.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-lg border border-[#27272A] bg-[#101012] px-4 py-8 text-center">
          <p className="text-xs text-[#71717A]">
            No activity yet.
          </p>
        </div>
      ) : (
        <div className="relative">
          {activities.map((activity, index) => {
            const Icon =
              ACTIVITY_ICONS[activity.type ?? "update"]

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