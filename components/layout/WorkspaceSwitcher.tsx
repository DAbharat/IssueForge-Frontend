"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"

export type WorkspaceSwitcherItem = {
    id: string | number
    name: string
    role?: string
}

type WorkspaceSwitcherProps = {
    currentWorkspaceName: string
    workspaces: WorkspaceSwitcherItem[]
    onSwitch: (workspace: WorkspaceSwitcherItem) => void
}

export default function WorkspaceSwitcher({
    currentWorkspaceName,
    workspaces,
    onSwitch,
}: WorkspaceSwitcherProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClick)
        }
        return () => document.removeEventListener("mousedown", handleClick)
    }, [open])

    // Close on Escape
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false)
        }
        if (open) {
            document.addEventListener("keydown", handleKey)
        }
        return () => document.removeEventListener("keydown", handleKey)
    }, [open])

    return (
        <div ref={ref} className="relative hidden md:block">
            <button
                type="button"
                id="workspace-switcher-trigger"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                className="group flex max-w-[200px] items-center gap-1.5 rounded-md border border-transparent px-1.5 py-1 text-sm text-[#94A3B8] transition-colors hover:border-[#27272A] hover:bg-[#18181B] hover:text-[#E2E8F0] focus:outline-none"
            >
                <span className="truncate font-medium">{currentWorkspaceName}</span>
                <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                />
                {workspaces.length > 1 && (
                    <span className="shrink-0 rounded-full bg-[#27272A] px-1.5 py-0.5 text-[9px] font-semibold text-[#71717A] leading-none">
                        {workspaces.length}
                    </span>
                )}
            </button>

            {open && (
                <div
                    role="listbox"
                    aria-label="Switch workspace"
                    className="absolute left-0 top-full z-50 mt-1.5 min-w-[220px] overflow-hidden rounded-lg border border-[#27272A] bg-[#0C0C0E] shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                >
                    {/* Header */}
                    <div className="border-b border-[#27272A] px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#52525B]">
                            Workspaces
                        </p>
                    </div>

                    {/* Workspace list */}
                    <ul className="max-h-60 overflow-y-auto py-1">
                        {workspaces.map((ws) => {
                            const isActive = ws.name === currentWorkspaceName
                            const initials = ws.name.slice(0, 2).toUpperCase()

                            return (
                                <li key={ws.id}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={isActive}
                                        onClick={() => {
                                            onSwitch(ws)
                                            setOpen(false)
                                        }}
                                        className={`group flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-[#18181B] focus:outline-none ${isActive
                                            ? "bg-[#18181B]"
                                            : ""
                                            }`}
                                    >
                                        {/* Avatar */}
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#DDE1E5] text-[9px] font-bold text-black">
                                            {initials}
                                        </div>

                                        {/* Name + role */}
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`truncate text-xs font-medium ${isActive
                                                    ? "text-[#E2E8F0]"
                                                    : "text-[#A1A1AA] group-hover:text-[#E2E8F0]"
                                                    }`}
                                            >
                                                {ws.name}
                                            </p>
                                            {ws.role && (
                                                <p className="truncate text-[10px] capitalize text-[#52525B]">
                                                    {ws.role}
                                                </p>
                                            )}
                                        </div>

                                        {/* Active check */}
                                        {isActive && (
                                            <Check className="h-3.5 w-3.5 shrink-0 text-[#DDE1E5]" />
                                        )}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}
