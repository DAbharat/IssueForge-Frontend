"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { AlertTriangle, Plus, Save, Trash2 } from "lucide-react"
import type { Project } from "@/services/projects.service"
import type { Label } from "@/services/labels.service"
import type { ProjectMemberItem } from "@/components/projects/ProjectMembers"
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

type ProjectSettingsProps = {
  project: Project
  members: ProjectMemberItem[]
  isLead: boolean
  isSaving: boolean
  isDeleting: boolean
  labels: Label[]
  isUpdatingLabels: boolean
  onSaveDetails: (details: { name: string; description: string }) => Promise<void>
  onSaveLead: (leadId: string) => Promise<void>
  onDeleteProject: () => Promise<void>
  onCreateLabel: (name: string, color: string) => Promise<void>
  onDeleteLabel: (labelId: string | number) => Promise<void>
}

export default function ProjectSettings({
  project,
  members,
  isLead,
  isSaving,
  isDeleting,
  labels,
  isUpdatingLabels,
  onSaveDetails,
  onSaveLead,
  onDeleteProject,
  onCreateLabel,
  onDeleteLabel,
}: ProjectSettingsProps) {
  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description ?? "")
  const [leadId, setLeadId] = useState(project.lead_id ? String(project.lead_id) : "")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [labelName, setLabelName] = useState("")
  const [labelColor, setLabelColor] = useState("#5E6AD2")
  const [pendingLabelId, setPendingLabelId] = useState<string | number | null>(null)

  async function handleDetailsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return
    await onSaveDetails({ name: name.trim(), description: description.trim() })
  }

  async function handleLeadChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLeadId = event.target.value
    setLeadId(nextLeadId)
    if (nextLeadId) await onSaveLead(nextLeadId)
  }

  async function handleCreateLabel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (labelName.trim().length < 3) return

    await onCreateLabel(labelName.trim(), labelColor)
    setLabelName("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-[#E2E8F0]">Project settings</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">Manage the project details and ownership.</p>
      </div>

      <form
        onSubmit={handleDetailsSubmit}
        className="rounded-xl border border-[#27272A] bg-[#101012] p-5"
      >
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="project-name" className="text-xs font-medium text-[#94A3B8]">
              Project name
            </label>
            <input
              id="project-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={!isLead || isSaving}
              className="w-full rounded-md border border-[#27272A] bg-[#18181B] px-3 py-2 text-sm text-[#E2E8F0] outline-none transition-colors placeholder:text-[#52525B] focus:border-[#3F3F46] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="project-description" className="text-xs font-medium text-[#94A3B8]">
              Description
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={!isLead || isSaving}
              className="min-h-28 w-full resize-y rounded-md border border-[#27272A] bg-[#18181B] px-3 py-2 text-sm leading-6 text-[#E2E8F0] outline-none transition-colors placeholder:text-[#52525B] focus:border-[#3F3F46] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#27272A] pt-4">
          <p className="text-xs text-[#71717A]">
            {isLead ? "Only project leads can edit these settings." : "Only the project lead can edit settings."}
          </p>
          <button
            type="submit"
            disabled={!isLead || isSaving || !name.trim()}
            className="inline-flex items-center gap-2 rounded-md border border-[#3F3F46] bg-[#27272A] px-3 py-2 text-xs font-medium text-[#E2E8F0] transition-colors hover:bg-[#3F3F46] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      <section className="rounded-xl border border-[#27272A] bg-[#101012] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#E2E8F0]">Project lead</h3>
            <p className="mt-1 text-xs text-[#94A3B8]">Choose who owns project-level administration.</p>
          </div>
          <select
            value={leadId}
            onChange={handleLeadChange}
            disabled={!isLead || isSaving || members.length === 0}
            className="h-9 min-w-52 rounded-md border border-[#27272A] bg-[#18181B] px-3 text-xs text-[#E2E8F0] outline-none focus:border-[#3F3F46] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a member</option>
            {members.map((member) => (
              <option key={member.id} value={String(member.id)}>
                {member.fullname}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="rounded-xl border border-[#27272A] bg-[#101012] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#E2E8F0]">Project labels</h3>
            <p className="mt-1 text-xs text-[#94A3B8]">Create labels that can be assigned to issues.</p>
          </div>
          <span className="text-xs tabular-nums text-[#71717A]">{labels.length}</span>
        </div>

        <form onSubmit={handleCreateLabel} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={labelName}
            onChange={(event) => setLabelName(event.target.value)}
            disabled={!isLead || isUpdatingLabels}
            placeholder="Label name"
            maxLength={20}
            className="min-w-0 flex-1 rounded-md border border-[#27272A] bg-[#18181B] px-3 py-2 text-xs text-[#E2E8F0] outline-none placeholder:text-[#52525B] focus:border-[#3F3F46] disabled:cursor-not-allowed disabled:opacity-50"
          />
          <label className="flex h-9 items-center gap-2 rounded-md border border-[#27272A] bg-[#18181B] px-2 text-xs text-[#94A3B8]">
            <span className="sr-only">Label color</span>
            <input
              type="color"
              value={labelColor}
              onChange={(event) => setLabelColor(event.target.value)}
              disabled={!isLead || isUpdatingLabels}
              className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent disabled:cursor-not-allowed"
            />
            Color
          </label>
          <button
            type="submit"
            disabled={!isLead || isUpdatingLabels || labelName.trim().length < 3}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-[#3F3F46] bg-[#27272A] px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:bg-[#3F3F46] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add label
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {labels.map((label) => (
            <span key={label.id} className="inline-flex items-center gap-1.5 rounded-md border border-[#27272A] bg-[#18181B] px-2.5 py-1 text-xs text-[#D4D4D8]">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: label.color }} />
              {label.name}
              {isLead && (
                <button
                  type="button"
                  aria-label={`Delete ${label.name} label`}
                  disabled={isUpdatingLabels}
                  onClick={() => setPendingLabelId(label.id)}
                  className="rounded-sm text-[#71717A] hover:text-[#E2E8F0] disabled:opacity-40"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-red-500/20 bg-[#101012] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <div>
              <h3 className="text-sm font-semibold text-[#E2E8F0]">Delete project</h3>
              <p className="mt-1 text-xs leading-5 text-[#94A3B8]">
                Remove this project and its data. This action requires project lead access.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={!isLead || isDeleting}
            className="shrink-0 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isDeleting ? "Deleting…" : "Delete project"}
          </button>
        </div>
      </section>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="border border-[#27272A] bg-[#0E0E11] text-[#E2E8F0] shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#E2E8F0]">Delete project?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#94A3B8]">
              This will remove {project.name} and its project data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t border-[#27272A] bg-[#09090B]">
            <AlertDialogCancel
              disabled={isDeleting}
              className="border border-[#27272A] bg-transparent text-[#94A3B8] hover:bg-[#18181B] hover:text-[#E2E8F0]"
            >
              Keep project
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={onDeleteProject}
              className="border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
            >
              {isDeleting ? "Deleting…" : "Yes, delete project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={pendingLabelId !== null}
        onOpenChange={(open) => {
          if (!open && !isUpdatingLabels) setPendingLabelId(null)
        }}
      >
        <AlertDialogContent className="border border-[#27272A] bg-[#0E0E11] text-[#E2E8F0] shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#E2E8F0]">Delete label?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#94A3B8]">
              Issues using this label will no longer have it assigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t border-[#27272A] bg-[#09090B]">
            <AlertDialogCancel
              disabled={isUpdatingLabels}
              className="border border-[#27272A] bg-transparent text-[#94A3B8] hover:bg-[#18181B] hover:text-[#E2E8F0]"
            >
              Keep label
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isUpdatingLabels}
              onClick={async () => {
                if (pendingLabelId === null) return
                await onDeleteLabel(pendingLabelId)
                setPendingLabelId(null)
              }}
              className="border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
            >
              {isUpdatingLabels ? "Deleting…" : "Yes, delete label"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
