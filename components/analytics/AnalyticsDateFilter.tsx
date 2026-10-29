"use client"

import type { DateRangeDays } from "@/hooks/use-analytics"

type AnalyticsDateFilterProps = {
  days: DateRangeDays
  onSelect: (days: DateRangeDays) => void
  disabled?: boolean
}

const RANGES: { label: string; value: DateRangeDays }[] = [
  { label: "7D", value: 7 },
  { label: "14D", value: 14 },
  { label: "30D", value: 30 },
  { label: "90D", value: 90 },
]

export function AnalyticsDateFilter({
  days,
  onSelect,
  disabled = false,
}: AnalyticsDateFilterProps) {
  return (
    <div
      className="inline-flex items-center rounded-md border border-[#27272A] bg-[#18181B] p-1"
      role="group"
      aria-label="Analytics date range filter"
    >
      {RANGES.map((range) => {
        const isSelected = days === range.value

        return (
          <button
            key={range.value}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(range.value)}
            className={[
              "rounded px-3 py-1 text-xs font-medium transition-colors",
              isSelected
                ? "bg-[#27272A] text-[#E2E8F0] shadow-xs"
                : "text-[#94A3B8] hover:text-[#E2E8F0]",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            ].join(" ")}
          >
            {range.label}
          </button>
        )
      })}
    </div>
  )
}
