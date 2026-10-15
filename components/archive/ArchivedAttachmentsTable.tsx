"use client"

import { FileIcon, ShieldAlert } from "lucide-react"
import type { ArchivedAttachment } from "@/services/archive.service"
import { formatArchiveDate, formatFileSize } from "./archive-utils"
import ArchiveEmptyState from "./ArchiveEmptyState"

type ArchivedAttachmentsTableProps = {
    attachments: ArchivedAttachment[]
    isSearching?: boolean
    onClearSearch?: () => void
}

export default function ArchivedAttachmentsTable({
    attachments,
    isSearching,
    onClearSearch,
}: ArchivedAttachmentsTableProps) {
    if (attachments.length === 0) {
        return (
            <ArchiveEmptyState
                title={isSearching ? "No matching attachments found" : "No archived attachments"}
                description={
                    isSearching
                        ? "Try searching with a different filename."
                        : "Deleted attachments from issues and comments will appear here."
                }
                isSearching={isSearching}
                onClearSearch={onClearSearch}
            />
        )
    }

    return (
        <div className="space-y-3">
            <div className="overflow-x-auto rounded-lg border border-[#27272A] bg-[#0E0E11]">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b border-[#27272A] bg-[#141417] text-[#94A3B8]">
                            <th className="py-3 pl-4 pr-3 font-medium">Attachment</th>
                            <th className="px-3 py-3 font-medium">Associated Issue</th>
                            <th className="px-3 py-3 font-medium">Project</th>
                            <th className="px-3 py-3 font-medium">Size & Type</th>
                            <th className="px-3 py-3 font-medium">Deleted Date</th>
                            <th className="py-3 pl-3 pr-4 text-right font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272A]">
                        {attachments.map((attachment) => (
                            <tr
                                key={attachment.id}
                                className="transition-colors hover:bg-[#18181B]/50"
                            >
                                <td className="py-3.5 pl-4 pr-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#27272A] bg-[#18181B] text-[#94A3B8]">
                                            <FileIcon className="h-3.5 w-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="truncate font-medium text-[#E2E8F0]">
                                                {attachment.original_name}
                                            </div>
                                            <div className="text-[11px] text-[#71717A]">
                                                Uploaded by: {attachment.uploader_name || `User #${attachment.uploaded_by}`}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-3.5 text-[#94A3B8]">
                                    <div className="font-medium text-[#E2E8F0]">{attachment.issue_title}</div>
                                    <div className="text-[10px] text-[#71717A]">Issue #{attachment.issue_id}</div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-3.5 text-[#94A3B8]">
                                    {attachment.project_name || `Project #${attachment.project_id}`}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3.5 text-[#94A3B8]">
                                    <div>{formatFileSize(attachment.file_size)}</div>
                                    <div className="text-[10px] uppercase text-[#71717A]">
                                        {attachment.mime_type?.split("/")[1] || attachment.resource_type || "file"}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-3.5 text-[#94A3B8]">
                                    {formatArchiveDate(attachment.deleted_at)}
                                </td>
                                <td className="whitespace-nowrap py-3.5 pl-3 pr-4 text-right">
                                    <span
                                        title="The file binary was permanently purged from cloud storage on deletion in accordance with retention policy, so it cannot be restored."
                                        className="inline-flex items-center gap-1 rounded border border-[#27272A] bg-[#18181B] px-2 py-0.5 text-[10px] font-medium text-[#71717A]"
                                    >
                                        <ShieldAlert className="h-3 w-3 text-[#CA8A04]" />
                                        <span>Purged from storage</span>
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center gap-2 px-1 text-[11px] text-[#71717A]">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-[#CA8A04]" />
                <span>
                    Storage retention policy: File binaries are purged from object storage upon deletion; attachment records are archived for audit reference.
                </span>
            </div>
        </div>
    )
}
