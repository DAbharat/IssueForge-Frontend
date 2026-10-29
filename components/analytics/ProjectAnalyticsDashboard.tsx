"use client"

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  RefreshCw,
  TrendingUp,
} from "lucide-react"
import { useProjectAnalytics } from "@/hooks/use-analytics"
import { AnalyticsMetricCard } from "./AnalyticsMetricCard"
import { AnalyticsDateFilter } from "./AnalyticsDateFilter"
import { DailyActivityChart } from "./DailyActivityChart"
import { IssueVelocityChart } from "./IssueVelocityChart"
import { ActivityTypeBreakdown } from "./ActivityTypeBreakdown"
import { MemberActivityLeaderboard } from "./MemberActivityLeaderboard"

type ProjectAnalyticsDashboardProps = {
  projectId: string | number
  projectName?: string
}

export function ProjectAnalyticsDashboard({
  projectId,
  projectName,
}: ProjectAnalyticsDashboardProps) {
  const { data, isLoading, error, days, setDays, reload } = useProjectAnalytics(projectId)

  const dailyActivities = data?.daily_activities ?? []
  const velocityItems = data?.issue_velocity ?? []

  const totalActivities =
    Number(data?.total_activities) ||
    dailyActivities.reduce(
      (acc, d) => acc + (Number(d.total_activities ?? d.activity_count ?? 0) || 0),
      0,
    )

  const totalCreated = velocityItems.reduce(
    (acc, v) => acc + (Number(v.issues_created ?? v.created_count ?? 0) || 0),
    0,
  )
  const totalResolved = velocityItems.reduce(
    (acc, v) => acc + (Number(v.issues_completed ?? v.resolved_count ?? 0) || 0),
    0,
  )
  const netVelocity = totalResolved - totalCreated

  const breakdownData = data?.activity_breakdown || data?.activity_types || []
  const memberData = data?.member_leaderboard || data?.member_stats || []

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#27272A] pb-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[#E2E8F0]">
            Project Analytics
          </h2>
          <p className="mt-1 text-xs text-[#94A3B8]">
            {projectName ? `Activity and velocity for ${projectName}` : "Activity and velocity"}
            {" "}over the selected period.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AnalyticsDateFilter days={days} onSelect={setDays} disabled={isLoading} />

          <button
            type="button"
            onClick={() => reload()}
            disabled={isLoading}
            title="Refresh analytics data"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#27272A] bg-[#18181B] text-[#94A3B8] transition-colors hover:bg-[#27272A] hover:text-[#E2E8F0] disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => reload()}
            className="rounded border border-red-500/40 bg-red-500/20 px-2.5 py-1 text-xs font-medium text-red-200 hover:bg-red-500/30"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state skeleton */}
      {isLoading && !data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-lg border border-[#27272A] bg-[#18181B]"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-72 animate-pulse rounded-lg border border-[#27272A] bg-[#18181B]" />
            <div className="h-72 animate-pulse rounded-lg border border-[#27272A] bg-[#18181B]" />
          </div>
        </div>
      )}

      {/* Loaded Dashboard Content */}
      {data && (
        <>
          {/* KPI Metrics Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AnalyticsMetricCard
              title="Total Activities"
              value={totalActivities}
              subtext={`Recorded across last ${days} days`}
              icon={Activity}
            />

            <AnalyticsMetricCard
              title="Issues Created"
              value={totalCreated}
              subtext="New issues opened"
              icon={PlusCircle}
            />

            <AnalyticsMetricCard
              title="Issues Resolved"
              value={totalResolved}
              subtext="Completed & closed issues"
              icon={CheckCircle2}
            />

            <AnalyticsMetricCard
              title="Net Issue Velocity"
              value={netVelocity >= 0 ? `+${netVelocity}` : `${netVelocity}`}
              subtext={netVelocity >= 0 ? "Closing more than opening" : "More issues opened than closed"}
              icon={TrendingUp}
              trend={{
                label: netVelocity >= 0 ? "Positive" : "Backlog Growth",
                isPositive: netVelocity >= 0,
              }}
            />
          </div>

          {/* Primary Charts: Daily Activity & Velocity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DailyActivityChart data={dailyActivities} />
            <IssueVelocityChart data={velocityItems} />
          </div>

          {/* Secondary Row: Breakdown & Leaderboard */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ActivityTypeBreakdown data={breakdownData} />
            <MemberActivityLeaderboard
              members={memberData}
              title="Project Member Activity"
              description={`Active contributors on this project in the last ${days} days`}
            />
          </div>
        </>
      )}
    </div>
  )
}
