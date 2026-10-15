"use client"

import { useState } from "react"
import { RotateCcw } from "lucide-react"
import type { ArchivedWorkspace } from "@/services/archive.service"
import { formatArchiveDate } from "./archive-utils"
import RestoreConfirmationDialog from "./RestoreConfirmationDialog"
import ArchiveEmptyState from "./ArchiveEmptyState"

type ArchivedWorkspacesTableProps = {
    workspaces: ArchivedWorkspace[]
    isRestoring: boolean
    restoringId: string | number | null
    onRestore: (id: string | number, name: string) => Promise<void>
    isSearching?: boolean
    onClearSearch?: () => void
}

export default function ArchivedWorkspacesTable({
    workspaces,
    isRestoring,
    restoringId,
    onRestore,
    isSearching,
    onClearSearch,
}: ArchivedWorkspacesTableProps) {
    const [selectedWorkspace, setSelectedWorkspace] = useState<ArchivedWorkspace | null>(null)

    if (workspaces.length === 0) {
        return (
            <ArchiveEmptyState
                title={isSearching ? "No matching workspaces found" : "No archived workspaces"}
                description={
                    isSearching
                        ? "Try searching with a different term."
                        : "Workspaces deleted by workspace administrators will appear here."
                }
                isSearching={isSearching}
                onClearSearch={onClearSearch}
            />
        )
    }

    const handleConfirmRestore = async () => {
        if (!selectedWorkspace) return
        await onRestore(selectedWorkspace.id, selectedWorkspace.name)
        setSelectedWorkspace(null)
    }

    return (
        <>
            <div className="overflow-x-auto rounded-lg border border-[#27272A] bg-[#0E0E11]">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b border-[#27272A] bg-[#141417] text-[#94A3B8]">
                            <th className="py-3 pl-4 pr-3 font-medium">Workspace</th>
                            <th className="px-3 py-3 font-medium">Deleted Date</th>
                            <th className="px-3 py-3 font-medium">Created Date</th>
                            <th className="py-3 pl-3 pr-4 text-right font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272A]">
                        {workspaces.map((workspace) => {
                            const isBeingRestored = isRestoring && restoringId === workspace.id

                            return (
                                <tr
                                    key={workspace.id}
                                    className="transition-colors hover:bg-[#18181B]/50"
                                >
                                    <td className="py-3.5 pl-4 pr-3">
                                        <div className="flex items-center gap-2.5">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#27272A] bg-[#18181B] text-xs font-semibold text-[#E2E8F0]">
                                                {workspace.name.charAt(0).toUpperCase()}
                                            </span>
                                            <div className="min-w-0">
                                                <div className="truncate font-medium text-[#E2E8F0]">
                                                    {workspace.name}
                                                </div>
                                                <div className="text-[11px] text-[#71717A]">
                                                    ID: #{workspace.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3.5 text-[#94A3B8]">
                                        {formatArchiveDate(workspace.deleted_at)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3.5 text-[#71717A]">
                                        {formatArchiveDate(workspace.created_at)}
                                    </td>
                                    <td className="whitespace-nowrap py-3.5 pl-3 pr-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedWorkspace(workspace)}
                                            disabled={isRestoring}
                                            className="inline-flex items-center gap-1.5 rounded-md border border-[#27272A] bg-[#18181B] px-2.5 py-1 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46] hover:bg-[#27272A] disabled:opacity-40"
                                        >
                                            <RotateCcw className="h-3 w-3" />
                                            <span>{isBeingRestored ? "Restoring…" : "Restore"}</span>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <RestoreConfirmationDialog
                isOpen={selectedWorkspace !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedWorkspace(null)
                }}
                itemType="workspace"
                itemName={selectedWorkspace?.name ?? ""}
                onConfirm={handleConfirmRestore}
                isRestoring={isRestoring}
            />
        </>
    )
}
