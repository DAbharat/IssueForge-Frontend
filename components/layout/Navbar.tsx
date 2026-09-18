"use client"

import { Bell, ChevronLeft, Search, User2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import WorkspaceSwitcher, {
    type WorkspaceSwitcherItem,
} from "@/components/layout/WorkspaceSwitcher"

type NavbarProps = {
    workspaceName?: string
    workspaces?: WorkspaceSwitcherItem[]
    onWorkspaceSwitch?: (workspace: WorkspaceSwitcherItem) => void
    userName?: string
    isMobile?: boolean
    onMobileSidebarToggle?: () => void
}

export default function Navbar({
    workspaceName,
    workspaces = [],
    onWorkspaceSwitch,
    userName = "User",
    isMobile = false,
    onMobileSidebarToggle,
}: NavbarProps) {
    const router = useRouter()

    return (
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

                    {workspaceName && (
                        <span className="hidden shrink-0 text-[#3F3F46] md:block">/</span>
                    )}

                    {/* Workspace switcher — shown when name is available */}
                    {workspaceName && onWorkspaceSwitch ? (
                        <WorkspaceSwitcher
                            currentWorkspaceName={workspaceName}
                            workspaces={workspaces}
                            onSwitch={onWorkspaceSwitch}
                        />
                    ) : workspaceName ? (
                        /* Fallback: plain text when no switch handler is provided */
                        <span className="hidden truncate text-sm text-[#94A3B8] md:block">
                            {workspaceName}
                        </span>
                    ) : (
                        /* Skeleton placeholder while workspace loads */
                        <div className="hidden h-4 w-24 shrink-0 animate-pulse rounded-sm border border-dashed border-[#27272A] bg-[#18181B] md:block" />
                    )}
                </div>

                {/* Center: search */}
                <div className="flex min-w-0 justify-center px-1">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-9 w-full max-w-2xl justify-start rounded-sm border-[#27272A] bg-[#18181B] px-3 text-sm text-[#94A3B8] hover:bg-[#27272A] hover:text-[#E2E8F0] md:h-10 md:px-4"
                    >
                        <Search className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">Search</span>
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
    )
}