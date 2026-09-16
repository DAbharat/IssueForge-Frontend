"use client"

import React, { useState } from "react"
import { Search, UserPlus, X } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectMemberItem = {
  id?: string | number
  fullname: string
  username: string
  role: string
  initials: string
  avatar?: string
}

export type WorkspaceMemberOption = {
  /** user_id to send to the backend */
  id: string | number
  fullname: string
  username: string
  initials: string
}

type ProjectMembersProps = {
  members: ProjectMemberItem[]
  /** workspace members that can be added to this project */
  workspaceMembers?: WorkspaceMemberOption[]
  /** whether the current viewer is the project lead */
  isLead?: boolean
  /** called with the chosen user_id when lead picks a workspace member */
  onAddMember?: (userId: string | number) => void
  /** disables the Add button and shows a spinner inside the picker while saving */
  isAddingMember?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProjectMembers({
  members,
  workspaceMembers = [],
  isLead = false,
  onAddMember,
  isAddingMember = false,
}: ProjectMembersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showPicker, setShowPicker] = useState(false)
  const [pickerSearch, setPickerSearch] = useState("")

  const filteredMembers = members.filter(
    (member) =>
      member.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Workspace members not already in the project
  const existingIds = new Set(members.map((m) => String(m.id ?? "")))
  const addableMembers = workspaceMembers.filter(
    (wm) => !existingIds.has(String(wm.id))
  )
  const filteredAddable = addableMembers.filter(
    (wm) =>
      wm.fullname.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      wm.username.toLowerCase().includes(pickerSearch.toLowerCase())
  )

  function handlePickMember(userId: string | number) {
    onAddMember?.(userId)
  }

  function closePicker() {
    if (isAddingMember) return
    setShowPicker(false)
    setPickerSearch("")
  }

  return (
    <div className="space-y-4">
      {/* ── Top Bar Controls ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => isLead && setShowPicker(true)}
          disabled={!isLead}
          title={isLead ? "Add a workspace member to this project" : "Only the project lead can add members"}
          className={[
            "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-colors",
            isLead
              ? "border-[#27272A] bg-[#18181B] text-[#E2E8F0] hover:border-[#3F3F46] hover:bg-[#27272A]"
              : "cursor-not-allowed border-[#27272A] bg-[#101012] text-[#52525B] opacity-50",
          ].join(" ")}
        >
          <UserPlus className="h-4 w-4" />
          Add New Member
        </button>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52525B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members…"
            className="w-full rounded-lg border border-[#27272A] bg-[#18181B] py-2 pl-9 pr-4 text-xs text-[#E2E8F0] placeholder:text-[#52525B] outline-none transition-colors focus:border-[#3F3F46]"
          />
        </div>
      </div>

      {/* ── Member Directory Grid ── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <div
            key={member.id ?? member.username}
            className="relative flex items-center justify-between rounded-xl border border-[#27272A] bg-[#101012] p-4 transition-all hover:border-[#3F3F46] hover:bg-[#18181B]"
          >
            {/* Avatar & User Details */}
            <div className="flex items-center gap-3 min-w-0 pr-2">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.fullname}
                  className="h-10 w-10 shrink-0 rounded-full object-cover border border-[#27272A]"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#27272A] bg-[#18181B] text-xs font-semibold text-[#E2E8F0]">
                  {member.initials}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#E2E8F0]">
                  {member.fullname}
                </p>
                <p className="truncate text-[11px] text-[#71717A]">
                  @{member.username}
                </p>
              </div>
            </div>

            {/* Role Badge */}
            <div className="shrink-0 text-right">
              <span className="text-[11px] font-medium text-[#71717A]">
                <span className={member.role === "Lead" ? "text-[#5E6AD2]" : "text-[#94A3B8]"}>
                  {member.role}
                </span>
              </span>
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-[#27272A] p-8 text-center text-xs text-[#52525B]">
            No members found matching your search.
          </div>
        )}
      </div>

      {/* ── Workspace Member Picker Overlay ── */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePicker()
          }}
        >
          <div className="w-full max-w-md rounded-xl border border-[#27272A] bg-[#101012] shadow-xl">
            {/* Picker Header */}
            <div className="flex items-center justify-between border-b border-[#27272A] px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-[#E2E8F0]">Add member</p>
                <p className="mt-0.5 text-xs text-[#94A3B8]">
                  Select a workspace member to add to this project.
                </p>
              </div>
              <button
                type="button"
                onClick={closePicker}
                disabled={isAddingMember}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[#71717A] transition-colors hover:bg-[#18181B] hover:text-[#E2E8F0] disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Picker Search */}
            <div className="border-b border-[#27272A] px-5 py-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#52525B]" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Search workspace members…"
                  autoFocus
                  className="w-full rounded-md border border-[#27272A] bg-[#18181B] py-2 pl-8 pr-3 text-xs text-[#E2E8F0] placeholder:text-[#52525B] outline-none transition-colors focus:border-[#3F3F46]"
                />
              </div>
            </div>

            {/* Picker List */}
            <div className="max-h-72 overflow-y-auto px-2 py-2">
              {filteredAddable.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#52525B]">
                  {addableMembers.length === 0
                    ? "All workspace members are already in this project."
                    : "No members match your search."}
                </div>
              ) : (
                filteredAddable.map((wm) => (
                  <button
                    key={wm.id}
                    type="button"
                    onClick={() => handlePickMember(wm.id)}
                    disabled={isAddingMember}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[#18181B] disabled:pointer-events-none disabled:opacity-50"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#27272A] bg-[#18181B] text-xs font-semibold text-[#E2E8F0]">
                      {wm.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-[#E2E8F0]">
                        {wm.fullname}
                      </p>
                      <p className="truncate text-[11px] text-[#71717A]">
                        @{wm.username}
                      </p>
                    </div>
                    {isAddingMember && (
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#27272A] border-t-[#5E6AD2]" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}