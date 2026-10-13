"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Paperclip,
  Plus,
  Tag,
  Trash2,
} from "lucide-react"
import ImageUploadWithCrop from "@/components/common/ImageUploadWithCrop"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type IssueAttachment = {
  id: string
  name: string
  url?: string
  previewUrl?: string
}

export type IssueLabel = {
  id: string
  name: string
}

export type IssueDetailsProps = {
  title: string
  description?: string
  attachments?: IssueAttachment[]
  labels?: IssueLabel[]
  isUploadingAttachment?: boolean
  deletingAttachmentId?: string | null
  onAddLabel?: () => void
  onDeleteAttachment?: (attachmentId: string) => Promise<void>
  /**
   * Called with each image blob to upload.
   * The parent page calls createAttachment per image.
   */
  onUploadImages?: (images: Array<{ file: File; blob: Blob }>) => Promise<void>
}

export default function IssueDetails({
  title,
  description,
  attachments = [],
  labels = [],
  isUploadingAttachment = false,
  deletingAttachmentId = null,
  onAddLabel,
  onDeleteAttachment,
  onUploadImages,
}: IssueDetailsProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [activeAttachmentIndex, setActiveAttachmentIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null)

  const pendingAttachment = attachments.find((file) => file.id === pendingDeleteId)
  const safeActiveAttachmentIndex =
    attachments.length === 0 ? 0 : Math.min(activeAttachmentIndex, attachments.length - 1)
  const activeAttachment = attachments[safeActiveAttachmentIndex]

  function showPreviousAttachment() {
    setSlideDirection("right")
    setActiveAttachmentIndex((current) => {
      const safeIndex = attachments.length === 0 ? 0 : Math.min(current, attachments.length - 1)
      return safeIndex === 0 ? attachments.length - 1 : safeIndex - 1
    }
    )
  }

  function showNextAttachment() {
    setSlideDirection("left")
    setActiveAttachmentIndex((current) => {
      const safeIndex = attachments.length === 0 ? 0 : Math.min(current, attachments.length - 1)
      return safeIndex === attachments.length - 1 ? 0 : safeIndex + 1
    }
    )
  }

  function handleTouchEnd(clientX: number) {
    if (touchStartX === null) return

    const distance = clientX - touchStartX
    if (Math.abs(distance) > 40) {
      if (distance > 0) showPreviousAttachment()
      else showNextAttachment()
    }
    setTouchStartX(null)
  }

  return (
    <div className="w-full">
      {/* Description */}
      <section>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#71717A]" />
          <h2 className="text-sm font-semibold text-[#E2E8F0]">
            Description
          </h2>
        </div>

        <div className="mt-3">
          {description ? (
            <p className="whitespace-pre-wrap text-sm leading-6 text-[#A1A1AA]">
              {description}
            </p>
          ) : (
            <p className="text-sm text-[#52525B]">
              No description provided.
            </p>
          )}
        </div>
      </section>

      <div className="my-6 border-t border-[#27272A]" />

      {/* Attachments */}
      <section>
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-[#71717A]" />
          <h2 className="text-sm font-semibold text-[#E2E8F0]">
            Attachments
          </h2>
        </div>

        {attachments.length === 0 ? (
          <p className="mt-2 text-xs text-[#52525B]">No attachments yet</p>
        ) : (
          activeAttachment ? (
            <div
              className="group relative mt-3 overflow-hidden rounded-lg border border-[#27272A] bg-[#18181B]"
              onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
              onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
            >
              {activeAttachment.previewUrl || activeAttachment.url ? (
                <div
                  key={activeAttachment.id}
                  className={`relative ${slideDirection === "left"
                    ? "attachment-slide-in-right"
                    : slideDirection === "right"
                      ? "attachment-slide-in-left"
                      : ""
                    }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeAttachment.previewUrl ?? activeAttachment.url}
                    alt="Attachment preview"
                    className="block max-h-[28rem] min-h-48 w-full object-contain"
                  />

                  {attachments.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous attachment"
                        onClick={showPreviousAttachment}
                        className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/30 bg-black/65 text-white/85 shadow-lg backdrop-blur-sm transition-colors hover:bg-black/85 hover:text-white"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next attachment"
                        onClick={showNextAttachment}
                        className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/30 bg-black/65 text-white/85 shadow-lg backdrop-blur-sm transition-colors hover:bg-black/85 hover:text-white"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md bg-black/65 px-2 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                        {safeActiveAttachmentIndex + 1} / {attachments.length}
                      </span>
                    </>
                  )}

                  {onDeleteAttachment && (
                    <button
                      type="button"
                      aria-label="Delete attachment"
                      title="Delete attachment"
                      disabled={deletingAttachmentId === activeAttachment.id}
                      onClick={() => setPendingDeleteId(activeAttachment.id)}
                      className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-black/30 bg-black/65 text-white/80 opacity-0 shadow-lg backdrop-blur-sm transition-opacity hover:bg-red-500/85 hover:text-white focus-visible:opacity-100 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingAttachmentId === activeAttachment.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex min-h-48 items-center justify-center">
                  <Paperclip className="h-5 w-5 text-[#71717A]" />
                </div>
              )}
            </div>
          ) : null
        )}

        <AlertDialog
          open={pendingDeleteId !== null}
          onOpenChange={(open) => {
            if (!open && deletingAttachmentId === null) setPendingDeleteId(null)
          }}
        >
          <AlertDialogContent className="border border-[#27272A] bg-[#0E0E11] text-[#E2E8F0] shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#E2E8F0]">
                Delete attachment?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#94A3B8]">
                This image will be removed from the issue. This action cannot be undone.
                {pendingAttachment?.name && (
                  <span className="mt-2 block truncate font-medium text-[#E2E8F0]">
                    {pendingAttachment.name}
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="border-t border-[#27272A] bg-[#09090B]">
              <AlertDialogCancel
                className="border border-[#27272A] bg-transparent text-[#94A3B8] hover:bg-[#18181B] hover:text-[#E2E8F0]"
                disabled={deletingAttachmentId !== null}
              >
                Keep image
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingAttachmentId !== null}
                onClick={async () => {
                  if (pendingDeleteId && onDeleteAttachment) {
                    await onDeleteAttachment(pendingDeleteId)
                    setPendingDeleteId(null)
                  }
                }}
                className="border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
              >
                {deletingAttachmentId !== null ? "Deleting…" : "Yes, delete image"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="mt-3">
          <ImageUploadWithCrop
            onUpload={onUploadImages ?? (async () => {})}
            isUploading={isUploadingAttachment}
          />
        </div>
      </section>

      <div className="my-6 border-t border-[#27272A]" />

      {/* Labels */}
      <section>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-[#71717A]" />
            <h2 className="text-sm font-semibold text-[#E2E8F0]">Labels</h2>
          </div>

          <button
            type="button"
            onClick={onAddLabel}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#27272A] bg-[#18181B] px-3 py-1.5 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add label
          </button>
        </div>

        {labels.length === 0 ? (
          <p className="mt-2 text-xs text-[#52525B]">No labels yet</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {labels.map((label) => (
              <span
                key={label.id}
                className="inline-flex items-center rounded-md border border-[#27272A] bg-[#18181B] px-2.5 py-1 text-xs font-medium text-[#D4D4D8]"
              >
                {label.name}
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}