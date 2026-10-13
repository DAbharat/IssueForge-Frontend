"use client"

import React, { useCallback, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Upload, X, Crop as CropIcon, Loader2 } from "lucide-react"
import ImageCropModal from "@/components/common/ImageCropModal"

// ─── Types ───────────────────────────────────────────────────────────────────

export type StagedImage = {
    /** Unique key for React lists */
    key: string
    /** Original File object */
    file: File
    /** Object URL for preview */
    previewUrl: string
    /** After cropping this becomes the blob to upload; null = use original file */
    croppedBlob: Blob | null
    /** Whether a crop has been applied */
    cropped: boolean
}

type ImageUploadWithCropProps = {
    /**
     * Called once per image after all crop decisions are made.
     * Receives the Blob to upload (cropped or original).
     * The parent is responsible for calling createAttachment / the service.
     */
    onUpload: (images: Array<{ file: File; blob: Blob }>) => Promise<void>
    /** Optional: currently uploading state driven by the parent */
    isUploading?: boolean
    /** Max simultaneous images allowed (default: 10) */
    maxImages?: number
    /** Accept string for the file input (default: image/*) */
    accept?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid() {
    return Math.random().toString(36).slice(2)
}

async function fileToBlob(file: File): Promise<Blob> {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
            const ab = reader.result as ArrayBuffer
            resolve(new Blob([ab], { type: file.type }))
        }
        reader.readAsArrayBuffer(file)
    })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ImageUploadWithCrop({
    onUpload,
    isUploading = false,
    maxImages = 10,
    accept = "image/*",
}: ImageUploadWithCropProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    // All staged images the user has selected
    const [staged, setStaged] = useState<StagedImage[]>([])

    // Which index is currently shown in the carousel preview
    const [activeIdx, setActiveIdx] = useState(0)

    // Which image is being cropped (index into staged[]), or null
    const [cropIdx, setCropIdx] = useState<number | null>(null)

    // Drag-over visual
    const [isDragOver, setIsDragOver] = useState(false)

    // ── Add images ────────────────────────────────────────────────────────────

    function addFiles(files: FileList | File[]) {
        const arr = Array.from(files).filter((f) => f.type.startsWith("image/"))
        const remaining = maxImages - staged.length
        const toAdd = arr.slice(0, remaining)

        const newStaged: StagedImage[] = toAdd.map((file) => ({
            key: uid(),
            file,
            previewUrl: URL.createObjectURL(file),
            croppedBlob: null,
            cropped: false,
        }))

        setStaged((prev) => {
            const next = [...prev, ...newStaged]
            setActiveIdx(next.length - 1)
            return next
        })

        // Open crop modal for the first newly added image
        if (newStaged.length > 0) {
            const firstNewIdx = staged.length
            setCropIdx(firstNewIdx)
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) addFiles(e.target.files)
        e.target.value = ""
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        setIsDragOver(false)
        if (e.dataTransfer.files) addFiles(e.dataTransfer.files)
    }

    // ── Remove image ──────────────────────────────────────────────────────────

    function removeImage(idx: number) {
        setStaged((prev) => {
            const next = [...prev]
            URL.revokeObjectURL(next[idx].previewUrl)
            next.splice(idx, 1)
            setActiveIdx((cur) => Math.min(cur, next.length - 1))
            return next
        })
    }

    // ── Crop callbacks ────────────────────────────────────────────────────────

    function handleCropComplete(blob: Blob | null) {
        if (cropIdx === null) return

        setStaged((prev) => {
            const next = [...prev]
            next[cropIdx] = {
                ...next[cropIdx],
                croppedBlob: blob,
                cropped: blob !== null,
            }
            return next
        })

        // Advance to next un-cropped image if there is one
        const nextIdx = staged.findIndex(
            (_, i) => i > cropIdx && !staged[i].cropped
        )
        if (nextIdx !== -1) {
            setCropIdx(nextIdx)
        } else {
            setCropIdx(null)
        }
    }

    // ── Upload ────────────────────────────────────────────────────────────────

    async function handleUpload() {
        const images: Array<{ file: File; blob: Blob }> = await Promise.all(
            staged.map(async (s) => {
                const blob = s.croppedBlob ?? (await fileToBlob(s.file))
                return { file: s.file, blob }
            })
        )
        await onUpload(images)
        // Clean up object URLs
        staged.forEach((s) => URL.revokeObjectURL(s.previewUrl))
        setStaged([])
        setActiveIdx(0)
    }

    // ── Carousel navigation ───────────────────────────────────────────────────

    const canGoPrev = activeIdx > 0
    const canGoNext = activeIdx < staged.length - 1

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="space-y-3">
            {/* ── Staged images: carousel preview ── */}
            {staged.length > 0 && (
                <div className="relative overflow-hidden rounded-xl border border-[#27272A] bg-[#09090B]">
                    {/* Image + nav */}
                    <div className="relative flex h-52 items-center justify-center overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={staged[activeIdx]?.previewUrl}
                            alt={`Preview ${activeIdx + 1}`}
                            className="h-full w-full object-contain"
                        />

                        {/* Counter badge */}
                        {staged.length > 1 && (
                            <span className="absolute right-3 top-3 rounded bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                                {activeIdx + 1}/{staged.length}
                            </span>
                        )}

                        {/* Cropped indicator */}
                        {staged[activeIdx]?.cropped && (
                            <span className="absolute left-3 top-3 flex items-center gap-1 rounded bg-[#18181B]/80 px-2 py-0.5 text-[10px] font-medium text-[#94A3B8] backdrop-blur-sm">
                                <CropIcon className="h-3 w-3" />
                                Cropped
                            </span>
                        )}

                        {/* Prev / Next arrows */}
                        {canGoPrev && (
                            <button
                                type="button"
                                onClick={() => setActiveIdx((i) => i - 1)}
                                className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                        )}
                        {canGoNext && (
                            <button
                                type="button"
                                onClick={() => setActiveIdx((i) => i + 1)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Thumbnails strip */}
                    {staged.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto border-t border-[#27272A] p-2">
                            {staged.map((s, i) => (
                                <button
                                    key={s.key}
                                    type="button"
                                    onClick={() => setActiveIdx(i)}
                                    className={[
                                        "relative h-14 w-14 shrink-0 overflow-hidden rounded-md border transition-colors",
                                        i === activeIdx
                                            ? "border-[#E2E8F0]"
                                            : "border-[#27272A] hover:border-[#3F3F46]",
                                    ].join(" ")}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={s.previewUrl}
                                        alt={`Thumb ${i + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                    {s.cropped && (
                                        <span className="absolute bottom-0.5 right-0.5 rounded bg-black/60 p-0.5">
                                            <CropIcon className="h-2.5 w-2.5 text-white" />
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Per-image action bar */}
                    <div className="flex items-center justify-between border-t border-[#27272A] px-3 py-2">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveIdx(activeIdx)
                                    setCropIdx(activeIdx)
                                }}
                                className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[#27272A] bg-transparent px-2.5 text-[11px] text-[#94A3B8] transition-colors hover:bg-[#18181B] hover:text-[#E2E8F0]"
                            >
                                <CropIcon className="h-3 w-3" />
                                {staged[activeIdx]?.cropped ? "Re-crop" : "Crop"}
                            </button>

                            <button
                                type="button"
                                onClick={() => removeImage(activeIdx)}
                                className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[#27272A] bg-transparent px-2.5 text-[11px] text-[#94A3B8] transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                            >
                                <X className="h-3 w-3" />
                                Remove
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[#3F3F46] bg-[#18181B] px-3 text-[11px] font-medium text-[#E2E8F0] transition-colors hover:bg-[#27272A] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Uploading…
                                </>
                            ) : (
                                <>
                                    <Upload className="h-3 w-3" />
                                    Upload {staged.length > 1 ? `${staged.length} images` : "image"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Drop zone ── */}
            {staged.length < maxImages && (
                <label
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    className={[
                        "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-4 py-6 text-center transition-colors",
                        isDragOver
                            ? "border-[#3F3F46] bg-[#18181B]"
                            : "border-[#27272A] bg-transparent hover:border-[#3F3F46]",
                    ].join(" ")}
                >
                    <Upload className="h-4 w-4 text-[#71717A]" />
                    <span className="text-xs font-medium text-[#D4D4D8]">
                        {staged.length > 0 ? "Add more images" : "Drag and drop files, or click to upload"}
                    </span>
                    <span className="text-[11px] text-[#52525B]">
                        Images only · max 10MB each
                        {maxImages > 1 && ` · up to ${maxImages}`}
                    </span>
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept={accept}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            )}

            {/* ── Crop modal ── */}
            {cropIdx !== null && staged[cropIdx] && (
                <ImageCropModal
                    src={staged[cropIdx].previewUrl}
                    filename={staged[cropIdx].file.name}
                    index={cropIdx}
                    total={staged.length}
                    onCropComplete={handleCropComplete}
                    onClose={() => setCropIdx(null)}
                />
            )}
        </div>
    )
}
