"use client"

import { Bell, Search, UserCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

type NavbarProps = {
    workspaceName?: string
    userName?: string
}

export default function Navbar({
    workspaceName,
    userName = "User",
}: NavbarProps) {
    const initials = userName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "U"

    return (
        <header className="border-b border-white/10 bg-[#050213] px-4 py-3 text-white shadow-[0_1px_0_rgba(255,255,255,0.04)]">
            <div className="mx-auto flex max-w-7xl items-center gap-4">
                {/* Left: brand + workspace */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="shrink-0 text-lg font-semibold tracking-tight text-white">
                        IssueForge
                    </div>

                    {workspaceName ? (
                        <div className="hidden min-w-0 items-center gap-2 sm:flex">
                            <span className="shrink-0 text-white/20">/</span>
                            <span className="truncate text-sm text-white/70">{workspaceName}</span>
                        </div>
                    ) : (
                        <div className="hidden h-4 w-24 shrink-0 rounded-sm border border-dashed border-white/10 bg-white/3 sm:block" />
                    )}
                </div>

                {/* Center: search */}
                <div className="flex flex-2 justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-full max-w-xl justify-start rounded-sm border-white/10 bg-white/4 px-4 text-sm text-white/75 hover:bg-white/8 hover:text-white"
                    >
                        <Search className="mr-2 h-4 w-4 shrink-0" />
                        Search
                    </Button>
                </div>

                {/* Right: actions */}
                <div className="flex flex-1 items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        aria-label="Notifications"
                        className="h-10 w-10 shrink-0 rounded-sm border border-white/10 bg-transparent text-white/70 hover:bg-white/6 hover:text-white"
                    >
                        <Bell className="h-4 w-4" />
                    </Button>

                    <button
                        type="button"
                        aria-label="User profile"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-sm font-medium text-white transition-colors hover:bg-white/10"
                    >
                        {initials}
                    </button>
                </div>
            </div>
        </header>
    )
}