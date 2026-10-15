"use client"

import { useState } from "react"
import { RotateCcw } from "lucide-react"
import type { ArchivedProject } from "@/services/archive.service"
import { formatArchiveDate } from "./archive-utils"
import RestoreConfirmationDialog from "./RestoreConfirmationDialog"
import ArchiveEmptyState from "./ArchiveEmptyState"

type ArchivedProjectsTableProps = {
    projects: ArchivedProject[]
    isRestoring: boolean
    restoringId: string | number | null
    onRestore: (id: string | number, name: string) => Promise<void>
    isSearching?: boolean
    onClearSearch?: () => void
}

export default function ArchivedProjectsTable({
    projects,
    isRestoring,
    restoringId,
    onRestore,
    isSearching,
    onClearSearch,
}: ArchivedProjectsTableProps) {
    const [selectedProject, setSelectedProject] = useState<ArchivedProject | null>(null)

    if (projects.length === 0) {
        return (
            <ArchiveEmptyState
                title={isSearching ? "No matching projects found" : "No archived projects"}
                description={
                    isSearching
                        ? "Try searching with a different term."
                        : "Projects deleted by project leads or workspace administrators will appear here."
                }
                isSearching={isSearching}
                onClearSearch={onClearSearch}
            />
        )
    }

    const handleConfirmRestore = async () => {
        if (!selectedProject) return
        await onRestore(selectedProject.id, selectedProject.name)
        setSelectedProject(null)
    }

    return (
        <>
            <div className="overflow-x-auto rounded-lg border border-[#27272A] bg-[#0E0E11]">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b border-[#27272A] bg-[#141417] text-[#94A3B8]">
                            <th className="py-3 pl-4 pr-3 font-medium">Project</th>
                            <th className="px-3 py-3 font-medium">Parent Workspace</th>
                            <th className="px-3 py-3 font-medium">Project Lead</th>
                            <th className="px-3 py-3 font-medium">Deleted Date</th>
                            <th className="py-3 pl-3 pr-4 text-right font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272A]">
                        {projects.map((project) => {
                            const isBeingRestored = isRestoring && restoringId === project.id

                            return (
                                <tr
                                    key={project.id}
                                    className="transition-colors hover:bg-[#18181B]/50"
                                >
                                    <td className="py-3.5 pl-4 pr-3">
                                        <div className="flex items-center gap-2.5">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#27272A] bg-[#18181B] text-xs font-semibold text-[#E2E8F0]">
                                                {project.name.charAt(0).toUpperCase()}
                                            </span>
                                            <div className="min-w-0">
                                                <div className="truncate font-medium text-[#E2E8F0]">
                                                    {project.name}
                                                </div>
                                                {project.description && (
                                                    <div className="line-clamp-1 text-[11px] text-[#71717A]">
                                                        {project.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3.5 text-[#94A3B8]">
                                        <div className="font-medium text-[#E2E8F0]">{project.workspace_name}</div>
                                        <div className="text-[10px] text-[#71717A]">ID: #{project.workspace_id}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3.5 text-[#94A3B8]">
                                        {project.lead_name || `User #${project.lead_id}`}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3.5 text-[#94A3B8]">
                                        {formatArchiveDate(project.deleted_at)}
                                    </td>
                                    <td className="whitespace-nowrap py-3.5 pl-3 pr-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedProject(project)}
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
                isOpen={selectedProject !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedProject(null)
                }}
                itemType="project"
                itemName={selectedProject?.name ?? ""}
                onConfirm={handleConfirmRestore}
                isRestoring={isRestoring}
            />
        </>
    )
}
