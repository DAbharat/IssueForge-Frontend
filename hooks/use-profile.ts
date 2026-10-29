"use client"

import { useCallback, useEffect, useState } from "react"

import { useAuth } from "@/hooks/use-auth"
import { me } from "@/services/account.service"
import { listProjectsByLead, getProjectById, type Project } from "@/services/projects.service"
import {
  listAssignedIssues,
  listCreatedIssues,
  listProjectIssues,
  type Issue,
} from "@/services/issues.service"
import { listIssueLabels, type Label } from "@/services/labels.service"

export type ProfileWorkspace = {
  id: string | number
  name: string
  role?: string
  created_at?: string
}

export type ProfileProject = {
  id: string | number
  name: string
  description?: string
  workspace_id?: string | number
  workspace_name?: string
  lead_id?: string | number
  lead_name?: string
  created_at?: string
  updated_at?: string
}

export type ProfileIssue = {
  id: string | number
  project_id?: string | number
  project_name?: string
  workspace_id?: string | number
  workspace_name?: string
  title: string
  description?: string
  status?: string
  priority?: string
  labels?: Label[]
  created_at?: string
  due_date?: string
}

export type ProfileUser = {
  id?: string | number
  fullname?: string
  username?: string
  email?: string
  created_at?: string
  workspaces?: ProfileWorkspace[]
  projects?: ProfileProject[]
  issues?: ProfileIssue[]
}

export type UseProfileOptions = {
  includeDetails?: boolean
}

