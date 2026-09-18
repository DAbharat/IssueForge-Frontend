"use client"

import { useEffect, useRef, useState } from "react"
import { Users, X } from "lucide-react"

type EditWorkspaceNameModalProps = {
    currentName: string
    isSaving: boolean
    error?: string | null
    onSave: (newName: string) => void
    onClose: () => void
    /** When provided, a "Manage Members" button appears in the bottom-left corner */
    onManageMembers?: () => void
}

export default function EditWorkspaceNameModal({
    currentName,
    isSaving,
    error,
    onSave,
    onClose,
    onManageMembers,
}: EditWorkspaceNameModalProps) {
    const [name, setName] = useState(currentName)
    const inputRef = useRef<HTMLInputElement>(null)

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
    }, [])

    // Close on Escape
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape" && !isSaving) onClose()
        }
        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    }, [isSaving, onClose])

    const trimmed = name.trim()
    const isUnchanged = trimmed === currentName.trim()
    const canSubmit = trimmed.length > 0 && !isUnchanged && !isSaving

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!canSubmit) return
        onSave(trimmed)
    }

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isSaving) onClose()
            }}
        >
            {/* Panel */}
            <div className="w-full max-w-md overflow-hidden rounded-xl border border-[#27272A] bg-[#0C0C0E] shadow-[0_24px_64px_rgba(0,0,0,0.7)]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#27272A] px-5 py-4">
                    <h2 className="text-sm font-semibold text-[#E2E8F0]">
                        Rename workspace
                    </h2>
                    <button
                        type="button"
                        aria-label="Close"
                        disabled={isSaving}
                        onClick={onClose}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-[#71717A] transition-colors hover:bg-[#18181B] hover:text-[#E2E8F0] disabled:pointer-events-none"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
                    <div className="space-y-1.5">
                        <label
                            htmlFor="workspace-name-input"
                            className="text-xs font-medium text-[#71717A]"
                        >
                            Workspace name
                        </label>
                        <input
                            id="workspace-name-input"
                            ref={inputRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isSaving}
                            maxLength={80}
                            placeholder="Enter workspace name"
                            className="h-9 w-full rounded-md border border-[#27272A] bg-[#18181B] px-3 text-sm text-[#E2E8F0] placeholder:text-[#52525B] transition-colors focus:border-[#3F3F46] focus:outline-none disabled:opacity-50"
                        />
                        {error && (
                            <p className="text-xs text-red-400">{error}</p>
                        )}
                    </div>

                    {/* Actions row — Manage Members on the left, Cancel + Save on the right */}
                    <div className="flex items-center justify-between gap-2">
                        {/* Bottom-left: Manage Members */}
                        {onManageMembers && (
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => {
                                    onClose()
                                    onManageMembers()
                                }}
                                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#27272A] bg-transparent px-3 text-xs font-medium text-[#94A3B8] transition-colors hover:border-[#3F3F46] hover:text-[#E2E8F0] disabled:pointer-events-none disabled:opacity-50"
                            >
                                <Users className="h-3.5 w-3.5 shrink-0" />
                                Manage Members
                            </button>
                        )}

                        {/* Bottom-right: Cancel + Save */}
                        <div className="flex items-center gap-2 ml-auto">
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={onClose}
                                className="inline-flex h-8 items-center rounded-md border border-[#27272A] bg-transparent px-3 text-xs font-medium text-[#A1A1AA] transition-colors hover:border-[#3F3F46] hover:text-[#E2E8F0] disabled:pointer-events-none disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="inline-flex h-8 items-center rounded-md border border-[#3F3F46] bg-[#27272A] px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#52525B] hover:bg-[#3F3F46] disabled:pointer-events-none disabled:opacity-40"
                            >
                                {isSaving ? "Saving…" : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
