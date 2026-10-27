"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileTabs, { type ProfileTabKey } from "@/components/profile/ProfileTabs"
import WorkspaceCard from "@/components/workspaces/WorkspaceCard"
import ProfileProjectCard from "@/components/profile/ProfileProjectCard"
import ProfileIssueCard from "@/components/profile/ProfileIssueCard"
import { useProfile } from "@/hooks/use-profile"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const router = useRouter()
  const { profile, projects, issues, isLoading, isLoadingDetails, error } = useProfile({
    includeDetails: true,
  })
  const [activeTab, setActiveTab] = useState<ProfileTabKey>("Workspaces")

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-lg border border-[#27272A] bg-[#18181B] p-6 text-sm text-[#94A3B8]">
          Loading profile...
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
          <p>{error || "Profile unavailable"}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/login")}
            className="border-red-500/40 text-red-100 hover:bg-red-500/20"
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  const displayName = profile.fullname || profile.username || "User"
  const workspaceItems = Array.isArray(profile.workspaces) ? profile.workspaces : []
  const projectItems = Array.isArray(projects) ? projects : []
  const issueItems = Array.isArray(issues) ? issues : []

  const renderTabContent = () => {
    if (activeTab === "Projects") {
      if (isLoadingDetails) {
        return (
          <div className="mx-auto max-w-2xl rounded-md border border-[#27272A] bg-[#18181B] p-6 text-center text-sm text-[#94A3B8]">
            Loading projects...
          </div>
        )
      }

      if (projectItems.length === 0) {
        return (
          <div className="rounded-sm border border-dashed border-[#27272A] bg-[#000000] p-6 text-sm text-[#94A3B8]">
            No projects yet.
          </div>
        )
      }

      return (
        <div className="mx-auto w-full max-w-2xl space-y-3 md:space-y-6">
          {projectItems.map((project) => (
            <ProfileProjectCard
              key={String(project.id)}
              id={project.id}
              name={project.name}
              leadName={project.lead_name}
              workspaceName={project.workspace_name}
              createdAt={project.created_at}
              onClick={() => {
                if (!project.id) return
                router.push(`/projects/${encodeURIComponent(String(project.id))}`)
              }}
            />
          ))}
        </div>
      )
    }

    if (activeTab === "Issues") {
      if (isLoadingDetails) {
        return (
          <div className="mx-auto max-w-2xl rounded-md border border-[#27272A] bg-[#18181B] p-6 text-center text-sm text-[#94A3B8]">
            Loading issues...
          </div>
        )
      }

      if (issueItems.length === 0) {
        return (
          <div className="rounded-sm border border-dashed border-[#27272A] bg-[#000000] p-6 text-sm text-[#94A3B8]">
            No issues yet.
          </div>
        )
      }

      return (
        <div className="mx-auto w-full max-w-2xl space-y-3 md:space-y-6">
          {issueItems.map((issue) => (
            <ProfileIssueCard
              key={String(issue.id)}
              id={issue.id}
              title={issue.title}
              workspaceName={issue.workspace_name}
              labels={issue.labels}
              createdAt={issue.created_at}
              onClick={() => {
                if (!issue.id) return
                if (issue.project_id) {
                  router.push(
                    `/projects/${encodeURIComponent(String(issue.project_id))}/issues/${encodeURIComponent(String(issue.id))}`
                  )
                }
              }}
            />
          ))}
        </div>
      )
    }

    if (workspaceItems.length === 0) {
      return (
        <div className="rounded-sm border border-dashed border-[#27272A] bg-[#000000] p-6 text-sm text-[#94A3B8]">
          No workspaces yet.
        </div>
      )
    }

    return (
      <div className="mx-auto w-full max-w-2xl space-y-3 md:space-y-6">
        {workspaceItems.map((workspace) => {
          const workspaceId = workspace.id ?? ""
          const role = typeof workspace.role === "string" ? workspace.role : undefined
          const ownerName = role === "ADMIN" ? displayName : undefined

          return (
            <WorkspaceCard
              key={String(workspaceId)}
              id={workspaceId}
              name={workspace.name || "Workspace"}
              createdAt={workspace.created_at}
              ownerName={ownerName || displayName}
              onClick={() => {
                if (!workspaceId) return
                router.push(`/workspace?workspaceId=${encodeURIComponent(String(workspaceId))}`)
              }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12">
      <ProfileHeader
        id={String(profile.id ?? "")}
        fullname={displayName}
        username={profile.username || "user"}
        createdAt={profile.created_at || new Date().toISOString()}
        workspaceName={[]}
      />

      <div className="space-y-8">
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
      </div>
    </div>
  )
}