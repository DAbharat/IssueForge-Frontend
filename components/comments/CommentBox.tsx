"use client"

import { ImageIcon } from "lucide-react"
import { useRef } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

export type CommentBoxProps = {
    /** Current value of the textarea */
    value: string
    /** Called whenever the user types */
    onChange: (value: string) => void
    /** Called when the user picks an image file */
    onImageSelect: (file: File) => void
    /** Called when the user clicks Submit */
    onSubmit: () => void
    /** Disables both the textarea and the submit button */
    disabled?: boolean
    /** Shows a loading/submitting state on the submit button */
    isSubmitting?: boolean
    placeholder?: string
    selectedFileName?: string | null
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CommentBox({
    value,
    onChange,
    onImageSelect,
    onSubmit,
    disabled = false,
    isSubmitting = false,
    placeholder = "Write a comment",
    selectedFileName = null,
}: CommentBoxProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            onImageSelect(file)
            // Reset so the same file can be re-selected if needed
            e.target.value = ""
        }
    }

    return (
        <div
            className={[
                "flex flex-col rounded-lg border border-white/10 bg-white/5 transition-colors",
                "focus-within:border-white/20",
                disabled ? "opacity-50 pointer-events-none" : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {/* ── Writing area ── */}
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder={placeholder}
                rows={4}
                className={[
                    "w-full resize-none rounded-t-lg bg-transparent px-4 py-3",
                    "text-sm text-[#E2E8F0] placeholder:text-[#94A3B8]/50",
                    "outline-none",
                    "leading-relaxed",
                ].join(" ")}
            />

            {/* ── Action bar ── */}
            <div className="flex items-center justify-between border-t border-white/10 px-3 py-2">
                {/* Image upload */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    aria-label="Upload image"
                    className={[
                        "inline-flex items-center gap-1.5 rounded-md px-2 py-1.5",
                        "text-xs text-[#94A3B8] transition-colors",
                        "hover:bg-white/6 hover:text-[#E2E8F0]",
                    ].join(" ")}
                >
                    <ImageIcon className="h-4 w-4" />
                    <span>Upload image</span>
                </button>
                {selectedFileName && (
                    <span className="ml-2 max-w-48 truncate text-[11px] text-[#71717A]">
                        {selectedFileName}
                    </span>
                )}

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    aria-hidden="true"
                    tabIndex={-1}
                />

                {/* Submit */}
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={disabled || isSubmitting || value.trim() === ""}
                    className={[
                        "inline-flex items-center justify-center rounded-md",
                        "border border-zinc-700 bg-zinc-800 px-3 py-1.5",
                        "text-xs font-medium text-[#E2E8F0]",
                        "transition-colors",
                        "hover:bg-zinc-700 hover:text-white",
                        "disabled:opacity-40 disabled:cursor-not-allowed",
                    ].join(" ")}
                >
                    {isSubmitting ? "Submitting…" : "Submit"}
                </button>
            </div>
        </div>
    )
}