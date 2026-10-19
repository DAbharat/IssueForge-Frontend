"use client"

import { useEffect, useMemo, useState } from "react"
import { MoreVertical, Search, Check, Plus } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

export type WorkspaceMemberOverviewItem = {
  id?: string | number
  fullname: string
  username?: string
  initials: string
  role?: string
  status?: "active" | "pending"
  isRecent?: boolean
  email?: string
  joined_at?: string
  isCurrentUser?: boolean
}

export type WorkspaceMembersOverviewProps = {
  title?: string
  members: WorkspaceMemberOverviewItem[]
  activeCount?: number
  pendingCount?: number
  searchPlaceholder?: string
  onSearchChange?: (value: string) => void
  onStatusChange?: () => void
  onManageMembers?: () => void
  onShowAllMembers?: () => void
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A"
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  } catch {
    return dateStr
  }
}

export default function WorkspaceMembersOverview({
  title = "Workspace Members",
  members = [],
  searchPlaceholder = "Search members...",
  onSearchChange,
  onManageMembers,
}: WorkspaceMembersOverviewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Debounced callback to parent
  useEffect(() => {
    onSearchChange?.(debouncedSearch)
  }, [debouncedSearch, onSearchChange])

  const filteredMembers = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    if (!q) return members
    return members.filter(
      (m) =>
        m.fullname.toLowerCase().includes(q) ||
        (m.username && m.username.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.role && m.role.toLowerCase().includes(q))
    )
  }, [members, debouncedSearch])

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-[#E2E8F0]">{title}</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">Manage who has access to this workspace and their roles.</p>
        </div>
        
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-10 w-full rounded-md border border-[#27272A] bg-[#0E0E11] pl-9 pr-4 text-sm text-[#E2E8F0] placeholder:text-[#94A3B8] transition-colors focus:border-[#3F3F46] focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={onManageMembers}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-gray-300"
          >
            <Plus className="h-4 w-4" />
            <span>Add member</span>
          </button>
        </div>
      </div>

      {/* Table Structure */}
      <div className="mb-8 overflow-hidden rounded-xl border border-[#27272A] bg-[#0E0E11]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#94A3B8]">
            <thead className="border-b border-[#27272A] text-xs font-medium">
              <tr>
                <th className="px-5 py-4 font-medium">Name</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Joined</th>
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {filteredMembers.map((member) => (
                <tr key={member.id ?? member.username ?? member.fullname} className="group hover:bg-[#18181B]/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DDE1E5] text-xs font-medium text-black">
                        {member.initials}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#E2E8F0]">{member.fullname}</span>
                        {member.isCurrentUser && (
                          <span className="rounded-full bg-gray-500/50 px-2 py-0.5 text-[10px] font-medium text-white opacity-50">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {member.email || "No email"}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-md px-2 py-1 text-[11px] font-medium ${
                      member.role?.toLowerCase() === 'owner' ? 'bg-[#DDE1E5]/10 text-[#DDE1E5]' :
                      member.role?.toLowerCase() === 'admin' ? 'bg-green-500/10 text-green-500' :
                      'bg-[#27272A] text-[#E2E8F0]'
                    }`}>
                      {member.role ? member.role.charAt(0).toUpperCase() + member.role.slice(1).toLowerCase() : "Member"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs">
                    {formatDate(member.joined_at)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#94A3B8] transition-colors hover:bg-[#27272A] hover:text-[#E2E8F0]">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Section */}
      <div className="mb-6 pt-4">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-[#E2E8F0]">Role Permissions</h3>
          <p className="mt-1 text-sm text-[#94A3B8]">Here's what each role can do in this workspace.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Owner Box */}
          <div className="rounded-xl border border-[#27272A] bg-[#0E0E11] p-5">
            <div className="mb-4 inline-flex rounded-md bg-[#DDE1E5]/10 px-2.5 py-1 text-[11px] font-medium text-[#DDE1E5]">
              Owner
            </div>
            <ul className="space-y-3 text-sm text-[#E2E8F0]">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#E2E8F0]" /> Full access to everything</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#E2E8F0]" /> Manage members</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#E2E8F0]" /> Delete workspace</li>
            </ul>
          </div>
          {/* Admin Box */}
          <div className="rounded-xl border border-[#27272A] bg-[#0E0E11] p-5">
            <div className="mb-4 inline-flex rounded-md bg-green-500/10 px-2.5 py-1 text-[11px] font-medium text-green-500">
              Admin
            </div>
            <ul className="space-y-3 text-sm text-[#E2E8F0]">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#E2E8F0]" /> Manage projects and issues</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#E2E8F0]" /> Manage members</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#E2E8F0]" /> Cannot delete workspace</li>
            </ul>
          </div>
          {/* Member Box */}
          <div className="rounded-xl border border-[#27272A] bg-[#0E0E11] p-5">
            <div className="mb-4 inline-flex rounded-md bg-[#27272A] px-2.5 py-1 text-[11px] font-medium text-[#E2E8F0]">
              Member
            </div>
            <ul className="space-y-3 text-sm text-[#E2E8F0]">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#E2E8F0]" /> View and create projects</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#E2E8F0]" /> View and create issues</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#E2E8F0]" /> Cannot manage members</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}