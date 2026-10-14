"use client"

import { Lock, Tag } from "lucide-react"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Label } from "@/services/labels.service"

// ─── Types ────────────────────────────────────────────────────────────────────

export type CreateIssueMember = {
  /** The user's numeric/string ID — sent to the backend as assigned_to */
  id: string | number
  /** Display name shown in the dropdown */
  name: string
}

export type CreateIssuePayload = {
  title: string
  description: string
  /** undefined means Unassigned */
  assigned_to?: string | number
  /** Always "TODO" — fixed at creation time */
  status: "TODO"
  priority: "LOW" | "MEDIUM" | "HIGH"
  label_ids?: Array<string | number>
}

export type CreateIssueCardProps = {
  /** Project members to show in the Assignee dropdown */
  members: CreateIssueMember[]
  /** Called with the full payload when the user clicks Create issue */
  onSubmit: (payload: CreateIssuePayload) => void
  /** Called when the user clicks Cancel */
  onCancel: () => void
  /** Disables the form while the parent is saving */
  isSubmitting?: boolean
  /** Project labels available to assign after issue creation */
  labels?: Label[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

type Priority = "LOW" | "MEDIUM" | "HIGH"

const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
}

const PRIORITY_DOTS: Record<Priority, string> = {
  LOW: "bg-[#71717A]",
  MEDIUM: "bg-[#CA8A04]",
  HIGH: "bg-[#EF4444]",
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreateIssueCard({
  members,
  onSubmit,
  onCancel,
  isSubmitting = false,
  labels = [],
}: CreateIssueCardProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assigneeId, setAssigneeId] = useState<string>("unassigned")
  const [priority, setPriority] = useState<Priority>("LOW")
  const [selectedLabelIds, setSelectedLabelIds] = useState<Array<string | number>>([])

  const canSubmit =
    title.trim().length >= 8 &&
    description.trim().length >= 10 &&
    !isSubmitting

  function handleSubmit() {
    if (!canSubmit) return

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      assigned_to:
        assigneeId === "unassigned" ? undefined : assigneeId,
      status: "TODO",
      priority,
      label_ids: selectedLabelIds,
    })
  }

  return (
    <div className="w-full rounded-xl border border-[#27272A] bg-[#101012]">
      {/* ── Header ── */}
      <div className="border-b border-[#27272A] px-5 py-4">
        <p className="text-sm font-semibold text-[#E2E8F0]">Create issue</p>
        <p className="mt-0.5 text-xs text-[#94A3B8]">
          Fill in the details below to open a new issue.
        </p>
      </div>

      {/* ── Body ── */}
      <div className="space-y-5 px-5 py-5">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#94A3B8]">
            Title <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. Fix login bug"
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
            placeholder="Describe the issue…"
            style={{ height: "110px" }}
            className={[
              "w-full resize-none rounded-md border border-[#27272A] bg-[#18181B]",
              "px-3 py-2 text-sm text-[#E2E8F0] placeholder:text-[#52525B]",
              "outline-none transition-colors leading-relaxed",
              "focus:border-[#3F3F46]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            ].join(" ")}
          />
        </div>

        {/* ── Two-column row: Assignee + Priority ── */}
        <div className="grid grid-cols-2 gap-4">
          {/* Assignee */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#94A3B8]">
              Assignee
            </label>
            <Select
              value={assigneeId}
              onValueChange={(v) => setAssigneeId(v ?? "unassigned")}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-9 w-full border-[#27272A] bg-[#18181B] text-xs font-medium text-[#E2E8F0] hover:border-[#3F3F46] focus:ring-[#5E6AD2]/40">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent className="border-[#27272A] bg-[#18181B]">
                {members.map((m) => (
                  <SelectItem
                    key={m.id}
                    value={String(m.id)}
                    className="text-xs text-[#E2E8F0] focus:bg-[#27272A] focus:text-[#E2E8F0]"
                  >
                    {m.name}
                  </SelectItem>
                ))}
                <SelectItem
                  value="unassigned"
                  className="text-xs text-[#94A3B8] focus:bg-[#27272A] focus:text-[#E2E8F0]"
                >
                  Unassigned
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#94A3B8]">
              Priority
            </label>
            <Select
              value={priority}
              onValueChange={(v) => setPriority((v ?? "LOW") as Priority)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-9 w-full border-[#27272A] bg-[#18181B] text-xs font-medium text-[#E2E8F0] hover:border-[#3F3F46] focus:ring-[#5E6AD2]/40">
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOTS[priority]}`}
                  />
                  <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent className="border-[#27272A] bg-[#18181B]">
                {(Object.keys(PRIORITY_LABELS) as Priority[]).map((key) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className="text-xs text-[#E2E8F0] focus:bg-[#27272A] focus:text-[#E2E8F0]"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOTS[key]}`}
                      />
                      {PRIORITY_LABELS[key]}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8]">
            <Tag className="h-3.5 w-3.5" />
            Labels
          </label>
          {labels.length === 0 ? (
            <p className="rounded-md border border-dashed border-[#27272A] px-3 py-2 text-xs text-[#52525B]">
              No project labels available. Create labels in Project Settings.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 rounded-md border border-[#27272A] bg-[#18181B] p-3">
              {labels.map((label) => {
                const selected = selectedLabelIds.some((id) => String(id) === String(label.id))
                return (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => {
                      setSelectedLabelIds((current) =>
                        selected
                          ? current.filter((id) => String(id) !== String(label.id))
                          : [...current, label.id]
                      )
                    }}
                    disabled={isSubmitting}
                    className={[
                      "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                      selected
                        ? "border-[#5E6AD2] bg-[#5E6AD2]/15 text-[#E2E8F0]"
                        : "border-[#27272A] bg-transparent text-[#94A3B8] hover:border-[#3F3F46] hover:text-[#E2E8F0]",
                    ].join(" ")}
                  >
                    {label.color && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: label.color }} />}
                    {label.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Status — read-only, always TODO */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#94A3B8]">Status</label>
          <div
            className={[
              "flex h-9 w-full items-center justify-between rounded-md",
              "border border-[#27272A] bg-[#18181B] px-3",
              "cursor-not-allowed opacity-60",
            ].join(" ")}
          >
            <span className="flex items-center gap-2 text-xs font-medium text-[#E2E8F0]">
              <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#71717A]" />
              Todo
            </span>
            <Lock className="h-3 w-3 text-[#52525B]" />
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
          {isSubmitting ? "Creating…" : "Create issue"}
        </button>
      </div>
    </div>
  )
}