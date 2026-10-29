"use client"

import type { LucideIcon } from "lucide-react"

type AnalyticsMetricCardProps = {
  title: string
  value: string | number
  subtext?: string
  icon?: LucideIcon
  trend?: {
    label: string
    isPositive?: boolean
  }
}

export function AnalyticsMetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
}: AnalyticsMetricCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-[#27272A] bg-[#18181B] p-5 shadow-xs transition-colors hover:border-[#3F3F46]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
          {title}
        </span>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#27272A] bg-black/40 text-[#DDE1E5]">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-[#E2E8F0]">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {trend.label}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1 text-xs text-[#94A3B8]">{subtext}</p>
      )}
    </div>
  )
}
