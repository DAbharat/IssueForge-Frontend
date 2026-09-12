"use client"

import { CalendarDays, Clock3 } from "lucide-react"

export type IssueDateProps = {
  createdAt: string
  updatedAt: string
}

export default function IssueDate({
  createdAt,
  updatedAt,
}: IssueDateProps) {
  return (
    <div className="w-full rounded-xl border border-[#27272A] bg-[#101012] p-4">
      {/* Header */}
      <h3 className="mb-4 text-sm font-semibold text-[#E2E8F0]">
        Dates
      </h3>

      {/* Dates */}
      <div className="space-y-4">
        {/* Created */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#27272A] bg-[#18181B] text-[#94A3B8]">
            <CalendarDays className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#71717A]">
              Created
            </p>

            <p className="mt-0.5 text-xs font-medium text-[#E2E8F0]">
              {createdAt}
            </p>
          </div>
        </div>

        {/* Updated */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#27272A] bg-[#18181B] text-[#94A3B8]">
            <Clock3 className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#71717A]">
              Updated
            </p>

            <p className="mt-0.5 text-xs font-medium text-[#E2E8F0]">
              {updatedAt}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}