"use client"

import type { MemberActivityStat } from "@/services/analytics.service"

type MemberActivityLeaderboardProps = {
  members: MemberActivityStat[]
  title?: string
  description?: string
}

export function MemberActivityLeaderboard({
  members,
  title = "Most Active Members",
  description = "Ranked by total issues, status updates, and comments",
}: MemberActivityLeaderboardProps) {
  const items = Array.isArray(members) ? members : []
  const safeItems = items.map((m) => {
    const rawCount = Number(m.issue_actions_count ?? m.activity_count ?? 0)
    const count = Number.isFinite(rawCount) ? rawCount : 0
    return {
      ...m,
      safeCount: count,
    }
  })

  const maxCount = safeItems.length > 0 ? Math.max(...safeItems.map((m) => m.safeCount), 1) : 1

  return (
    <div className="rounded-lg border border-[#27272A] bg-[#18181B] p-5 shadow-xs">
      <div className="border-b border-[#27272A] pb-4">
        <h3 className="text-sm font-medium text-[#E2E8F0]">{title}</h3>
        <p className="mt-0.5 text-xs text-[#94A3B8]">{description}</p>
      </div>

      {safeItems.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center text-center">
          <p className="text-sm text-[#94A3B8]">No member activity recorded yet</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3.5">
          {safeItems.map((m, index) => {
            const rawPct = maxCount > 0 ? (m.safeCount / maxCount) * 100 : 0
            const pct = Number.isFinite(rawPct) ? Math.min(Math.max(rawPct, 4), 100) : 4
            const initial = (m.fullname || m.username || "U").charAt(0).toUpperCase()

            return (
              <div key={m.user_id || index} className="group flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-mono font-medium text-[#94A3B8]">
                      #{index + 1}
                    </span>

                    {m.avatar_url ? (
                      <img
                        src={m.avatar_url}
                        alt={m.fullname || m.username}
                        className="h-6 w-6 shrink-0 rounded-full object-cover border border-[#27272A]"
                      />
                    ) : (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#27272A] text-[11px] font-medium text-[#E2E8F0]">
                        {initial}
                      </div>
                    )}

                    <div className="truncate">
                      <span className="font-medium text-[#E2E8F0]">
                        {m.fullname || m.username}
                      </span>
                      {m.username && (
                        <span className="ml-1.5 text-[#71717A]">@{m.username}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 font-mono">
                    <span className="font-medium text-[#E2E8F0]">
                      {m.safeCount}
                    </span>
                    <span className="text-[#71717A]">actions</span>
                  </div>
                </div>

                {/* Relative progress bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#27272A]/70">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full rounded-full bg-[#DDE1E5] transition-all duration-300"
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
