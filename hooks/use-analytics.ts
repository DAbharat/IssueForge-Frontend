"use client"

import { useCallback, useEffect, useState } from "react"
import {
  getWorkspaceAnalytics,
  getProjectAnalytics,
  type WorkspaceAnalyticsResponse,
  type ProjectAnalyticsResponse,
} from "@/services/analytics.service"

export type DateRangeDays = 7 | 14 | 30 | 90

function calculateDateRange(days: DateRangeDays): { from: string; to: string } {
  const toDate = new Date()
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)

  const to = toDate.toISOString().split("T")[0]
  const from = fromDate.toISOString().split("T")[0]

  return { from, to }
}

export function useWorkspaceAnalytics(
  workspaceId: string | number | null | undefined,
  initialDays: DateRangeDays = 30,
) {
  const [days, setDays] = useState<DateRangeDays>(initialDays)
  const [data, setData] = useState<WorkspaceAnalyticsResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    if (!workspaceId) {
      setData(null)
      setIsLoading(false)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { from, to } = calculateDateRange(days)
      const res = await getWorkspaceAnalytics(workspaceId, { from, to, limit: 10 })
      setData(res)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load workspace analytics"
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [workspaceId, days])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    data,
    isLoading,
    error,
    days,
    setDays,
    reload: fetchAnalytics,
  }
}

export function useProjectAnalytics(
  projectId: string | number | null | undefined,
  initialDays: DateRangeDays = 30,
) {
  const [days, setDays] = useState<DateRangeDays>(initialDays)
  const [data, setData] = useState<ProjectAnalyticsResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    if (!projectId) {
      setData(null)
      setIsLoading(false)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { from, to } = calculateDateRange(days)
      const res = await getProjectAnalytics(projectId, { from, to, limit: 10 })
      setData(res)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load project analytics"
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [projectId, days])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    data,
    isLoading,
    error,
    days,
    setDays,
    reload: fetchAnalytics,
  }
}
