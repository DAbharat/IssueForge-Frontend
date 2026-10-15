"use client"

import { Archive } from "lucide-react"

type ArchiveEmptyStateProps = {
    title: string
    description: string
    isSearching?: boolean
    onClearSearch?: () => void
}

export default function ArchiveEmptyState({
    title,
    description,
    isSearching = false,
    onClearSearch,
}: ArchiveEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#27272A] bg-[#0E0E11]/40 py-16 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#27272A] bg-[#18181B] text-[#71717A]">
                <Archive className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#E2E8F0]">{title}</h3>
            <p className="mt-1 max-w-sm text-xs leading-5 text-[#71717A]">{description}</p>
            {isSearching && onClearSearch && (
                <button
                    type="button"
                    onClick={onClearSearch}
                    className="mt-4 rounded-md border border-[#27272A] bg-[#18181B] px-3 py-1.5 text-xs font-medium text-[#E2E8F0] hover:border-[#3F3F46]"
                >
                    Clear search
                </button>
            )}
        </div>
    )
}
