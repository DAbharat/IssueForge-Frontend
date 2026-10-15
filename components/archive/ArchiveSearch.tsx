"use client"

import { Search, X } from "lucide-react"
import type { ArchiveTabKey } from "@/hooks/use-archive"

type ArchiveSearchProps = {
    value: string
    onChange: (value: string) => void
    activeTab: ArchiveTabKey
}

export default function ArchiveSearch({ value, onChange, activeTab }: ArchiveSearchProps) {
    const getPlaceholder = () => {
        switch (activeTab) {
            case "Workspaces":
                return "Search archived workspaces by name…"
            case "Projects":
                return "Search archived projects by name…"
            case "Issues":
                return "Search archived issues by title or #ID…"
            case "Attachments":
                return "Search attachments by filename…"
        }
    }

    return (
        <div className="relative flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={getPlaceholder()}
                className="h-9 w-full rounded-md border border-[#27272A] bg-[#0E0E11] pl-9 pr-8 text-xs text-[#E2E8F0] placeholder-[#71717A] transition-colors focus:border-[#DDE1E5] focus:outline-none"
            />
            {value ? (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#E2E8F0]"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            ) : null}
        </div>
    )
}
