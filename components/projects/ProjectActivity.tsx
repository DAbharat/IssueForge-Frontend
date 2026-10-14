"use client"

import { Activity } from "lucide-react"

type ProjectActivityProps = {
  onViewIssues: () => void
}

export default function ProjectActivity({ onViewIssues }: ProjectActivityProps) {
  return (
    <section className="rounded-xl border border-dashed border-[#27272A] bg-[#101012] px-6 py-12 text-center">
      <Activity className="mx-auto h-5 w-5 text-[#71717A]" />
      <h2 className="mt-4 text-sm font-semibold text-[#E2E8F0]">Project activity is not available yet</h2>
      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#94A3B8]">
        This project currently has no project-level activity endpoint. Issue activity remains available from each issue.
      </p>
      <button
        type="button"
        onClick={onViewIssues}
        className="mt-5 inline-flex items-center justify-center rounded-md border border-[#27272A] bg-[#18181B] px-3 py-2 text-xs font-medium text-[#D4D4D8] transition-colors hover:border-[#3F3F46] hover:text-[#E2E8F0]"
      >
        View issues
      </button>
    </section>
  )
}
