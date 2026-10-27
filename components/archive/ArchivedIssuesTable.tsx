"use client"

import { useState } from "react"
import { MoreHorizontal, RotateCcw } from "lucide-react"
import type { ArchivedIssue } from "@/services/archive.service"
import { formatArchiveDate } from "./archive-utils"
import RestoreConfirmationDialog from "./RestoreConfirmationDialog"
import ArchiveEmptyState from "./ArchiveEmptyState"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ArchivedIssuesTableProps = {
    issues: ArchivedIssue[]
    isRestoring: boolean
    restoringId: string | number | null
    onRestore: (id: string | number, name: string) => Promise<void>
    isSearching?: boolean
    onClearSearch?: () => void
}

export default function ArchivedIssuesTable({
    issues,
    isRestoring,
    restoringId,
    onRestore,
    isSearching,
    onClearSearch,
}: ArchivedIssuesTableProps) {
    const [selectedIssue, setSelectedIssue] = useState<ArchivedIssue | null>(null)

    if (issues.length === 0) {
        return (
            <ArchiveEmptyState
                title={isSearching ? "No matching issues found" : "No archived issues"}
                description={
                    isSearching
                        ? "Try searching with a different term."
                        : "Issues deleted from projects will appear here."
                }
                isSearching={isSearching}
                onClearSearch={onClearSearch}
            />
        )
    }

    const handleConfirmRestore = async () => {
        if (!selectedIssue) return
        await onRestore(selectedIssue.id, `#${selectedIssue.id} ${selectedIssue.title}`)
        setSelectedIssue(null)
    }

    return (
        <>
            <div className="overflow-x-auto rounded-lg border border-[#27272A] bg-[#0E0E11]">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b border-[#27272A] bg-[#141417] text-[#94A3B8]">
                            <th className="py-3 pl-4 pr-3 font-medium">Issue</th>
                            <th className="px-3 py-3 font-medium">Project & Workspace</th>
                            <th className="px-3 py-3 font-medium">Status & Priority</th>
                            <th className="px-3 py-3 font-medium">Deleted Date</th>
                            <th className="py-3 pl-3 pr-4 text-right font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272A]">
                        {issues.map((issue) => {
                            const isBeingRestored = isRestoring && restoringId === issue.id
                            const statusUpper = (issue.status || "").toUpperCase()
                            const priorityUpper = (issue.priority || "").toUpperCase()

                            return (
                                <tr
                                    key={issue.id}
                                    className="transition-colors hover:bg-[#18181B]/50"
                                >
                                    <td className="py-3.5 pl-4 pr-3">
                                        <div className="flex items-start gap-2.5">
                                            <span className="shrink-0 font-medium text-[#71717A]">
                                                #{issue.id}
                                            </span>
                                            <div className="min-w-0">
                                                <div className="truncate font-medium text-[#E2E8F0]">
                                                    {issue.title}
                                                </div>
                                                <div className="text-[11px] text-[#71717A]">
                                                    Created by: {issue.creator_name || `User #${issue.created_by}`}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3.5 text-[#94A3B8]">
                                        <div className="font-medium text-[#E2E8F0]">{issue.project_name}</div>
                                        <div className="text-[10px] text-[#71717A]">{issue.workspace_name}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="inline-flex items-center gap-1.5 rounded border border-[#27272A] bg-[#18181B] px-2 py-0.5 text-[10px] font-medium text-[#D4D4D8]">
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${
                                                        statusUpper === "IN_PROGRESS"
                                                            ? "bg-[#CA8A04]"
                                                            : statusUpper === "DONE"
                                                                ? "bg-[#22C55E]"
                                                                : "bg-[#71717A]"
                                                    }`}
                                                />
                                                {statusUpper === "IN_PROGRESS"
                                                    ? "In Progress"
                                                    : statusUpper === "DONE"
                                                        ? "Done"
                                                        : "Todo"}
                                            </span>
                                            <span className="inline-flex items-center rounded border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[10px] font-medium text-[#A1A1AA]">
                                                {priorityUpper || "LOW"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3.5 text-[#94A3B8]">
                                        {formatArchiveDate(issue.deleted_at)}
                                    </td>
                                    <td className="whitespace-nowrap py-3.5 pl-3 pr-4 text-right">
                                        {isBeingRestored ? (
                                            <div className="inline-flex h-7 w-7 items-center justify-center">
                                                <RotateCcw className="h-3.5 w-3.5 animate-spin text-[#94A3B8]" />
                                            </div>
                                        ) : (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    disabled={isRestoring}
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#27272A] bg-[#18181B] text-[#94A3B8] transition-colors hover:border-[#3F3F46] hover:bg-[#27272A] hover:text-[#E2E8F0] focus:outline-none disabled:opacity-40"
                                                    title="Options"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="min-w-[140px] rounded-lg border border-[#27272A] bg-[#101012] p-1 text-[#E2E8F0] shadow-xl"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() => setSelectedIssue(issue)}
                                                        className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-[#E2E8F0] hover:bg-[#18181B] focus:bg-[#18181B] focus:text-[#E2E8F0]"
                                                    >
                                                        <RotateCcw className="h-3.5 w-3.5 text-[#94A3B8]" />
                                                        <span>Restore item</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <RestoreConfirmationDialog
                isOpen={selectedIssue !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedIssue(null)
                }}
                itemType="issue"
                itemName={selectedIssue ? `#${selectedIssue.id} ${selectedIssue.title}` : ""}
                onConfirm={handleConfirmRestore}
                isRestoring={isRestoring}
            />
        </>
    )
}
