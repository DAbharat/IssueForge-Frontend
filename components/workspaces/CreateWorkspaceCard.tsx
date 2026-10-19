"use client"

import { useState } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type CreateWorkspacePayload = {
    name: string
}

export type CreateWorkspaceCardProps = {
    /** Called with { name } when the user clicks Create */
    onSubmit: (payload: CreateWorkspacePayload) => void
    /** Called when the user clicks Cancel */
    onCancel: () => void
    /** Disables the form while saving */
    isSubmitting?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreateWorkspaceCard({
    onSubmit,
    onCancel,
    isSubmitting = false,
}: CreateWorkspaceCardProps) {
    const [name, setName] = useState("")

    const trimmedName = name.trim()
    const isLengthValid = trimmedName.length >= 3 && trimmedName.length <= 30
    const canSubmit = isLengthValid && !isSubmitting

    function handleSubmit(e?: React.FormEvent) {
        if (e) e.preventDefault()
        if (!canSubmit) return
        onSubmit({
            name: trimmedName,
        })
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
        if (e.key === "Escape") {
            onCancel()
        }
    }

    return (
        <div
            className="w-full max-w-xl rounded-xl border border-[#27272A] bg-[#101012]"
            onKeyDown={handleKeyDown}
        >
            {/* ── Header ── */}
            <div className="border-b border-[#27272A] px-5 py-4">
                <p className="text-sm font-semibold text-[#E2E8F0]">Create workspace</p>
                <p className="mt-0.5 text-xs text-[#94A3B8]">
                    Create a new workspace to organize your projects and collaborate with your team.
                </p>
            </div>

            {/* ── Body ── */}
            <form onSubmit={handleSubmit}>
                <div className="space-y-4 px-5 py-5">

                    {/* Workspace name */}
                    <div className="space-y-1.5">
                        <label htmlFor="workspace-name-input" className="text-xs font-medium text-[#94A3B8]">
                            Workspace name <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                            id="workspace-name-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isSubmitting}
                            placeholder="e.g. Design Team or Engineering"
                            autoFocus
                            maxLength={30}
                            className={[
                                "w-full rounded-md border border-[#27272A] bg-[#18181B]",
                                "px-3 py-2 text-sm text-[#E2E8F0] placeholder:text-[#52525B]",
                                "outline-none transition-colors",
                                "focus:border-[#3F3F46]",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                            ].join(" ")}
                        />
                        <div className="flex items-center justify-between text-[11px] text-[#71717A]">
                            <span>Must be between 3 and 30 characters.</span>
                            <span>{trimmedName.length}/30</span>
                        </div>
                    </div>
                </div>

                {/* ── Footer actions ── */}
                <div className="flex items-center justify-end gap-2 border-t border-[#27272A] px-5 py-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className={[
                            "inline-flex items-center justify-center rounded-md px-4 py-2",
                            "border border-[#27272A] bg-transparent text-xs font-medium text-[#94A3B8]",
                            "transition-colors hover:border-[#3F3F46] hover:text-[#E2E8F0]",
                            "disabled:opacity-40 disabled:cursor-not-allowed",
                        ].join(" ")}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className={[
                            "inline-flex items-center justify-center rounded-md px-4 py-2",
                            "border border-[#3F3F46] bg-[#27272A] text-xs font-medium text-[#E2E8F0]",
                            "transition-colors hover:bg-[#3F3F46] hover:text-white",
                            "disabled:opacity-40 disabled:cursor-not-allowed",
                        ].join(" ")}
                    >
                        {isSubmitting ? "Creating…" : "Create workspace"}
                    </button>
                </div>
            </form>
        </div>
    )
}
