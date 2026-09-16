"use client"

import { useState } from "react"
// ─── Types ────────────────────────────────────────────────────────────────────
export type CreateProjectPayload = {
    name: string
    description?: string
}
export type CreateProjectCardProps = {
    /** Called with { name, description } when the user clicks Create */
    onSubmit: (payload: CreateProjectPayload) => void
    /** Called when the user clicks Cancel */
    onCancel: () => void
    /** Disables the form while the parent is saving */
    isSubmitting?: boolean
}
// ─── Component ────────────────────────────────────────────────────────────────
export default function CreateProjectCard({
    onSubmit,
    onCancel,
    isSubmitting = false,
}: CreateProjectCardProps) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const canSubmit = name.trim().length > 0 && !isSubmitting
    function handleSubmit() {
        if (!canSubmit) return
        onSubmit({
            name: name.trim(),
            description: description.trim() || undefined,
        })
    }
    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
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
                <p className="text-sm font-semibold text-[#E2E8F0]">Create project</p>
                <p className="mt-0.5 text-xs text-[#94A3B8]">
                    Create a new project in this workspace.
                </p>
            </div>
            {/* ── Body ── */}
            <div className="space-y-5 px-5 py-5">
                {/* Project name */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#94A3B8]">
                        Project name <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="e.g. IssueForge Web"
                        autoFocus
                        className={[
                            "w-full rounded-md border border-[#27272A] bg-[#18181B]",
                            "px-3 py-2 text-sm text-[#E2E8F0] placeholder:text-[#52525B]",
                            "outline-none transition-colors",
                            "focus:border-[#3F3F46]",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                        ].join(" ")}
                    />
                </div>
                {/* Description */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#94A3B8]">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="Describe what this project is about…"
                        rows={4}
                        className={[
                            "w-full resize-none rounded-md border border-[#27272A] bg-[#18181B]",
                            "px-3 py-2 text-sm text-[#E2E8F0] placeholder:text-[#52525B]",
                            "outline-none transition-colors leading-relaxed",
                            "focus:border-[#3F3F46]",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                        ].join(" ")}
                    />
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
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={[
                        "inline-flex items-center justify-center rounded-md px-4 py-2",
                        "border border-[#3F3F46] bg-[#27272A] text-xs font-medium text-[#E2E8F0]",
                        "transition-colors hover:bg-[#3F3F46] hover:text-white",
                        "disabled:opacity-40 disabled:cursor-not-allowed",
                    ].join(" ")}
                >
                    {isSubmitting ? "Creating…" : "Create project"}
                </button>
            </div>
        </div>
    )
}