"use client"

import { Paperclip, Tag, Plus, Upload, FileText } from "lucide-react"

export type IssueAttachment = {
  id: string
  name: string
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
  onAddLabel?: () => void
  onUploadFiles?: (files: FileList) => void
}

export default function IssueDetails({
  title,
  description,
  attachments = [],
  labels = [],
  onAddLabel,
  onUploadFiles,
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
                <span className="truncate">{file.name}</span>
              </li>
            ))}
          </ul>
        )}

        <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#27272A] bg-transparent px-4 py-6 text-center transition-colors hover:border-[#3F3F46]">
          <Upload className="h-4 w-4 text-[#71717A]" />
          <span className="text-xs font-medium text-[#D4D4D8]">
            Drag and drop files, or click to upload
          </span>
          <span className="text-[11px] text-[#52525B]">
            Supports: images, PDFs, logs (max 10MB)
          </span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) onUploadFiles?.(e.target.files)
            }}
          />
        </label>
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