export function useProfile(options?: UseProfileOptions) {
  const includeDetails = Boolean(options?.includeDetails)
  const { loadTokens } = useAuth()
  const [profile, setProfile] = useState<ProfileUser | null>(null)
  const [projects, setProjects] = useState<ProfileProject[]>([])
  const [issues, setIssues] = useState<ProfileIssue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [error, setError] = useState("")

  const loadProfile = useCallback(async () => {
    const { accessToken, refreshToken } = loadTokens()

    if (!accessToken && !refreshToken) {
      setError("Please log in to view your profile.")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const user = await me()
      setProfile(user)
      setIsLoading(false)

      if (includeDetails) {
        setIsLoadingDetails(true)
        const workspaceList = Array.isArray(user?.workspaces) ? user.workspaces : []

        // 1. Fetch projects for each workspace
        const projectsNested = await Promise.all(
          workspaceList.map(async (ws: ProfileWorkspace) => {
            try {
              const list = await listProjectsByLead(ws.id)
              if (!Array.isArray(list)) return []
              const projectItems = await Promise.all(
                list.map(async (p: Project) => {
                  let createdAt = p.created_at
                  let updatedAt = p.updated_at

                  // If zero date or missing, fetch real timestamps from project details endpoint
                  if (!createdAt || createdAt.startsWith("0001")) {
                    try {
                      const details = await getProjectById(p.id)
                      if (details?.created_at && !details.created_at.startsWith("0001")) {
                        createdAt = details.created_at
                        updatedAt = details.updated_at
                      }
                    } catch {
                      // fallback to existing
                    }
                  }

                  return {
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    workspace_id: ws.id,
                    workspace_name: ws.name,
                    lead_id: p.lead_id,
                    lead_name: p.lead_name,
                    created_at: createdAt,
                    updated_at: updatedAt,
                  }
                })
              )
              return projectItems
            } catch {
              return []
            }
          })
        )

        const allProjects: ProfileProject[] = projectsNested.flat()

        // 2. Fetch issues: assigned, created, and project issues
        const [assignedResult, createdResult, projectIssuesResults] = await Promise.all([
          listAssignedIssues().catch(() => []),
          listCreatedIssues().catch(() => []),
          Promise.all(allProjects.map((p) => listProjectIssues(p.id).catch(() => []))),
        ])

        const issuesMap = new Map<string, ProfileIssue>()

        // Helper to find workspace info for a project ID or project Name
        const getWorkspaceInfo = (projectId?: string | number, projectName?: string) => {
          if (projectId != null) {
            const foundProject = allProjects.find(
              (p) => String(p.id) === String(projectId)
            )
            if (foundProject) {
              return {
                workspace_id: foundProject.workspace_id,
                workspace_name: foundProject.workspace_name,
                project_name: foundProject.name,
              }
            }
          }
          if (projectName) {
            const foundByName = allProjects.find(
              (p) => p.name.toLowerCase() === projectName.toLowerCase()
            )
            if (foundByName) {
              return {
                workspace_id: foundByName.workspace_id,
                workspace_name: foundByName.workspace_name,
                project_name: foundByName.name,
              }
            }
          }
          const defaultWs = workspaceList[0]
          return {
            workspace_id: defaultWs?.id,
            workspace_name: defaultWs?.name,
            project_name: projectName,
          }
        }

        // Add assigned issues
        if (Array.isArray(assignedResult)) {
          for (const item of assignedResult) {
            if (item && item.id != null) {
              const key = String(item.id)
              const wsInfo = getWorkspaceInfo(item.project_id, (item as any).project_name)
              issuesMap.set(key, {
                id: item.id,
                project_id: item.project_id,
                project_name: wsInfo.project_name || (item as any).project_name,
                workspace_id: wsInfo.workspace_id,
                workspace_name: wsInfo.workspace_name,
                title: item.title,
                description: item.description,
                status: item.status,
                priority: item.priority,
                created_at: item.created_at,
                due_date: item.due_date,
              })
            }
          }
        }

        // Add created issues
        if (Array.isArray(createdResult)) {
          for (const item of createdResult) {
            if (item && item.id != null) {
              const key = String(item.id)
              if (!issuesMap.has(key)) {
                const wsInfo = getWorkspaceInfo(item.project_id, (item as any).project_name)
                issuesMap.set(key, {
                  id: item.id,
                  project_id: item.project_id,
                  project_name: wsInfo.project_name || (item as any).project_name,
                  workspace_id: wsInfo.workspace_id,
                  workspace_name: wsInfo.workspace_name,
                  title: item.title,
                  description: item.description,
                  status: item.status,
                  priority: item.priority,
                  created_at: item.created_at,
                  due_date: item.due_date,
                })
              }
            }
          }
        }

        // Add issues from user's projects
        for (let i = 0; i < allProjects.length; i++) {
          const project = allProjects[i]
          const pIssues = projectIssuesResults[i]
          if (Array.isArray(pIssues)) {
            for (const item of pIssues) {
              if (item && item.id != null) {
                const key = String(item.id)
                if (!issuesMap.has(key)) {
                  issuesMap.set(key, {
                    id: item.id,
                    project_id: project.id,
                    project_name: project.name,
                    workspace_id: project.workspace_id,
                    workspace_name: project.workspace_name,
                    title: item.title,
                    description: item.description,
                    status: item.status,
                    priority: item.priority,
                    created_at: item.created_at,
                    due_date: item.due_date,
                  })
                }
              }
            }
          }
        }

        // Fetch labels for all unique issues
        const rawIssues = Array.from(issuesMap.values())
        const issuesWithLabels: ProfileIssue[] = await Promise.all(
          rawIssues.map(async (issue) => {
            try {
              const labels = await listIssueLabels(issue.id)
              return {
                ...issue,
                labels: Array.isArray(labels) ? labels : [],
              }
            } catch {
              return {
                ...issue,
                labels: [],
              }
            }
          })
        )

        // Sort by created_at DESC
        issuesWithLabels.sort((a, b) => {
          const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
          const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
          return timeB - timeA
        })

        allProjects.sort((a, b) => {
          const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
          const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
          return timeB - timeA
        })

        setProjects(allProjects)
        setIssues(issuesWithLabels)
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                projects: allProjects,
                issues: issuesWithLabels,
              }
            : prev
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load profile")
    } finally {
      setIsLoading(false)
      setIsLoadingDetails(false)
    }
  }, [loadTokens, includeDetails])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  return {
    profile,
    projects,
    issues,
    isLoading,
    isLoadingDetails,
    error,
    refetch: loadProfile,
  }
}
