import axiosClient from "@/lib/axiosClient"
import { AxiosError } from "axios"

export type DailyActivityStat = {
  date: string
  total_activities: number
  activity_count: number
}

export type IssueVelocityStat = {
  date: string
  issues_created: number
  issues_completed: number
  created_count: number
  resolved_count: number
}

export type ActivityTypeBreakdown = {
  activity_type: string
  action_type: string
  count: number
}

export type MemberActivityStat = {
  user_id: number
  username: string
  fullname: string
  email?: string
  avatar_url: string | null
  issue_actions_count: number
  completed_issues_count: number
  activity_count: number
}

export type WorkspaceAnalyticsResponse = {
  workspace_id?: number
  total_activities: number
  daily_activities: DailyActivityStat[]
  issue_velocity: IssueVelocityStat[]
  activity_breakdown: ActivityTypeBreakdown[]
  activity_types: ActivityTypeBreakdown[]
  member_leaderboard: MemberActivityStat[]
  top_members: MemberActivityStat[]
}

export type ProjectAnalyticsResponse = {
  project_id?: number
  total_activities: number
  daily_activities: DailyActivityStat[]
  issue_velocity: IssueVelocityStat[]
  activity_breakdown: ActivityTypeBreakdown[]
  activity_types: ActivityTypeBreakdown[]
  member_leaderboard: MemberActivityStat[]
  member_stats: MemberActivityStat[]
}

export type AnalyticsQueryParams = {
  from?: string
  to?: string
  limit?: number
}

function normalizeAnalyticsResponse(res: any) {
  if (!res || typeof res !== "object") {
    return {
      total_activities: 0,
      daily_activities: [],
      issue_velocity: [],
      activity_breakdown: [],
      activity_types: [],
      member_leaderboard: [],
      top_members: [],
      member_stats: [],
    }
  }

  const daily_activities: DailyActivityStat[] = (res.daily_activities || []).map((d: any) => {
    const count = Number(d.total_activities ?? d.activity_count ?? 0)
    const safeCount = Number.isFinite(count) ? count : 0
    return {
      date: String(d.date || ""),
      total_activities: safeCount,
      activity_count: safeCount,
    }
  })

  const issue_velocity: IssueVelocityStat[] = (res.issue_velocity || []).map((v: any) => {
    const created = Number(v.issues_created ?? v.created_count ?? 0)
    const completed = Number(v.issues_completed ?? v.resolved_count ?? 0)
    const safeCreated = Number.isFinite(created) ? created : 0
    const safeCompleted = Number.isFinite(completed) ? completed : 0
    return {
      date: String(v.date || ""),
      issues_created: safeCreated,
      issues_completed: safeCompleted,
      created_count: safeCreated,
      resolved_count: safeCompleted,
    }
  })

  const rawBreakdown = res.activity_breakdown || res.activity_types || []
  const activity_breakdown: ActivityTypeBreakdown[] = rawBreakdown.map((b: any) => {
    const rawCount = Number(b.count ?? 0)
    const safeCount = Number.isFinite(rawCount) ? rawCount : 0
    const typeStr = String(b.activity_type || b.action_type || "UNKNOWN")
    return {
      activity_type: typeStr,
      action_type: typeStr,
      count: safeCount,
    }
  })

  const rawMembers = res.member_leaderboard || res.top_members || res.member_stats || []
  const member_leaderboard: MemberActivityStat[] = rawMembers.map((m: any) => {
    const actions = Number(m.issue_actions_count ?? m.activity_count ?? 0)
    const completed = Number(m.completed_issues_count ?? 0)
    const safeActions = Number.isFinite(actions) ? actions : 0
    const safeCompleted = Number.isFinite(completed) ? completed : 0
    return {
      user_id: Number(m.user_id ?? 0) || 0,
      fullname: String(m.fullname || m.username || "Member"),
      username: String(m.username || ""),
      email: String(m.email || ""),
      avatar_url: m.avatar_url || null,
      issue_actions_count: safeActions,
      completed_issues_count: safeCompleted,
      activity_count: safeActions,
    }
  })

  const calculatedTotal = daily_activities.reduce(
    (acc, d) => acc + (d.total_activities || 0),
    0,
  )
  const total_activities = Number.isFinite(Number(res.total_activities))
    ? Number(res.total_activities)
    : calculatedTotal

  return {
    ...res,
    total_activities,
    daily_activities,
    issue_velocity,
    activity_breakdown,
    activity_types: activity_breakdown,
    member_leaderboard,
    top_members: member_leaderboard,
    member_stats: member_leaderboard,
  }
}

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>
  return (
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    axiosError.message ||
    fallback
  )
}

export async function getWorkspaceAnalytics(
  workspaceId: string | number,
  params?: AnalyticsQueryParams,
): Promise<WorkspaceAnalyticsResponse> {
  try {
    const response = await axiosClient.get<any>(
      `/api/workspaces/${workspaceId}/analytics`,
      { params },
    )
    return normalizeAnalyticsResponse(response.data) as WorkspaceAnalyticsResponse
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load workspace analytics."))
  }
}

export async function getProjectAnalytics(
  projectId: string | number,
  params?: AnalyticsQueryParams,
): Promise<ProjectAnalyticsResponse> {
  try {
    const response = await axiosClient.get<any>(
      `/api/projects/${projectId}/analytics`,
      { params },
    )
    return normalizeAnalyticsResponse(response.data) as ProjectAnalyticsResponse
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load project analytics."))
  }
}
