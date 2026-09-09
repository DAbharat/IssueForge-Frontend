"use client"

import { Search, SlidersHorizontal, Plus } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import ProjectCard from "@/components/projects/ProjectCard"
import WorkspaceMembersOverview, {
  type WorkspaceMemberOverviewItem,
} from "@/components/workspace-members/WorkspaceMembersOverview"
import { useProfile } from "@/hooks/use-profile"
import { listProjectsByLead, type Project } from "@/services/projects.service"
import {
  listWorkspaceMembers,
  type WorkspaceMember,
} from "@/services/workspaceMembers.service"

export default function WorkspacePage() {
  const searchParams = useSearchParams()
  const { profile, isLoading: profileLoading } = useProfile()
  const [workspaceName, setWorkspaceName] = useState("Workspace")
  const [workspaceId, setWorkspaceId] = useState<string | number | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [members, setMembers] = useState<WorkspaceMemberOverviewItem[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
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

    async function loadProjects() {
      setIsLoadingProjects(true)

      try {
        const response = await listProjectsByLead(activeWorkspaceId)
        if (!cancelled) {
          setProjects(Array.isArray(response) ? response : [])
        }
      } catch {
        if (!cancelled) {
          setProjects([])
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProjects(false)
        }
      }
    }

    async function loadMembers() {
      setIsLoadingMembers(true)

      try {
        const response = await listWorkspaceMembers(activeWorkspaceId)
        if (!cancelled) {
          const nextMembers: WorkspaceMemberOverviewItem[] = Array.isArray(response)
            ? response.map((member: WorkspaceMember) => {
              const fullname = member.fullname || member.username || "Member"
              const initials = fullname
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join("") || "M"

              return {
                id: member.id,
                fullname,
                username: member.username,
                initials,
                status: "active",
              }
            })
            : []

          setMembers(nextMembers)
        }
      } catch {
        if (!cancelled) {
          setMembers([])
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMembers(false)
        }
      }
    }

    loadProjects()
    loadMembers()

    return () => {
      cancelled = true
    }
  }, [workspaceId])

  const emptyProjects = !isLoadingProjects && projects.length === 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[#E2E8F0] sm:text-4xl">{workspaceName}</h1>
        <p className="mt-2 text-base text-[#94A3B8]">Workspace overview</p>
      </div>

      <section className="space-y-8">
        <WorkspaceMembersOverview
          members={members}
          activeCount={members.filter((member) => member.status === "active").length}
          pendingCount={members.filter((member) => member.status === "pending").length}
          onSearchChange={() => undefined}
          onStatusChange={() => undefined}
          onManageMembers={() => undefined}
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
    </div>
  )
}