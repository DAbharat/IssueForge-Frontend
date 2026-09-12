"use client"

import { useState, useEffect } from "react"
import ProjectTabs, { type ProjectTabKey } from "@/components/projects/ProjectTabs"
import ProjectIssues, {
  type ProjectIssueItem,
} from "@/components/projects/ProjectIssues"
import ProjectMembers, {
  type ProjectMemberItem,
} from "@/components/projects/ProjectMembers"
import { getProjectById, type Project } from "@/services/projects.service"
import { listProjectIssues, type Issue } from "@/services/issues.service"
import {
  listProjectMembers,
  type ProjectMember,
} from "@/services/projectMembers.service"
import { useRouter } from "next/navigation"

type PageProps = {
  params: Promise<{
    projectID: string
  }>
}

export default function ProjectPage({ params: paramsPromise }: PageProps) {
  const [projectID, setProjectID] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ProjectTabKey>("Overview")
  const [project, setProject] = useState<Project | null>(null)
  const [issues, setIssues] = useState<ProjectIssueItem[]>([])
  const [members, setMembers] = useState<ProjectMemberItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

  // Resolve params from Promise
  useEffect(() => {
    paramsPromise.then((p) => setProjectID(p.projectID))
  }, [paramsPromise])

  // Fetch data when projectID is ready
  useEffect(() => {
    if (!projectID) return

    let cancelled = false

    async function loadData() {
      setIsLoading(true)
      setError(null)

      try {
        const id = projectID as string
        // Fetch project details
        const projectData = await getProjectById(id)
        if (cancelled) return
        setProject(projectData)

        // Fetch issues
        const issuesData = await listProjectIssues(id)
        if (cancelled) return

        const mappedIssues: ProjectIssueItem[] = Array.isArray(issuesData)
          ? issuesData.map((issue: Issue) => {
            // Map backend status values to component format
            let status: "todo" | "in_progress" | "done" = "todo"
            if (
              issue.status?.toUpperCase() === "IN_PROGRESS" ||
              issue.status?.toLowerCase() === "in_progress"
            ) {
              status = "in_progress"
            } else if (
              issue.status?.toUpperCase() === "DONE" ||
              issue.status?.toLowerCase() === "done"
            ) {
              status = "done"
            } else if (
              issue.status?.toUpperCase() === "TODO" ||
              issue.status?.toLowerCase() === "todo"
            ) {
              status = "todo"
            }

            // Map priority to valid values
            let priority: "low" | "medium" | "high" | undefined
            if (issue.priority) {
              const p = issue.priority.toLowerCase()
              if (["low", "medium", "high"].includes(p)) {
                priority = p as "low" | "medium" | "high"
              }
            }

            return {
              id: issue.id,
              title: issue.title,
              description: issue.description,
              status,
              priority,
              createdAt: issue.created_at,
            }
          })
          : []

        setIssues(mappedIssues)

        // Fetch members
        const membersData = await listProjectMembers(id)
        if (cancelled) return

        const mappedMembers: ProjectMemberItem[] = Array.isArray(membersData)
          ? membersData.map((member: ProjectMember) => {
            // Build initials from fullname
            const fullname = (member as any).fullname || "Member"
            const initials = fullname
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part: string) => part.charAt(0).toUpperCase())
              .join("") || "M"

            return {
              id: member.id,
              fullname,
              username: (member as any).username || "",
              role: "Member",
              initials,
            }
          })
          : []

        setMembers(mappedMembers)
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load project details"
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [projectID])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#27272A] border-t-[#5E6AD2]"></div>
          <p className="text-[#94A3B8]">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-lg font-semibold text-[#E2E8F0]">
            Failed to load project
          </p>
          <p className="text-[#94A3B8]">{error || "Project not found"}</p>
        </div>
      </div>
    )
  }

  return (
  <div className="min-h-screen bg-[#000000] p-4 sm:p-6 lg:p-8">
    <div className="mx-auto max-w-7xl space-y-10">
      {/* Project Header */}
      <div className="space-y-5 pb-2">
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#E2E8F0]">
          {project.name}
        </h1>

        {project.description && (
          <p className="max-w-3xl text-sm leading-relaxed text-[#94A3B8]">
            <span className="font-bold text-[#E2E8F0]">Description:</span>{" "}
            {project.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-sm text-[#94A3B8]">
          {project.lead_name && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#E2E8F0]">Lead:</span>
              <span>{project.lead_name}</span>
            </div>
          )}

          {project.created_at && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#E2E8F0]">Created:</span>
              <span>
                {new Date(project.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#27272A] pt-6">
        <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "Overview" && (
          <div className="space-y-6">
            {/* ── Statistics Cards ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm">
                <p className="text-xs font-medium text-zinc-400">Total Issues</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-50 tabular-nums">
                  {issues.length}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm">
                <p className="text-xs font-medium text-zinc-400">Team Members</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-50 tabular-nums">
                  {members.length}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm">
                <p className="text-xs font-medium text-zinc-400">Completed Issues</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-50 tabular-nums">
                  {issues.filter((i) => i.status === "done").length}
                </p>
              </div>
            </div>

            {/* ── Project Details ── */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-sm font-semibold text-zinc-100">
                Project Details
              </h2>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 items-start gap-1 sm:grid-cols-4 sm:gap-4">
                  <span className="text-xs font-medium text-zinc-400">Name</span>
                  <span className="text-zinc-200 sm:col-span-3">{project.name}</span>
                </div>

                {project.description && (
                  <div className="grid grid-cols-1 items-start gap-1 border-t border-zinc-800/60 pt-4 sm:grid-cols-4 sm:gap-4">
                    <span className="text-xs font-medium text-zinc-400">
                      Description
                    </span>
                    <span className="leading-relaxed text-zinc-300 sm:col-span-3">
                      {project.description}
                    </span>
                  </div>
                )}

                {project.lead_name && (
                  <div className="grid grid-cols-1 items-start gap-1 border-t border-zinc-800/60 pt-4 sm:grid-cols-4 sm:gap-4">
                    <span className="text-xs font-medium text-zinc-400">Lead</span>
                    <span className="text-zinc-200 sm:col-span-3">
                      {project.lead_name}
                    </span>
                  </div>
                )}

                {project.created_at && (
                  <div className="grid grid-cols-1 items-start gap-1 border-t border-zinc-800/60 pt-4 sm:grid-cols-4 sm:gap-4">
                    <span className="text-xs font-medium text-zinc-400">Created</span>
                    <span className="text-zinc-200 sm:col-span-3">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Issues" && (
          <ProjectIssues
            projectName={project.name}
            issues={issues}
            onCreateIssue={() => console.log("Create issue")}
            onSearchChange={() => console.log("Search")}
            onFilterChange={() => console.log("Filter")}
            onSortChange={() => console.log("Sort")}
            onClick={(issueId: any) =>
              router.push(`/projects/${projectID}/issues/${issueId}`)
            }
          />
        )}

        {activeTab === "Members" && <ProjectMembers members={members} />}
      </div>
    </div>
  </div>
)
}
