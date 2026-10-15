"use client"

import { ARCHIVE_TABS, type ArchiveTabKey } from "@/hooks/use-archive"

type ArchiveTabsProps = {
    activeTab: ArchiveTabKey
    onTabChange: (tab: ArchiveTabKey) => void
    counts?: {
        workspaces: number
        projects: number
        issues: number
        attachments: number
    }
}

export default function ArchiveTabs({ activeTab, onTabChange, counts }: ArchiveTabsProps) {
    const getCountForTab = (tab: ArchiveTabKey) => {
        if (!counts) return null
        switch (tab) {
            case "Workspaces":
                return counts.workspaces
            case "Projects":
                return counts.projects
            case "Issues":
                return counts.issues
            case "Attachments":
                return counts.attachments
        }
    }

    return (
        <div className="overflow-x-auto" role="tablist" aria-label="Archive sections">
            <div className="grid min-w-[28rem] grid-cols-4 items-end border-b border-[#27272A] pb-2">
                {ARCHIVE_TABS.map((tab) => {
                    const isActive = activeTab === tab
                    const count = getCountForTab(tab)

                    return (
                        <button
                            key={tab}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => onTabChange(tab)}
                            className={[
                                "relative flex items-center justify-center gap-2 pb-2 text-sm font-medium transition-colors",
                                isActive ? "text-[#E2E8F0]" : "text-[#94A3B8] hover:text-[#E2E8F0]",
                            ].join(" ")}
                        >
                            <span>{tab}</span>
                            {count !== null && (
                                <span
                                    className={[
                                        "rounded-full px-1.5 py-0.2 text-[11px] font-semibold",
                                        isActive
                                            ? "border border-[#27272A] bg-[#27272A] text-[#E2E8F0]"
                                            : "border border-[#27272A] bg-[#18181B] text-[#71717A]",
                                    ].join(" ")}
                                >
                                    {count}
                                </span>
                            )}
                            {isActive && (
                                <span className="absolute inset-x-5 -bottom-2.25 h-0.5 rounded-full bg-[#E2E8F0]" />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
