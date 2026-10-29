"use client"

import { useState, useEffect } from "react"
import ProjectTabs, { type ProjectTabKey } from "@/components/projects/ProjectTabs"
import ProjectIssues, {
  type ProjectIssueItem,
} from "@/components/projects/ProjectIssues"
import ProjectMembers, {
  type ProjectMemberItem,
  type WorkspaceMemberOption,
} from "@/components/projects/ProjectMembers"
import ProjectOverview from "@/components/projects/ProjectOverview"
import ProjectActivity from "@/components/projects/ProjectActivity"
import ProjectSettings from "@/components/projects/ProjectSettings"
import CreateIssueCard, {
  type CreateIssueMember,
  type CreateIssuePayload,
} from "@/components/issues/CreateIssueCard"
import {
  deleteProject,
  getProjectById,
  updateProjectDetails,
  updateProjectLead,
  type Project,
} from "@/services/projects.service"
import { listProjectIssues, createIssue, type Issue } from "@/services/issues.service"
import {
  addMemberToProject,
  listProjectMembers,
  type ProjectMember,
} from "@/services/projectMembers.service"
import {
  addWorkspaceMember,
  listWorkspaceMembers,
  type WorkspaceMember,
} from "@/services/workspaceMembers.service"
import { searchUsers } from "@/services/account.service"
import { useProfile } from "@/hooks/use-profile"
import { useLabels } from "@/hooks/use-labels"
import { useProjectActivities } from "@/hooks/use-project-activities"
import { listIssueLabels } from "@/services/labels.service"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/toast"

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
  const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMemberOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // ── Create issue ──────────────────────────────────────────────────────────
  const [showCreateIssue, setShowCreateIssue] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [isDeletingProject, setIsDeletingProject] = useState(false)
  const { profile } = useProfile()
  const {
    projectLabels,
    isUpdating: isUpdatingLabels,
    attachLabels,
    createProjectLabel,
    deleteProjectLabel,
  } = useLabels(projectID)
  const {
    activities: projectActivities,
    isLoading: isLoadingActivities,
    error: activitiesError,
    reload: reloadActivities,
  } = useProjectActivities(activeTab === "Activity" ? projectID : null)
  const router = useRouter()

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
          ? await Promise.all(issuesData.map(async (issue: Issue) => {
            const labels = await listIssueLabels(issue.id).catch(() => [])
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
              assignee: issue.assignee_name,
              labels,
              createdAt: issue.created_at,
            }
          }))
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

            const memberId = member.user_id ?? member.id
            const isLead =
              memberId !== undefined &&
              projectData.lead_id !== undefined &&
              String(memberId) === String(projectData.lead_id)

            return {
              id: member.user_id ?? member.id,
              fullname,
              username: (member as any).username || "",
              role: isLead ? "Lead" : "Member",
              initials,
            }
          })
          : []

        setMembers(mappedMembers)

        // Fetch workspace members and system users for the add-member picker.
        const wsId = projectData.workspace_id ?? profile?.workspaces?.[0]?.id
        const userMap = new Map<string, WorkspaceMemberOption>()

        // 1. Fetch system users
        try {
          const allUsers = await searchUsers("")
          if (!cancelled && Array.isArray(allUsers)) {
            allUsers.forEach((u) => {
              const ufullname = u.fullname || u.username || "User"
              const uinitials =
                ufullname
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((p) => p.charAt(0).toUpperCase())
                  .join("") || "U"
              userMap.set(String(u.id), {
                id: u.id,
                fullname: ufullname,
                username: u.username || "",
                initials: uinitials,
              })
            })
          }
        } catch {
          // ignore user search error
        }

        // 2. Overlay direct workspace members
        if (wsId) {
          try {
            const wsMembersData = await listWorkspaceMembers(wsId)
            if (!cancelled && Array.isArray(wsMembersData)) {
              wsMembersData.forEach((wm: WorkspaceMember) => {
                const id = wm.user_id ?? wm.id
                if (id === undefined || id === null) return
                const wfullname = wm.fullname || wm.username || "Member"
                const winitials =
                  wfullname
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((p) => p.charAt(0).toUpperCase())
                    .join("") || "M"
                userMap.set(String(id), {
                  id,
                  fullname: wfullname,
                  username: wm.username || "",
                  initials: winitials,
                })
              })
            }
          } catch (wsErr) {
            console.error("[ProjectPage] Failed to load workspace members for picker:", wsErr)
          }
        }

        if (!cancelled) {
          setWorkspaceMembers(Array.from(userMap.values()))
        }
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

  // ── Derived: is the current viewer the project lead ───────────────────────
  const currentUserId = profile?.id
  const isLead =
    currentUserId !== undefined &&
    project?.lead_id !== undefined &&
    String(currentUserId) === String(project.lead_id)

  // ── Derived: members shaped for CreateIssueCard ───────────────────────────
  const cardMembers: CreateIssueMember[] = members.map((m) => ({
    id: (m as any).user_id ?? m.id ?? "",
    name: m.fullname,
  }))

  // ── Create issue handler ──────────────────────────────────────────────────
  async function handleCreateIssue(payload: CreateIssuePayload) {
    if (!projectID) return
    setIsCreating(true)
    try {
      const created = await createIssue(projectID, {
        title: payload.title,
        description: payload.description,
        status: payload.status,
        priority: payload.priority,
        ...(payload.assigned_to !== undefined && {
          assigned_to: Number(payload.assigned_to),
        }),
      })

      // Append the new issue to the list without a full refetch
      const newItem: ProjectIssueItem = {
        id: created.id,
        title: created.title,
        description: created.description,
        status: "todo",
        priority: created.priority?.toLowerCase() as ProjectIssueItem["priority"],
        createdAt: created.created_at,
      }
      setIssues((prev) => [newItem, ...prev])
      if (payload.label_ids && payload.label_ids.length > 0) {
        await attachLabels(payload.label_ids, String(created.id))
      }
      toast.success("Issue created", `Issue "${created.title}" was created successfully.`)
      setShowCreateIssue(false)
    } catch (err) {
      toast.error("Failed to create issue", err instanceof Error ? err.message : "Could not create issue.")
    } finally {
      setIsCreating(false)
    }
  }

  // ── Add member to project ─────────────────────────────────────────────────
  async function handleAddMember(userId: string | number) {
    if (!projectID) return
    setIsAddingMember(true)
    try {
      // Ensure user is added to the workspace first if not already a member
      const wsId = project?.workspace_id ?? profile?.workspaces?.[0]?.id
      if (wsId) {
        try {
          await addWorkspaceMember(wsId, userId)
        } catch {
          // ignore if already in workspace
        }
      }

      await addMemberToProject(projectID, userId)
      toast.success("Member added", "Member has been added to the project.")

      // Refresh project members list
      const refreshed = await listProjectMembers(projectID)
      if (Array.isArray(refreshed)) {
        const mapped: ProjectMemberItem[] = refreshed.map((member: ProjectMember) => {
          const fullname = (member as any).fullname || "Member"
          const initials =
            fullname
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((p: string) => p.charAt(0).toUpperCase())
              .join("") || "M"
          const memberId = member.user_id ?? member.id
          const lead =
            memberId !== undefined &&
            project?.lead_id !== undefined &&
            String(memberId) === String(project.lead_id)
          return {
            id: member.user_id ?? member.id,
            fullname,
            username: (member as any).username || "",
            role: lead ? "Lead" : "Member",
            initials,
          }
        })
        setMembers(mapped)
      }
    } catch (err) {
      console.error("[ProjectPage] Error adding member:", err)
      toast.error("Failed to add member", err instanceof Error ? err.message : "Unable to add member to project.")
    } finally {
      setIsAddingMember(false)
    }
  }

  async function handleSaveProjectDetails(details: { name: string; description: string }) {
    if (!projectID) return

    setIsSavingSettings(true)
    try {
      const updatedProject = await updateProjectDetails(projectID, details)
      setProject(updatedProject)
      toast.success("Project updated", "Project details saved successfully.")
    } catch (err) {
      toast.error("Failed to update project", err instanceof Error ? err.message : "Unable to update project details.")
    } finally {
      setIsSavingSettings(false)
    }
  }

  async function handleSaveProjectLead(leadId: string) {
    if (!projectID) return

    setIsSavingSettings(true)
    try {
      const updatedProject = await updateProjectLead(projectID, { lead_id: leadId })
      setProject(updatedProject)
      toast.success("Project lead updated", "Project lead saved successfully.")
    } catch (err) {
      toast.error("Failed to update project lead", err instanceof Error ? err.message : "Unable to update project lead.")
    } finally {
      setIsSavingSettings(false)
    }
  }

  async function handleDeleteProject() {
    if (!projectID) return

    setIsDeletingProject(true)
    try {
      await deleteProject(projectID)
      toast.success("Project deleted", "Project was deleted successfully.")
      router.push("/workspace")
    } catch (err) {
      toast.error("Failed to delete project", err instanceof Error ? err.message : "Unable to delete project.")
      setIsDeletingProject(false)
    }
  }

  function renderCreateIssueCard() {
    if (!showCreateIssue) return null

    return (
      <CreateIssueCard
        members={cardMembers}
        labels={projectLabels}
        isSubmitting={isCreating}
        onSubmit={handleCreateIssue}
        onCancel={() => setShowCreateIssue(false)}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#27272A] border-t-[#DDE1E5]"></div>
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
          <div className="space-y-4">
            {renderCreateIssueCard()}
            <ProjectOverview
              project={project}
              issues={issues}
              members={members}
              onCreateIssue={() => setShowCreateIssue(true)}
              onIssueSelect={(issueId) => router.push(`/projects/${projectID}/issues/${issueId}`)}
              onViewIssues={() => setActiveTab("Issues")}
              onViewMembers={() => setActiveTab("Members")}
            />
          </div>
        )}

        {activeTab === "Issues" && (
          <div className="space-y-4">
            {renderCreateIssueCard()}
            <ProjectIssues
              projectName={project.name}
              issues={issues}
              onCreateIssue={() => setShowCreateIssue(true)}
              onSearchChange={() => console.log("Search")}
              onFilterChange={() => console.log("Filter")}
              onSortChange={() => console.log("Sort")}
              onClick={(issueId: any) =>
                router.push(`/projects/${projectID}/issues/${issueId}`)
              }
            />
          </div>
        )}

        {activeTab === "Members" && (
          <ProjectMembers
            members={members}
            workspaceMembers={workspaceMembers}
            isLead={isLead}
            isAddingMember={isAddingMember}
            onAddMember={handleAddMember}
          />
        )}

        {activeTab === "Activity" && (
          <ProjectActivity
            activities={projectActivities}
            isLoading={isLoadingActivities}
            error={activitiesError}
            onRetry={reloadActivities}
            onViewIssues={() => setActiveTab("Issues")}
          />
        )}

        {activeTab === "Settings" && (
          <ProjectSettings
            project={project}
            members={members}
            isLead={isLead}
            isSaving={isSavingSettings}
            isDeleting={isDeletingProject}
            labels={projectLabels}
            isUpdatingLabels={isUpdatingLabels}
            onSaveDetails={handleSaveProjectDetails}
            onSaveLead={handleSaveProjectLead}
            onDeleteProject={handleDeleteProject}
            onCreateLabel={createProjectLabel}
            onDeleteLabel={deleteProjectLabel}
          />
        )}
      </div>
    </div>
  </div>
)
}
