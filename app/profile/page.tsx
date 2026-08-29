"use client"

import ProfileHeader from "@/components/profile/ProfileHeader"
import { useProfile } from "@/hooks/use-profile"

export default function ProfilePage() {
  const { profile, isLoading, error } = useProfile()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-lg border border-white/10 bg-white/4 p-6 text-sm text-white/60">
          Loading profile...
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-lg border border-red-500/30 bg-red-500/8 p-6 text-sm text-red-200">
          {error || "Profile unavailable"}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ProfileHeader
        id={String(profile.id ?? "")}
        fullname={profile.fullname || profile.username || "User"}
        username={profile.username || "user"}
        createdAt={profile.created_at || new Date().toISOString()}
        workspaceName={(profile.workspaces ?? []).map((workspace) => ({
          id: String(workspace.id),
          name: workspace.name,
        }))}
      />
    </div>
  )
}