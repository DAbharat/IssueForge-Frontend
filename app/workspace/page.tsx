"use client"

import { Pencil, Search, SlidersHorizontal, Plus } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import ProjectCard from "@/components/projects/ProjectCard"
import CreateProjectCard, { type CreateProjectPayload } from "@/components/projects/CreateProjectCard"
import EditWorkspaceNameModal from "@/components/workspace/EditWorkspaceNameModal"
import WorkspaceMembersOverview, {
  type WorkspaceMemberOverviewItem,
} from "@/components/workspace-members/WorkspaceMembersOverview"
import WorkspaceMembersDialog from "@/components/workspace-members/WorkspaceMembersDialog"
import { useProfile } from "@/hooks/use-profile"
import { createProject, listProjectsByLead, type Project } from "@/services/projects.service"
import { listProjectMembers, type ProjectMember } from "@/services/projectMembers.service"
import { searchUsers } from "@/services/account.service"
import { listWorkspaceMembers, removeWorkspaceMember, promoteWorkspaceMember, type WorkspaceMember } from "@/services/workspaceMembers.service"
import { updateWorkspaceName } from "@/services/workspaces.service"

export default function WorkspacePage() {
  const searchParams = useSearchParams()
  const { profile, isLoading: profileLoading } = useProfile()
  const [workspaceName, setWorkspaceName] = useState("Workspace")
  const [workspaceId, setWorkspaceId] = useState<string | number | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [members, setMembers] = useState<WorkspaceMemberOverviewItem[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showMembersDialog, setShowMembersDialog] = useState(false)
  const [showEditName, setShowEditName] = useState(false)
  const [isSavingName, setIsSavingName] = useState(false)
  const [editNameError, setEditNameError] = useState<string | null>(null)
  const router = useRouter();

  useEffect(() => {
    if (!profile?.workspaces || profile.workspaces.length === 0) return

    const selectedWorkspaceId = searchParams.get("workspaceId")
    const matchingWorkspace =
      selectedWorkspaceId !== null
        ? profile.workspaces.find((workspace) => String(workspace.id) === selectedWorkspaceId)
        : undefined

    const activeWorkspace = matchingWorkspace ?? profile.workspaces[0]

    if (activeWorkspace?.name) {
      setWorkspaceName(activeWorkspace.name)
    }

    if (activeWorkspace?.id) {
      setWorkspaceId(activeWorkspace.id)
    }
  }, [profile, searchParams])

  useEffect(() => {
    if (typeof workspaceId !== "string" && typeof workspaceId !== "number") return

    const activeWorkspaceId: string | number = workspaceId
    let cancelled = false

    async function loadData() {
      setIsLoadingProjects(true)
      setIsLoadingMembers(true)

      try {
        const fetchedProjects = await listProjectsByLead(activeWorkspaceId)
        const projectList = Array.isArray(fetchedProjects) ? fetchedProjects : []
        if (!cancelled) {
          setProjects(projectList)
        }

        const memberMap = new Map<string | number, WorkspaceMemberOverviewItem>()

        // 1. Load direct workspace members
        try {
          const wsMembers = await listWorkspaceMembers(activeWorkspaceId)
          if (Array.isArray(wsMembers)) {
            wsMembers.forEach((member: WorkspaceMember) => {
              const userId = member.user_id ?? member.id
              if (userId === undefined || userId === null) return
              const fullname = member.fullname || member.username || "Member"
              const initials =
                fullname
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part.charAt(0).toUpperCase())
                  .join("") || "M"

              memberMap.set(String(userId), {
                id: userId,
                fullname,
                username: member.username,
                initials,
                role: member.role,
                status: "active",
              })
            })
          }
        } catch {
          // ignore error fetching workspace members
        }



        if (!cancelled) {
          setMembers(Array.from(memberMap.values()))
        }
      } catch {
        if (!cancelled) {
          setProjects([])
          setMembers([])
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProjects(false)
          setIsLoadingMembers(false)
        }
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [workspaceId])

  const emptyProjects = !isLoadingProjects && projects.length === 0

  async function handleCreateProject(payload: CreateProjectPayload) {
    if (!workspaceId) return
    setIsCreating(true)
    try {
      await createProject(workspaceId, {
        name: payload.name,
        description: payload.description,
      })
      setShowCreateProject(false)
      // Refresh project list
      const updated = await listProjectsByLead(workspaceId)
      setProjects(Array.isArray(updated) ? updated : [])
    } catch {
      // keep modal open so user can retry
    } finally {
      setIsCreating(false)
    }
  }

  async function handleRenameWorkspace(newName: string) {
    if (!workspaceId) return
    setIsSavingName(true)
    setEditNameError(null)
    try {
      await updateWorkspaceName(workspaceId, { name: newName })
      setWorkspaceName(newName)
      setShowEditName(false)
    } catch (err) {
      setEditNameError(
        err instanceof Error ? err.message : "Failed to rename workspace"
      )
    } finally {
      setIsSavingName(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#E2E8F0] sm:text-4xl">{workspaceName}</h1>
          <p className="mt-2 text-base text-[#94A3B8]">Workspace overview</p>
        </div>

        {/* Edit workspace name button */}
        <button
          id="edit-workspace-name-btn"
          type="button"
          aria-label="Edit workspace name"
          onClick={() => {
            setEditNameError(null)
            setShowEditName(true)
          }}
          className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#27272A] bg-transparent px-4 py-2 text-xs font-bold text-[#DDE1E5] transition-colors hover:border-[#3F3F46] hover:text-[#A1A1AA] focus:outline-none"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>

      <section className="space-y-8">
        <WorkspaceMembersOverview
          members={members}
          activeCount={members.filter((member) => member.status === "active").length}
          pendingCount={members.filter((member) => member.status === "pending").length}
          onSearchChange={() => undefined}
          onStatusChange={() => undefined}
          onManageMembers={() => undefined}
          onShowAllMembers={() => setShowMembersDialog(true)}
        />

        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-medium text-[#E2E8F0] sm:text-xl">Projects</h2>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="h-9 w-full rounded-sm border border-[#27272A] bg-[#18181B] pl-8 pr-3 text-sm text-[#E2E8F0] placeholder:text-[#94A3B8]/60 transition-colors focus:border-[#3F3F46] focus:outline-none sm:w-56"
                />
              </div>

              <button
                type="button"
                aria-label="Filter projects"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-[#27272A] bg-[#18181B] text-[#94A3B8] transition-colors hover:border-[#3F3F46] hover:text-[#E2E8F0]"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowCreateProject(true)}
                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-sm border border-[#27272A] bg-[#27272A] px-3 text-sm font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46] hover:bg-[#3F3F46]"
              >
                <Plus className="h-4 w-4" />
                New
              </button>
            </div>
          </div>

          {profileLoading || isLoadingProjects ? (
            <div className="py-8 text-center text-sm text-[#94A3B8]">Loading projects...</div>
          ) : emptyProjects ? (
            <div className="py-12 text-center text-sm text-[#94A3B8]">No projects yet</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => router.push(`/projects/${project.id}`)}
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer"
                >
                  <ProjectCard
                    id={project.id}
                    title={project.name || "Untitled project"}
                    description={project.description}
                    lead_name={project.lead_name || (project.lead_id ? `User #${project.lead_id}` : "Unknown lead")}
                    issueCount={0}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Create Project Modal Overlay ── */}
      {showCreateProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isCreating) {
              setShowCreateProject(false)
            }
          }}
        >
          <div className="w-full max-w-xl">
            <CreateProjectCard
              isSubmitting={isCreating}
              onCancel={() => {
                if (!isCreating) setShowCreateProject(false)
              }}
              onSubmit={handleCreateProject}
            />
          </div>
        </div>
      )}

      {/* ── All Members Dialog ── */}
      {showMembersDialog && (
        <WorkspaceMembersDialog
          members={members.map((m) => ({
            id: m.id,
            fullname: m.fullname,
            username: m.username ?? "",
            initials: m.initials,
            role: m.role,
            status: m.status ?? "active",
          }))}
          onClose={() => setShowMembersDialog(false)}
          isAdmin={(() => {
            const ws = profile?.workspaces?.find((w) => String(w.id) === String(workspaceId))
            const role = ws?.role?.toLowerCase() ?? ""
            return role === "admin" || role === "owner"
          })()}
          currentUserId={profile?.id}
          onPromote={async (member) => {
            if (!workspaceId) return
            const uid = member.user_id ?? member.id
            if (uid === undefined || uid === null) return
            await promoteWorkspaceMember(workspaceId, uid)
          }}
          onRemove={async (member) => {
            if (!workspaceId) return
            const uid = member.user_id ?? member.id
            if (uid === undefined || uid === null) return
            await removeWorkspaceMember(workspaceId, uid)
            // Refresh member list
            try {
              const wsMembers = await listWorkspaceMembers(workspaceId)
              if (Array.isArray(wsMembers)) {
                setMembers(
                  wsMembers.map((m: WorkspaceMember) => {
                    const fullname = m.fullname || m.username || "Member"
                    const initials =
                      fullname
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((p) => p.charAt(0).toUpperCase())
                        .join("") || "M"
                    return { id: m.user_id ?? m.id, fullname, username: m.username, initials, status: "active" as const }
                  })
                )
              }
            } catch {
              // ignore refresh error
            }
          }}
        />
      )}

      {/* ── Edit Workspace Name Modal ── */}
      {showEditName && (
        <EditWorkspaceNameModal
          currentName={workspaceName}
          isSaving={isSavingName}
          error={editNameError}
          onSave={handleRenameWorkspace}
          onClose={() => {
            if (!isSavingName) setShowEditName(false)
          }}
          onManageMembers={() => {
            setShowEditName(false)
            setShowMembersDialog(true)
          }}
        />
      )}
    </div>
  )
}