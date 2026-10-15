"use client"

import { Briefcase, FileText, FolderKanban, Paperclip } from "lucide-react"
import type { ArchiveCounts } from "@/services/archive.service"
import type { ArchiveTabKey } from "@/hooks/use-archive"

type ArchiveSummaryCardsProps = {
    counts: ArchiveCounts
    activeTab: ArchiveTabKey
    onTabSelect: (tab: ArchiveTabKey) => void
    isLoading?: boolean
}

export default function ArchiveSummaryCards({
    counts,
    activeTab,
    onTabSelect,
    isLoading = false,
}: ArchiveSummaryCardsProps) {
    const cards = [
        {
            key: "Workspaces" as const,
            title: "Workspaces",
            count: counts.workspaces,
            icon: Briefcase,
            description: "Archived workspaces",
        },
        {
            key: "Projects" as const,
            title: "Projects",
            count: counts.projects,
            icon: FolderKanban,
            description: "Archived projects",
        },
        {
            key: "Issues" as const,
            title: "Issues",
            count: counts.issues,
            icon: FileText,
            description: "Archived issues",
        },
        {
            key: "Attachments" as const,
            title: "Attachments",
            count: counts.attachments,
            icon: Paperclip,
            description: "Deleted file attachments",
        },
    ]

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {cards.map((card) => {
                const Icon = card.icon
                const isSelected = activeTab === card.key

                return (
                    <button
                        key={card.key}
                        type="button"
                        onClick={() => onTabSelect(card.key)}
                        className={[
                            "relative flex flex-col justify-between rounded-lg border p-4 text-left transition-all",
                            isSelected
                                ? "border-[#DDE1E5] bg-[#18181B] shadow-sm"
                                : "border-[#27272A] bg-[#0E0E11] hover:border-[#3F3F46] hover:bg-[#18181B]/60",
                        ].join(" ")}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-[#94A3B8]">{card.title}</span>
                            <div
                                className={[
                                    "flex h-7 w-7 items-center justify-center rounded-md border",
                                    isSelected
                                        ? "border-[#DDE1E5]/30 bg-[#DDE1E5]/10 text-[#DDE1E5]"
                                        : "border-[#27272A] bg-[#18181B] text-[#94A3B8]",
                                ].join(" ")}
                            >
                                <Icon className="h-3.5 w-3.5" />
                            </div>
                        </div>

                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold tracking-tight text-[#E2E8F0]">
                                {isLoading ? "—" : card.count}
                            </span>
                            <span className="text-[11px] text-[#71717A]">items</span>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}
