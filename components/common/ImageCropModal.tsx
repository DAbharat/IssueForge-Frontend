"use client"

import React, { useCallback, useRef, useState } from "react"
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { X, CropIcon, SkipForward } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type ImageCropModalProps = {
    /** Object URL of the image to crop */
    src: string
    /** Original filename to preserve in the output Blob */
    filename: string
    /** Current image index (0-based) */
    index: number
    /** Total number of images queued */
    total: number
    /** Called with the cropped Blob, or null if user skips crop */
    onCropComplete: (blob: Blob | null) => void
    /** Called when user closes/cancels the whole modal */
    onClose: () => void
}

// ─── Helper: produce a cropped Blob from canvas ───────────────────────────────

async function getCroppedBlob(
    image: HTMLImageElement,
    crop: Crop,
    filename: string
): Promise<Blob | null> {
    const canvas = document.createElement("canvas")
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = Math.floor(crop.width * scaleX)
    canvas.height = Math.floor(crop.height * scaleY)

    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
    )

    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92)
    })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ImageCropModal({
    src,
    filename,
    index,
    total,
    onCropComplete,
    onClose,
}: ImageCropModalProps) {
    const imgRef = useRef<HTMLImageElement>(null)
    const [crop, setCrop] = useState<Crop>()
    const [isCropping, setIsCropping] = useState(false)

    // Set a reasonable default crop once the image loads
    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget
        const initial = centerCrop(
            makeAspectCrop({ unit: "%", width: 80 }, 4 / 3, width, height),
            width,
            height
        )
        setCrop(initial)
    }, [])

    async function handleApplyCrop() {
        if (!imgRef.current || !crop || crop.width === 0 || crop.height === 0) {
            // No selection — pass through original
            onCropComplete(null)
            return
        }
        setIsCropping(true)
        try {
            const blob = await getCroppedBlob(imgRef.current, crop, filename)
            onCropComplete(blob)
        } finally {
            setIsCropping(false)
        }
    }

    function handleSkip() {
        onCropComplete(null)
    }

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className="relative flex w-full max-w-2xl flex-col gap-0 rounded-xl border border-[#27272A] bg-[#0E0E11] shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#27272A] px-5 py-3">
                    <div className="flex items-center gap-2">
                        <CropIcon className="h-4 w-4 text-[#71717A]" />
                        <span className="text-sm font-medium text-[#E2E8F0]">
                            Crop image
                        </span>
                        {total > 1 && (
                            <span className="rounded bg-[#27272A] px-2 py-0.5 text-[11px] font-medium text-[#94A3B8]">
                                {index + 1} / {total}
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#71717A] transition-colors hover:bg-[#18181B] hover:text-[#E2E8F0]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Crop area */}
                <div className="flex max-h-[60vh] items-center justify-center overflow-auto bg-[#09090B] p-4">
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        minWidth={20}
                        minHeight={20}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            ref={imgRef}
                            src={src}
                            alt="Crop preview"
                            onLoad={onImageLoad}
                            style={{ maxHeight: "55vh", maxWidth: "100%", objectFit: "contain" }}
                        />
                    </ReactCrop>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[#27272A] bg-[#09090B] px-5 py-3">
                    <p className="text-[11px] text-[#52525B]">
                        Drag to select the area you want to keep.
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleSkip}
                            disabled={isCropping}
                            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#27272A] bg-transparent px-3 text-xs text-[#94A3B8] transition-colors hover:bg-[#18181B] hover:text-[#E2E8F0] disabled:opacity-50"
                        >
                            <SkipForward className="h-3.5 w-3.5" />
                            Use original
                        </button>
                        <button
                            type="button"
                            onClick={handleApplyCrop}
                            disabled={isCropping}
                            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#3F3F46] bg-[#18181B] px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:bg-[#27272A] disabled:opacity-50"
                        >
                            <CropIcon className="h-3.5 w-3.5" />
                            {isCropping ? "Cropping…" : "Apply crop"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
