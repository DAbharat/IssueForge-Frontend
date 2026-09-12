"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type IssueActivityItem = {
  id?: string | number
  message: string
  timestamp: string
  actor?: string
}

export type IssueActivityProps = {
  activities: IssueActivityItem[]
}

export default function IssueActivity({
  activities,
}: IssueActivityProps) {
  return (
    <Card className="w-full border-[#27272A] bg-[#101012]">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold text-[#E2E8F0]">
          Activity
        </CardTitle>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <p className="py-2 text-xs text-[#71717A]">
            No activity yet.
          </p>
        ) : (
          <div className="relative space-y-5">
            {activities.map((activity, index) => {
              const isLast = index === activities.length - 1

              return (
                <div
                  key={activity.id ?? `${activity.message}-${index}`}
                  className="relative flex gap-3"
                >
                  {/* Timeline */}
                  <div className="flex w-3 shrink-0 justify-center">
                    {!isLast && (
                      <div className="absolute left-[5px] top-3 h-full w-px bg-[#27272A]" />
                    )}

                    <div className="relative z-10 mt-1 h-2.5 w-2.5 rounded-full border-2 border-[#101012] bg-[#71717A]" />
                  </div>

                  {/* Activity content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-relaxed text-[#D4D4D8]">
                      {activity.actor && (
                        <span className="font-medium text-[#E2E8F0]">
                          {activity.actor}{" "}
                        </span>
                      )}

                      {activity.message}
                    </p>

                    <p className="mt-1 text-[10px] text-[#71717A]">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}