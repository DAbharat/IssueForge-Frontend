"use client"

import { Paperclip, Tag, Plus, FileText } from "lucide-react"
import ImageUploadWithCrop from "@/components/common/ImageUploadWithCrop"

export type IssueAttachment = {
  id: string
  name: string
  url?: string
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
  onAddLabel?: () => void
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
  onAddLabel,
  onUploadImages,
}: IssueDetailsProps) {
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
          <ul className="mt-3 space-y-2">
            {attachments.map((file) => (
              <li
                key={file.id}
                className="flex items-center gap-2 rounded-lg border border-[#27272A] bg-[#18181B] px-3 py-2 text-xs text-[#D4D4D8]"
              >
                <Paperclip className="h-3.5 w-3.5 shrink-0 text-[#71717A]" />
                {file.url ? (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:underline"
                  >
                    {file.name}
                  </a>
                ) : (
                  <span className="truncate">{file.name}</span>
                )}
              </li>
            ))}
          </ul>
        )}

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