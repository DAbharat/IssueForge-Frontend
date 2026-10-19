"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { Bell, ChevronLeft, Search, User2, X, Check } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import WorkspaceSwitcher, {
    type WorkspaceSwitcherItem,
} from "@/components/layout/WorkspaceSwitcher"
import ProfileCard from "@/components/profile/ProfileCard"
import { searchUsers, type SearchUserResult } from "@/services/account.service"
import { listWorkspaceMembers } from "@/services/workspaceMembers.service"
import {
    createWorkspaceInvitation,
    cancelInvitation,
    listPendingWorkspaceInvitationsForWorkspace,
} from "@/services/invitations.service"
import { useWorkspaceSwitcher } from "@/hooks/use-workspace-switcher"
import { useDebounce } from "@/hooks/use-debounce"
import { toast } from "@/components/ui/toast"

type NavbarProps = {
    workspaceName?: string
    workspaces?: WorkspaceSwitcherItem[]
    onWorkspaceSwitch?: (workspace: WorkspaceSwitcherItem) => void
    onCreateWorkspace?: () => void
    userName?: string
    isMobile?: boolean
    onMobileSidebarToggle?: () => void
}

export default function Navbar({
    workspaceName,
    workspaces = [],
    onWorkspaceSwitch,
    onCreateWorkspace,
    userName = "User",
    isMobile = false,
    onMobileSidebarToggle,
}: NavbarProps) {
    const router = useRouter()
    const { activeWorkspace, profile } = useWorkspaceSwitcher()

    // ── Search State ──────────────────────────────────────────────────────────
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const debouncedQuery = useDebounce(searchQuery, 350)
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState<SearchUserResult[]>([])
    const [hasSearched, setHasSearched] = useState(false)
    const [workspaceMemberIds, setWorkspaceMemberIds] = useState<Set<string>>(new Set())
    const [pendingInvitationsMap, setPendingInvitationsMap] = useState<Map<string, string | number>>(new Map())
    const [invitingUserId, setInvitingUserId] = useState<string | number | null>(null)
    const [cancellingUserId, setCancellingUserId] = useState<string | number | null>(null)

    const searchInputRef = useRef<HTMLInputElement>(null)
    const lastExecutedQueryRef = useRef<string>("")
    const searchAbortRef = useRef<AbortController | null>(null)

    // Whether current user has admin rights in the active workspace
    const isAdmin = Boolean(
        activeWorkspace?.role &&
        ["admin", "owner"].includes(activeWorkspace.role.toLowerCase())
    )

    // Load active workspace members and pending invitations when search modal opens
    useEffect(() => {
        if (!isSearchOpen || !activeWorkspace?.id) return

        let cancelled = false
        async function loadMembersAndInvitations() {
            try {
                const [members, pending] = await Promise.all([
                    listWorkspaceMembers(activeWorkspace!.id).catch(() => []),
                    listPendingWorkspaceInvitationsForWorkspace(activeWorkspace!.id).catch(() => []),
                ])

                if (!cancelled) {
                    if (Array.isArray(members)) {
                        setWorkspaceMemberIds(
                            new Set(members.map((m) => String(m.user_id ?? m.id)))
                        )
                    }

                    if (Array.isArray(pending)) {
                        const pMap = new Map<string, string | number>()
                        pending.forEach((p) => {
                            const uid = p.invited_user_id
                            if (uid !== undefined && uid !== null) {
                                pMap.set(String(uid), p.id)
                            }
                        })
                        setPendingInvitationsMap(pMap)
                    }
                }
            } catch {
                // Ignore member list errors
            }
        }

        loadMembersAndInvitations()
        return () => {
            cancelled = true
        }
    }, [isSearchOpen, activeWorkspace?.id])

    // Focus search input when modal opens
    useEffect(() => {
        if (isSearchOpen) {
            const timer = setTimeout(() => searchInputRef.current?.focus(), 60)
            return () => clearTimeout(timer)
        } else {
            // Reset search input and results on close
            setSearchQuery("")
            setResults([])
            setHasSearched(false)
            lastExecutedQueryRef.current = ""
        }
    }, [isSearchOpen])

    // Global keyboard shortcut: Ctrl+K / Cmd+K to toggle search
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                setIsSearchOpen((prev) => !prev)
            }
        }

        window.addEventListener("keydown", handleGlobalKeyDown)
        return () => window.removeEventListener("keydown", handleGlobalKeyDown)
    }, [])

    // Cancel in-flight search on close or unmount
    useEffect(() => {
        if (!isSearchOpen && searchAbortRef.current) {
            searchAbortRef.current.abort()
            searchAbortRef.current = null
        }
    }, [isSearchOpen])

    // ── Search Execution (called by debouncedQuery effect or Enter key) ───────
    const executeSearch = useCallback(async (query: string) => {
        const trimmed = query.trim()
        if (!trimmed) {
            if (searchAbortRef.current) {
                searchAbortRef.current.abort()
                searchAbortRef.current = null
            }
            setResults([])
            setHasSearched(false)
            setIsLoading(false)
            lastExecutedQueryRef.current = ""
            return
        }

        // Cancel previous request to avoid spamming server and prevent race conditions
        if (searchAbortRef.current) {
            searchAbortRef.current.abort()
        }
        const controller = new AbortController()
        searchAbortRef.current = controller

        lastExecutedQueryRef.current = trimmed
        setIsLoading(true)
        setHasSearched(true)

        try {
            const users = await searchUsers(trimmed, controller.signal)
            if (!controller.signal.aborted) {
                setResults(Array.isArray(users) ? users : [])
            }
        } catch {
            if (!controller.signal.aborted) {
                setResults([])
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsLoading(false)
            }
        }
    }, [])

    // ── Debounced Search Effect: Triggers API call 350ms after user pauses typing ─
    useEffect(() => {
        if (!isSearchOpen) return
        const trimmed = debouncedQuery.trim()
        if (!trimmed) {
            setResults([])
            setHasSearched(false)
            setIsLoading(false)
            lastExecutedQueryRef.current = ""
            return
        }

        if (trimmed === lastExecutedQueryRef.current) return
        executeSearch(trimmed)
    }, [debouncedQuery, isSearchOpen, executeSearch])

    // ── Enter Key and Escape Handlers ─────────────────────────────────────────
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const trimmed = searchQuery.trim()
            if (trimmed) {
                executeSearch(trimmed)
            }
        } else if (e.key === "Escape") {
            e.preventDefault()
            setIsSearchOpen(false)
        }
    }

    // ── Send Invite Handler ───────────────────────────────────────────────────
    const handleSendInvite = async (userId: string | number, userLabel?: string) => {
        if (!activeWorkspace?.id) return

        setInvitingUserId(userId)

        try {
            const newInvite = await createWorkspaceInvitation(activeWorkspace.id, { user_id: userId })
            setPendingInvitationsMap((prev) => {
                const next = new Map(prev)
                next.set(String(userId), newInvite.id)
                return next
            })
            toast.success(
                "Invitation sent",
                userLabel ? `Invitation request sent to ${userLabel}.` : "Workspace invitation sent successfully!"
            )
        } catch (err) {
            toast.error(
                "Failed to send invitation",
                err instanceof Error ? err.message : "An error occurred while sending the invitation."
            )
        } finally {
            setInvitingUserId(null)
        }
    }

    // ── Cancel Invite Handler ─────────────────────────────────────────────────
    const handleCancelInvite = async (userId: string | number, invitationId: string | number, userLabel?: string) => {
        setCancellingUserId(userId)

        try {
            await cancelInvitation(invitationId)
            setPendingInvitationsMap((prev) => {
                const next = new Map(prev)
                next.delete(String(userId))
                return next
            })
            toast.info(
                "Invitation cancelled",
                userLabel ? `Invitation for ${userLabel} has been cancelled.` : "The invitation has been cancelled."
            )
        } catch (err) {
            toast.error(
                "Failed to cancel invitation",
                err instanceof Error ? err.message : "An error occurred while cancelling the invitation."
            )
        } finally {
            setCancellingUserId(null)
        }
    }

    return (
        <>
            <header className="border-b border-[#27272A] bg-[#000000] px-3 py-3 text-[#E2E8F0] shadow-[0_1px_0_rgba(255,255,255,0.02)] md:px-4">
                <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-2 md:gap-3">
                    {/* Left: toggle + brand + workspace switcher */}
                    <div className="flex min-w-0 items-center gap-2">
                        {isMobile && (
                            <button
                                type="button"
                                aria-label="Open sidebar"
                                onClick={onMobileSidebarToggle}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-[#27272A] bg-[#18181B] text-[#94A3B8] transition-colors hover:bg-[#27272A] hover:text-[#E2E8F0] md:h-9 md:w-9"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                        )}

                        <div className="shrink-0 whitespace-nowrap text-sm font-semibold tracking-tight text-[#E2E8F0] md:text-lg">
                            IssueForge
                        </div>

                        <span className="hidden shrink-0 text-[#3F3F46] md:block">/</span>

                        {/* Workspace switcher */}
                        {onWorkspaceSwitch ? (
                            <WorkspaceSwitcher
                                currentWorkspaceName={workspaceName || ""}
                                workspaces={workspaces}
                                onSwitch={onWorkspaceSwitch}
                                onCreateWorkspace={onCreateWorkspace}
                            />
                        ) : workspaceName ? (
                            <span className="hidden truncate text-sm text-[#94A3B8] md:block">
                                {workspaceName}
                            </span>
                        ) : null}
                    </div>

                    {/* Center: Search Button (triggers search modal on click or Cmd+K) */}
                    <div className="flex min-w-0 justify-center px-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsSearchOpen(true)}
                            className="h-9 w-full max-w-2xl justify-between rounded-sm bg-[#0E0E11] px-3 text-sm text-[#94A3B8] hover:border-[#3F3F46] hover:bg-[#18181B] hover:text-[#E2E8F0] md:h-10 md:px-4"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <Search className="h-4 w-4 shrink-0 text-[#94A3B8]" />
                                <span className="truncate">Search users…</span>
                            </div>
                            <kbd className="hidden rounded border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[10px] font-medium text-[#71717A] sm:inline-block">
                                ⌘K
                            </kbd>
                        </Button>
                    </div>

                    {/* Right: notifications + profile */}
                    <div className="flex items-center justify-end gap-1.5 md:gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            aria-label="Notifications"
                            className="h-9 w-9 shrink-0 cursor-pointer rounded-sm bg-transparent p-0 text-[#94A3B8] hover:bg-[#18181B] hover:text-[#E2E8F0] md:h-10 md:w-10"
                        >
                            <Bell className="h-4 w-4 md:h-5 md:w-5" />
                        </Button>

                        <button
                            type="button"
                            onClick={() => router.push("/profile")}
                            aria-label="User profile"
                            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent text-sm font-medium text-[#E2E8F0] transition-colors hover:bg-[#18181B] md:h-8 md:w-8"
                        >
                            <User2 className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Search Modal Dialog Overlay ─────────────────────────────────── */}
            {isSearchOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-16 sm:pt-20 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsSearchOpen(false)
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Search users"
                        className="flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#27272A] bg-[#0E0E11] shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
                    >
                        {/* ── Search Input Header ── */}
                        <div className="flex items-center border-b border-[#27272A] bg-[#101012] px-4 py-3">
                            <Search className="h-4 w-4 shrink-0 text-[#94A3B8]" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleInputKeyDown}
                                placeholder="Search users by name or username…"
                                className="ml-3 flex-1 bg-transparent text-sm text-[#E2E8F0] placeholder:text-[#94A3B8]/60 focus:outline-none"
                            />

                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery("")
                                        setResults([])
                                        setHasSearched(false)
                                        searchInputRef.current?.focus()
                                    }}
                                    className="mr-2 flex h-6 w-6 items-center justify-center rounded text-[#71717A] transition-colors hover:text-[#E2E8F0]"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(false)}
                                className="flex h-6 items-center justify-center rounded border border-[#27272A] bg-[#18181B] px-1.5 text-[11px] font-medium text-[#94A3B8] transition-colors hover:border-[#3F3F46] hover:text-[#E2E8F0]"
                            >
                                ESC
                            </button>
                        </div>


                        {/* ── Search Results Area ── */}
                        <div
                            className="max-h-[480px] min-h-[160px] overflow-y-auto p-3.5 space-y-2.5 [scrollbar-width:thin] [scrollbar-color:#3F3F46_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#3F3F46]"
                        >
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#27272A] border-t-[#DDE1E5]" />
                                    <p className="mt-3 text-xs text-[#94A3B8]">Searching users…</p>
                                </div>
                            ) : !hasSearched && results.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Search className="h-7 w-7 text-[#27272A]" />
                                    <p className="mt-2 text-xs text-[#94A3B8]">
                                        Type a name or username to search users across IssueForge.
                                    </p>
                                </div>
                            ) : hasSearched && results.length === 0 ? (
                                <div className="py-12 text-center text-xs text-[#94A3B8]">
                                    No users found matching &ldquo;<span className="text-[#E2E8F0]">{searchQuery}</span>&rdquo;.
                                </div>
                            ) : (
                                results.map((user) => {
                                    const isMember = workspaceMemberIds.has(String(user.id))
                                    const isPending = pendingInvitationsMap.has(String(user.id))
                                    const invitationId = pendingInvitationsMap.get(String(user.id))
                                    const isSelf = profile?.id !== undefined && String(user.id) === String(profile.id)

                                    return (
                                        <ProfileCard
                                            key={user.id}
                                            user={{
                                                id: user.id,
                                                fullname: user.fullname,
                                                username: user.username,
                                                created_at: user.created_at,
                                            }}
                                            isAdmin={isAdmin}
                                            currentUserRole={activeWorkspace?.role}
                                            isAlreadyMember={isMember}
                                            isInWorkspace={isMember}
                                            isCurrentUser={isSelf}
                                            isPendingInvite={isPending}
                                            onInvite={() => handleSendInvite(user.id, user.fullname || user.username)}
                                            onCancelInvite={() => {
                                                if (invitationId !== undefined) {
                                                    handleCancelInvite(user.id, invitationId, user.fullname || user.username)
                                                }
                                            }}
                                            isInviting={invitingUserId === user.id}
                                            isCancelling={cancellingUserId === user.id}
                                            onClick={() => {
                                                // Optional click action to view user
                                            }}
                                        />
                                    )
                                })
                            )}
                        </div>

                        {/* ── Footer ── */}
                        <div className="flex items-center justify-between border-t border-[#27272A] bg-[#101012] px-4 py-2.5 text-[11px] text-[#71717A]">
                            <div className="flex items-center gap-3">
                                <span>
                                    <kbd className="rounded border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[10px] text-[#94A3B8]">↵</kbd> to search immediately
                                </span>
                                <span>
                                    <kbd className="rounded border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[10px] text-[#94A3B8]">ESC</kbd> to close
                                </span>
                            </div>

                            {results.length > 0 && (
                                <span className="text-[#94A3B8]">
                                    {results.length} {results.length === 1 ? "result" : "results"}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}