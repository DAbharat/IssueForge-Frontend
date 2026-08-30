"use client"

import { useState } from "react"

import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileTabs, { type ProfileTabKey } from "@/components/profile/ProfileTabs"
import WorkspaceCard from "@/components/workspaces/WorkspaceCard"
import { useProfile } from "@/hooks/use-profile"

export default function ProfilePage() {
  const { profile, isLoading, error } = useProfile()
  const [activeTab, setActiveTab] = useState<ProfileTabKey>("Workspaces")

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-lg border border-[#222631] bg-[#1A1D24] p-6 text-sm text-[#94A3B8]">
          Loading profile...
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
          {error || "Profile unavailable"}
        </div>
      </div>
    )
  }

  const displayName = profile.fullname || profile.username || "User"
  const workspaceItems = Array.isArray(profile.workspaces) ? profile.workspaces : []

  const renderTabContent = () => {
    if (activeTab === "Projects") {
      return (
        <div className="rounded-sm border border-dashed border-[#222631] bg-[#0F1115] p-6 text-sm text-[#94A3B8]">
          No projects yet.
        </div>
      )
    }

    if (activeTab === "Issues") {
      return (
        <div className="rounded-sm border border-dashed border-[#222631] bg-[#0F1115] p-6 text-sm text-[#94A3B8]">
          No issues yet.
        </div>
      )
    }

    if (workspaceItems.length === 0) {
      return (
        <div className="rounded-sm border border-dashed border-[#222631] bg-[#0F1115] p-6 text-sm text-[#94A3B8]">
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