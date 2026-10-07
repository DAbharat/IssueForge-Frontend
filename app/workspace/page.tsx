"use client"

import { Search, SlidersHorizontal, Plus, Globe, Copy, MoreVertical, UserPlus, Trash2, ArrowRightLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import ProjectCard from "@/components/projects/ProjectCard"
import CreateProjectCard, { type CreateProjectPayload } from "@/components/projects/CreateProjectCard"
import WorkspaceMembersOverview, {
  type WorkspaceMemberOverviewItem,
} from "@/components/workspace-members/WorkspaceMembersOverview"
import WorkspaceMembersDialog from "@/components/workspace-members/WorkspaceMembersDialog"
import WorkspaceMembersCard from "@/components/workspace-members/WorkspaceMembersCard"
import WorkspaceTabs, { type WorkspaceTabKey } from "@/components/workspace/WorkspaceTab"
import WorkspaceDetails from "@/components/workspace/WorkspaceDetails"
import { useProfile } from "@/hooks/use-profile"
import { createProject, listProjectsByLead, type Project } from "@/services/projects.service"
import { listWorkspaceMembers, removeWorkspaceMember, promoteWorkspaceMember, type WorkspaceMember } from "@/services/workspaceMembers.service"
import { updateWorkspaceName, getWorkspaceById, type Workspace } from "@/services/workspaces.service"

export default function WorkspacePage() {
  const searchParams = useSearchParams()
  const { profile, isLoading: profileLoading } = useProfile()
  const [workspaceName, setWorkspaceName] = useState("Workspace")
  const [workspaceId, setWorkspaceId] = useState<string | number | null>(null)
  const [workspaceDetails, setWorkspaceDetails] = useState<Workspace | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [members, setMembers] = useState<WorkspaceMemberOverviewItem[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showMembersDialog, setShowMembersDialog] = useState(false)
  
  const [activeTab, setActiveTab] = useState<WorkspaceTabKey>("General")

  const router = useRouter()

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
        const [fetchedProjects, wsDetails] = await Promise.all([
          listProjectsByLead(activeWorkspaceId).catch(() => []),
          getWorkspaceById(activeWorkspaceId).catch(() => null)
        ])

        if (!cancelled) {
          const projectList = Array.isArray(fetchedProjects) ? fetchedProjects : []
          setProjects(projectList)
          if (wsDetails) {
            setWorkspaceDetails(wsDetails)
          }
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

  async function handleSaveWorkspaceDetails(name: string, description: string) {
    if (!workspaceId) return
    await updateWorkspaceName(workspaceId, { 
      name,
      description
    })
    setWorkspaceName(name)
    if (workspaceDetails) {
      setWorkspaceDetails({ ...workspaceDetails, name, description })
    }
  }

  const isAdmin = (() => {
    const ws = profile?.workspaces?.find((w) => String(w.id) === String(workspaceId))
    const role = ws?.role?.toLowerCase() ?? ""
    return role === "admin" || role === "owner"
  })()

  return (
    <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        {/* <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="text-[#94A3B8]">Workspaces</span>
          <span className="text-[#3F3F46]">&gt;</span>
          <span className="text-[#E2E8F0] font-medium">{workspaceName}</span>
        </div> */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DDE1E5] text-2xl font-semibold text-black">
            {workspaceName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#E2E8F0] sm:text-2xl">{workspaceName}</h1>
            <p className="mt-0.5 text-sm text-[#94A3B8]">{workspaceDetails?.description || "This is the main workspace for the team."}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 mt-3">
        <WorkspaceTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <section className="space-y-3">
        {activeTab === "General" && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {/* Workspace Details */}
              <WorkspaceDetails 
                workspaceId={workspaceId}
                initialName={workspaceName}
                initialDescription={workspaceDetails?.description || ""}
                isAdmin={isAdmin}
                onSave={handleSaveWorkspaceDetails}
              />

              {/* Workspace Members */}
              <div className="col-span-1 h-full">
                <WorkspaceMembersCard
                  members={members.slice(0, 5).map(m => ({
                    id: m.id ?? m.username ?? m.fullname,
                    fullname: m.fullname,
                    username: m.username,
                    initials: m.initials,
                    role: m.role,
                    status: m.status,
                    isCurrentUser: profile?.id ? String(m.id) === String(profile.id) : false,
                  }))}
                  totalMembers={members.length}
                  onManageClick={() => setShowMembersDialog(true)}
                />
              </div>
            </div>

            {/* Workspace Actions */}
            <div className="rounded-xl border border-[#27272A] bg-[#0E0E11] p-4">
              <div className="mb-3">
                <h2 className="text-base font-semibold text-[#E2E8F0]">Workspace Actions</h2>
                <p className="mt-0.5 text-sm text-[#94A3B8]">These actions will affect the entire workspace.</p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {/* Delete Action */}
                <div className="flex items-start gap-3 rounded-lg border border-[#27272A] bg-[#09090B] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#E2E8F0]">Delete workspace</h3>
                    <p className="mt-0.5 text-xs text-[#94A3B8] leading-relaxed">Permanently remove this workspace and all its data.</p>
                    <button className="mt-3 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/20">
                      Delete workspace
                    </button>
                  </div>
                </div>

                {/* Transfer Action */}
                <div className="flex items-start gap-3 rounded-lg border border-[#27272A] bg-[#09090B] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#818CF8]">
                    <ArrowRightLeft className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#E2E8F0]">Transfer ownership</h3>
                    <p className="mt-0.5 text-xs text-[#94A3B8] leading-relaxed">Transfer ownership to another member of this workspace.</p>
                    <button className="mt-3 rounded-md border border-[#6366F1]/30 bg-transparent px-4 py-1.5 text-xs font-medium text-[#818CF8] transition-colors hover:bg-[#6366F1]/10">
                      Transfer ownership
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Members" && (
          <WorkspaceMembersOverview
            members={members}
            activeCount={members.filter((member) => member.status === "active").length}
            pendingCount={members.filter((member) => member.status === "pending").length}
            onSearchChange={() => undefined}
            onStatusChange={() => undefined}
            onManageMembers={() => undefined}
            onShowAllMembers={() => setShowMembersDialog(true)}
          />
        )}

        {activeTab === "Projects" && (
          <div>
            <div className="mb-6 flex w-full items-center">
              <div className="relative w-[80%] pr-2 sm:pr-3">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="h-9 w-full rounded-sm border border-[#27272A] bg-[#18181B] pl-8 pr-3 text-sm text-[#E2E8F0] placeholder:text-[#94A3B8]/60 transition-colors focus:border-[#3F3F46] focus:outline-none"
                />
              </div>

              <div className="w-[5%] pr-2 sm:pr-3">
                <button
                  type="button"
                  aria-label="Filter projects"
                  className="flex h-9 w-full items-center justify-center rounded-sm border border-[#27272A] bg-[#18181B] text-[#94A3B8] transition-colors hover:border-[#3F3F46] hover:text-[#E2E8F0]"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              </div>

              <div className="w-[15%]">
                <button
                  type="button"
                  onClick={() => setShowCreateProject(true)}
                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-sm border border-[#27272A] bg-[#27272A] text-sm font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46] hover:bg-[#3F3F46]"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New</span>
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
        )}

        {activeTab === "Danger Zone" && (
          <div className="rounded-xl border border-red-500/20 bg-[#18181B] p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-red-500">Danger Zone</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">These actions cannot be undone.</p>
            </div>
            
            <div className="flex items-start gap-4 rounded-lg border border-[#27272A] bg-[#09090B] p-5 max-w-xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#E2E8F0]">Delete workspace</h3>
                <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed">Permanently remove this workspace and all its data. This action is irreversible.</p>
                <button className="mt-4 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/20">
                  Delete workspace
                </button>
              </div>
            </div>
          </div>
        )}
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
    </div>
  )
}