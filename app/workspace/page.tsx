"use client"

import { Search, SlidersHorizontal, Plus, Globe, Copy, MoreVertical, UserPlus, Trash2, ArrowRightLeft, ChevronDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

import ProjectCard from "@/components/projects/ProjectCard"
import CreateProjectCard, { type CreateProjectPayload } from "@/components/projects/CreateProjectCard"
import WorkspaceMembersOverview, {
  type WorkspaceMemberOverviewItem,
} from "@/components/workspace-members/WorkspaceMembersOverview"
import WorkspaceMembersDialog from "@/components/workspace-members/WorkspaceMembersDialog"
import WorkspaceMembersCard from "@/components/workspace-members/WorkspaceMembersCard"
import WorkspaceTabs, { WORKSPACE_TABS, type WorkspaceTabKey } from "@/components/workspace/WorkspaceTab"
import WorkspaceDetails from "@/components/workspace/WorkspaceDetails"
import WorkspaceInvitations from "@/components/workspace/WorkspaceInvitations"
import PendingWorkspaceInvitations from "@/components/workspace/PendingWorkspaceInvitations"
import { useProfile } from "@/hooks/use-profile"
import { useWorkspaceSwitcher } from "@/hooks/use-workspace-switcher"
import { useWorkspaceInvitations } from "@/hooks/use-workspace-invitations"
import { usePendingInvitations } from "@/hooks/use-pending-invitations"
import { createProject, listProjectsByLead, type Project } from "@/services/projects.service"
import { listWorkspaceMembers, removeWorkspaceMember, promoteWorkspaceMember, type WorkspaceMember } from "@/services/workspaceMembers.service"
import { updateWorkspaceName, getWorkspaceById, deleteWorkspace, type Workspace } from "@/services/workspaces.service"
import { listProjectIssues } from "@/services/issues.service"
import { listProjectMembers } from "@/services/projectMembers.service"

function WorkspaceContent() {
  const searchParams = useSearchParams()
  const { profile, isLoading: profileLoading } = useProfile()
  const { activeWorkspace } = useWorkspaceSwitcher()
  const [workspaceName, setWorkspaceName] = useState("Workspace")
  const [workspaceId, setWorkspaceId] = useState<string | number | null>(null)
  const [workspaceDetails, setWorkspaceDetails] = useState<Workspace | null>(null)
  const [projects, setProjects] = useState<(Project & { issueCount?: number; memberCount?: number })[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [members, setMembers] = useState<WorkspaceMemberOverviewItem[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showMembersDialog, setShowMembersDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeletingWorkspace, setIsDeletingWorkspace] = useState(false)

  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState<WorkspaceTabKey>(() => {
    if (tabParam && (WORKSPACE_TABS as readonly string[]).includes(tabParam)) {
      return tabParam as WorkspaceTabKey
    }
    return "General"
  })

  const router = useRouter()

  // Keep activeTab in sync with query parameter changes (from sidebar, navbar, etc.)
  useEffect(() => {
    const currentTabParam = searchParams.get("tab")
    if (currentTabParam && (WORKSPACE_TABS as readonly string[]).includes(currentTabParam)) {
      setActiveTab(currentTabParam as WorkspaceTabKey)
    }
  }, [searchParams])

  const handleTabChange = (tab: WorkspaceTabKey) => {
    setActiveTab(tab)
    const currentWsId = workspaceId ?? searchParams.get("workspaceId")
    const query = currentWsId ? `workspaceId=${currentWsId}&tab=${tab}` : `tab=${tab}`
    router.replace(`/workspace?${query}`, { scroll: false })
  }

  useEffect(() => {
    if (!profile?.workspaces || profile.workspaces.length === 0) return

    const selectedWorkspaceId = searchParams.get("workspaceId")
    const storedWorkspaceId = typeof window !== "undefined" ? window.localStorage.getItem("activeWorkspaceId") : null

    const targetId = selectedWorkspaceId ?? storedWorkspaceId ?? (activeWorkspace?.id ? String(activeWorkspace.id) : null)

    const matchingWorkspace =
      targetId !== null && targetId !== undefined
        ? profile.workspaces.find((workspace) => String(workspace.id) === String(targetId))
        : undefined

    const chosenWorkspace = matchingWorkspace ?? activeWorkspace ?? profile.workspaces[0]

    if (chosenWorkspace?.name) {
      setWorkspaceName(chosenWorkspace.name)
    }

    if (chosenWorkspace?.id) {
      setWorkspaceId(chosenWorkspace.id)
    }
  }, [profile, searchParams, activeWorkspace])

  useEffect(() => {
    if (activeWorkspace?.id) {
      setWorkspaceId(activeWorkspace.id)
      if (activeWorkspace.name) {
        setWorkspaceName(activeWorkspace.name)
      }
    }
  }, [activeWorkspace?.id, activeWorkspace?.name])

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
          
          // Fetch stats for all projects concurrently
          const projectsWithStats = await Promise.all(
            projectList.map(async (p) => {
              try {
                const [issues, members] = await Promise.all([
                  listProjectIssues(p.id).catch(() => []),
                  listProjectMembers(p.id).catch(() => [])
                ])
                return { 
                  ...p, 
                  issueCount: Array.isArray(issues) ? issues.length : 0, 
                  memberCount: Array.isArray(members) ? members.length : 0 
                }
              } catch {
                return { ...p, issueCount: 0, memberCount: 0 }
              }
            })
          )

          setProjects(projectsWithStats)
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
                email: member.email,
                joined_at: member.joined_at || member.created_at,
                isCurrentUser: profile?.id ? String(userId) === String(profile.id) : false,
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
      const projectList = Array.isArray(updated) ? updated : []
      const projectsWithStats = await Promise.all(
        projectList.map(async (p) => {
          try {
            const [issues, members] = await Promise.all([
              listProjectIssues(p.id).catch(() => []),
              listProjectMembers(p.id).catch(() => [])
            ])
            return { 
              ...p, 
              issueCount: Array.isArray(issues) ? issues.length : 0, 
              memberCount: Array.isArray(members) ? members.length : 0 
            }
          } catch {
            return { ...p, issueCount: 0, memberCount: 0 }
          }
        })
      )
      setProjects(projectsWithStats)
    } catch {
      // keep modal open so user can retry
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDeleteWorkspace() {
    if (!workspaceId) return
    setIsDeletingWorkspace(true)
    try {
      await deleteWorkspace(workspaceId)
      router.push("/")
    } catch {
      // keep dialog open so user can retry
    } finally {
      setIsDeletingWorkspace(false)
      setShowDeleteConfirm(false)
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

  const currentMember = members.find(
    (m) => m.isCurrentUser || (profile?.id && String(m.id) === String(profile.id))
  )
  const memberRole = currentMember?.role?.toLowerCase() ?? ""

  const activeWsRole = (() => {
    if (activeWorkspace?.id && String(activeWorkspace.id) === String(workspaceId)) {
      return activeWorkspace.role?.toLowerCase() ?? ""
    }
    const ws = profile?.workspaces?.find((w) => String(w.id) === String(workspaceId))
    return ws?.role?.toLowerCase() ?? ""
  })()

  const nameMatchRole = (() => {
    const ws = profile?.workspaces?.find((w) => w.name === workspaceName)
    return ws?.role?.toLowerCase() ?? ""
  })()

  const isAdmin = Boolean(
    memberRole === "admin" ||
    memberRole === "owner" ||
    activeWsRole === "admin" ||
    activeWsRole === "owner" ||
    nameMatchRole === "admin" ||
    nameMatchRole === "owner"
  )

  const {
    pendingInvitations,
    acceptedMembers,
    rejectedInvitations,
    isLoading: isLoadingInvitations,
    cancellingId,
    invitingId,
    cancelInvite,
    reInvite,
  } = useWorkspaceInvitations(workspaceId)
  const {
    invitations: receivedInvitations,
    isLoading: isLoadingReceivedInvitations,
    updatingId: updatingReceivedInvitationId,
    error: receivedInvitationError,
    accept: acceptReceivedInvitation,
    decline: declineReceivedInvitation,
  } = usePendingInvitations()

  useEffect(() => {
    if (!profileLoading && !isLoadingMembers && members.length > 0 && !isAdmin && activeTab === "Danger Zone") {
      setActiveTab("General")
    }
  }, [profileLoading, isLoadingMembers, members.length, isAdmin, activeTab])

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
        <WorkspaceTabs activeTab={activeTab} onTabChange={handleTabChange} isAdmin={isAdmin} />
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
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DDE1E5]/10 text-[#DDE1E5]">
                    <ArrowRightLeft className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#E2E8F0]">Transfer ownership</h3>
                    <p className="mt-0.5 text-xs text-[#94A3B8] leading-relaxed">Transfer ownership to another member of this workspace.</p>
                    <button className="mt-3 rounded-md border border-[#DDE1E5]/30 bg-transparent px-4 py-1.5 text-xs font-medium text-[#DDE1E5] transition-colors hover:bg-[#DDE1E5] hover:text-black">
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
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#E2E8F0]">Projects</h2>
                <p className="mt-1 text-sm text-[#94A3B8]">Manage your projects in this workspace.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateProject(true)}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-gray-300"
              >
                <Plus className="h-4 w-4" />
                <span>Create project</span>
              </button>
            </div>

            <div className="mb-6 flex w-full flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="h-10 w-full rounded-md border border-[#27272A] bg-[#0E0E11] pl-9 pr-4 text-sm text-[#E2E8F0] placeholder:text-[#94A3B8] transition-colors focus:border-[#3F3F46] focus:outline-none"
                />
              </div>

              <div className="w-full sm:w-auto">
                <button
                  type="button"
                  className="flex h-10 w-full sm:w-auto items-center justify-between gap-2 rounded-md border border-[#27272A] bg-[#0E0E11] px-4 text-sm text-[#E2E8F0] transition-colors hover:bg-[#27272A]"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#94A3B8]">Sort by:</span>
                    <span>Recently updated</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-[#94A3B8]" />
                </button>
              </div>
            </div>

            {profileLoading || isLoadingProjects ? (
              <div className="py-8 text-center text-sm text-[#94A3B8]">Loading projects...</div>
            ) : emptyProjects ? (
              <div className="py-12 text-center text-sm text-[#94A3B8]">No projects yet</div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                      issueCount={project.issueCount || 0}
                      memberCount={project.memberCount || 0}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Invitations" && isAdmin && (
          <WorkspaceInvitations
            workspaceId={workspaceId}
            isAdmin={isAdmin}
            currentUserId={profile?.id}
            currentUsername={profile?.username}
            pendingInvitations={pendingInvitations}
            acceptedMembers={acceptedMembers}
            rejectedInvitations={rejectedInvitations}
            isLoading={isLoadingInvitations}
            cancellingId={cancellingId}
            invitingId={invitingId}
            onCancelInvite={cancelInvite}
            onReInvite={reInvite}
          />
        )}

        {activeTab === "Invitations" && !isAdmin && (
          <PendingWorkspaceInvitations
            invitations={receivedInvitations}
            isLoading={isLoadingReceivedInvitations}
            updatingId={updatingReceivedInvitationId}
            error={receivedInvitationError}
            onAccept={acceptReceivedInvitation}
            onDecline={declineReceivedInvitation}
          />
        )}

        {activeTab === "Danger Zone" && isAdmin && (
          <div className="rounded-xl border border-red-500/20 bg-[#0E0E11] p-6">
            <div className="mb-5">
              <h2 className="text-lg font-medium text-red-500">Danger Zone</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">These actions cannot be undone.</p>
            </div>

            {/* Full-width Delete workspace card */}
            <div className="flex items-center gap-4 rounded-lg border border-[#27272A] bg-[#09090B] p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-[#E2E8F0]">Delete workspace</h3>
                <p className="mt-0.5 text-xs text-[#94A3B8] leading-relaxed">
                  Permanently remove this workspace and all its data. This action is irreversible.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="shrink-0 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/20"
              >
                Delete workspace
              </button>
            </div>

            {/* Confirmation dialog */}
            <AlertDialog
              open={showDeleteConfirm}
              onOpenChange={(open) => {
                if (!open && !isDeletingWorkspace) setShowDeleteConfirm(false)
              }}
            >
              <AlertDialogContent className="border border-[#27272A] bg-[#0E0E11] text-[#E2E8F0] shadow-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-[#E2E8F0]">
                    Delete workspace?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-[#94A3B8]">
                    Are you sure you want to permanently delete{" "}
                    <span className="font-medium text-[#E2E8F0]">{workspaceName}</span>? This will
                    remove all projects, issues, members, and data associated with this workspace.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="border-t border-[#27272A] bg-[#09090B]">
                  <AlertDialogCancel
                    className="border border-[#27272A] bg-transparent text-[#94A3B8] hover:bg-[#18181B] hover:text-[#E2E8F0]"
                    disabled={isDeletingWorkspace}
                  >
                    Keep workspace
                  </AlertDialogCancel>
                  <button
                    type="button"
                    disabled={isDeletingWorkspace}
                    onClick={handleDeleteWorkspace}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-red-500/20 bg-red-500/10 px-4 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeletingWorkspace ? "Deleting…" : "Yes, delete workspace"}
                  </button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
            email: m.email,
            joined_at: m.joined_at,
          }))}
          onClose={() => setShowMembersDialog(false)}
          isAdmin={isAdmin}
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
                    return { 
                      id: m.user_id ?? m.id, 
                      fullname, 
                      username: m.username, 
                      initials, 
                      status: "active" as const,
                      email: m.email,
                      joined_at: m.joined_at || m.created_at
                    }
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

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-8 text-[#94A3B8]">
          <div className="mb-4 h-8 w-48 animate-pulse rounded bg-[#18181B]" />
          <div className="h-64 animate-pulse rounded-xl border border-[#27272A] bg-[#0E0E11]" />
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  )
}