"use client"

import { useState } from "react"
import type { IssueVelocityStat } from "@/services/analytics.service"

type IssueVelocityChartProps = {
  data: IssueVelocityStat[]
}

function formatDate(dateStr: string): string {
  try {
    if (!dateStr) return ""
    const parts = dateStr.split("-")
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      const d = new Date(year, month, day)
      return isNaN(d.getTime())
        ? dateStr
        : d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
    const d = new Date(dateStr)
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  } catch {
    return dateStr || ""
  }
}

export function IssueVelocityChart({ data }: IssueVelocityChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const items = Array.isArray(data) ? data : []
  const createdCounts = items.map((d) => {
    const raw = Number(d.issues_created ?? d.created_count ?? 0)
    return Number.isFinite(raw) ? raw : 0
  })
  const resolvedCounts = items.map((d) => {
    const raw = Number(d.issues_completed ?? d.resolved_count ?? 0)
    return Number.isFinite(raw) ? raw : 0
  })

  const totalCreated = createdCounts.reduce((sum, c) => sum + c, 0)
  const totalResolved = resolvedCounts.reduce((sum, c) => sum + c, 0)
  const netVelocity = totalResolved - totalCreated

  const maxVal = Math.max(
    ...createdCounts,
    ...resolvedCounts,
    0,
  )
  const chartMax = maxVal === 0 ? 8 : Math.ceil(maxVal * 1.25)

  // Chart coordinates
  const width = 600
  const height = 180
  const paddingLeft = 36
  const paddingRight = 16
  const paddingTop = 20
  const paddingBottom = 30

  const plotWidth = Math.max(width - paddingLeft - paddingRight, 10)
  const plotHeight = Math.max(height - paddingTop - paddingBottom, 10)

  const step = items.length > 1 ? plotWidth / (items.length - 1) : plotWidth
  const barWidth = Math.max(
    Math.min(items.length > 0 ? (plotWidth / items.length) * 0.35 : 8, 14),
    3,
  )

  const getY = (val: number) => {
    const num = Number(val) || 0
    const safeMax = chartMax > 0 ? chartMax : 8
    const computed = paddingTop + plotHeight - (num / safeMax) * plotHeight
    return Number.isFinite(computed) ? computed : paddingTop + plotHeight
  }

  const labelInterval = Math.max(1, Math.ceil(items.length / 6))

  return (
    <div className="rounded-lg border border-[#27272A] bg-[#18181B] p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#27272A] pb-4">
        <div>
          <h3 className="text-sm font-medium text-[#E2E8F0]">Issue Velocity</h3>
          <p className="mt-0.5 text-xs text-[#94A3B8]">
            Comparison of newly opened vs closed/resolved issues
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[#94A3B8]">
              Created: <strong className="text-[#E2E8F0]">{totalCreated}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <span className="text-[#94A3B8]">
              Resolved: <strong className="text-[#E2E8F0]">{totalResolved}</strong>
            </span>
          </div>

          <div
            className={`rounded px-2 py-0.5 font-medium ${
              netVelocity >= 0
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            Net: {netVelocity >= 0 ? `+${netVelocity}` : String(netVelocity)}
          </div>
        </div>
      </div>

      {items.length === 0 || (totalCreated === 0 && totalResolved === 0) ? (
        <div className="flex h-52 flex-col items-center justify-center text-center">
          <p className="text-sm text-[#94A3B8]">No issue velocity data for this period</p>
          <span className="mt-1 text-xs text-zinc-500">
            Issues created and marked closed or resolved will show up here.
          </span>
        </div>
      ) : (
        <div className="relative mt-4">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full overflow-visible"
            aria-label="Issue velocity bar chart"
          >
            {/* Grid horizontal guidelines */}
            {[0, 0.5, 1].map((pct, i) => {
              const yVal = paddingTop + plotHeight * pct
              const rawLabel = Math.round(chartMax * (1 - pct))
              const labelVal = Number.isFinite(rawLabel) ? rawLabel : 0
              return (
                <g key={i}>
                  <line
                    x1={paddingLeft}
                    y1={yVal}
                    x2={width - paddingRight}
                    y2={yVal}
                    stroke="#27272A"
                    strokeDasharray={pct === 1 ? undefined : "3 3"}
                    strokeWidth={1}
                  />
                  <text
                    x={paddingLeft - 8}
                    y={yVal + 3}
                    textAnchor="end"
                    fill="#71717A"
                    fontSize={10}
                    fontFamily="monospace"
                  >
                    {String(labelVal)}
                  </text>
                </g>
              )
            })}

            {/* Bars: Created (emerald) and Resolved (sky) grouped */}
            {items.map((d, index) => {
              const created = createdCounts[index] ?? 0
              const resolved = resolvedCounts[index] ?? 0

              const xCenter = paddingLeft + (items.length > 1 ? index * step : plotWidth / 2)
              const createdX = xCenter - barWidth - 1
              const resolvedX = xCenter + 1

              const rawCreatedY = getY(created)
              const rawCreatedH = paddingTop + plotHeight - rawCreatedY
              const createdH = Number.isFinite(rawCreatedH) ? Math.max(rawCreatedH, 2) : 2
              const createdY = Number.isFinite(rawCreatedY) ? rawCreatedY : paddingTop + plotHeight - createdH

              const rawResolvedY = getY(resolved)
              const rawResolvedH = paddingTop + plotHeight - rawResolvedY
              const resolvedH = Number.isFinite(rawResolvedH) ? Math.max(rawResolvedH, 2) : 2
              const resolvedY = Number.isFinite(rawResolvedY) ? rawResolvedY : paddingTop + plotHeight - resolvedH

              const isHovered = hoveredIndex === index

              return (
                <g
                  key={d.date || index}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Invisible hit area */}
                  <rect
                    x={xCenter - (step / 2 || barWidth * 2)}
                    y={paddingTop}
                    width={Math.max(step || barWidth * 4, 8)}
                    height={plotHeight}
                    fill="transparent"
                  />

                  {/* Created bar */}
                  <rect
                    x={createdX}
                    y={createdY}
                    width={barWidth}
                    height={createdH}
                    rx={2}
                    fill="#10B981"
                    opacity={isHovered ? 1 : 0.85}
                    className="transition-all duration-150"
                  />

                  {/* Resolved bar */}
                  <rect
                    x={resolvedX}
                    y={resolvedY}
                    width={barWidth}
                    height={resolvedH}
                    rx={2}
                    fill="#38BDF8"
                    opacity={isHovered ? 1 : 0.85}
                    className="transition-all duration-150"
                  />

                  {/* X-axis labels */}
                  {(index % labelInterval === 0 || index === items.length - 1) && (
                    <text
                      x={xCenter}
                      y={height - 8}
                      textAnchor="middle"
                      fill="#71717A"
                      fontSize={10}
                    >
                      {formatDate(d.date)}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Interactive Tooltip */}
          {hoveredIndex !== null && items[hoveredIndex] && (
            <div
              className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-md border border-[#27272A] bg-black/95 px-3 py-2 shadow-lg backdrop-blur-xs"
              style={{
                left: `${
                  ((paddingLeft +
                    (items.length > 1
                      ? hoveredIndex * step
                      : plotWidth / 2)) /
                    width) *
                  100
                }%`,
              }}
            >
              <div className="text-[11px] font-medium text-[#E2E8F0]">
                {formatDate(items[hoveredIndex].date)}
              </div>
              <div className="mt-1 flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Created: {createdCounts[hoveredIndex] ?? 0}
                </span>
                <span className="flex items-center gap-1 text-sky-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  Resolved: {resolvedCounts[hoveredIndex] ?? 0}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
