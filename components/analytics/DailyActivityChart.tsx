"use client"

import { useState } from "react"
import type { DailyActivityStat } from "@/services/analytics.service"

type DailyActivityChartProps = {
  data: DailyActivityStat[]
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

export function DailyActivityChart({ data }: DailyActivityChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const items = Array.isArray(data) ? data : []
  const counts = items.map((d) => {
    const raw = Number(d.total_activities ?? d.activity_count ?? 0)
    return Number.isFinite(raw) ? raw : 0
  })

  const maxVal = counts.length > 0 ? Math.max(...counts, 0) : 0
  const chartMax = maxVal === 0 ? 10 : Math.ceil(maxVal * 1.25)
  const totalActivities = counts.reduce((sum, c) => sum + c, 0)

  // Chart dimensions in viewBox coordinates
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
    Math.min(items.length > 0 ? (plotWidth / items.length) * 0.65 : 12, 24),
    4,
  )

  const getY = (val: number) => {
    const num = Number(val) || 0
    const safeMax = chartMax > 0 ? chartMax : 10
    const computed = paddingTop + plotHeight - (num / safeMax) * plotHeight
    return Number.isFinite(computed) ? computed : paddingTop + plotHeight
  }

  const labelInterval = Math.max(1, Math.ceil(items.length / 6))

  return (
    <div className="rounded-lg border border-[#27272A] bg-[#18181B] p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#27272A] pb-4">
        <div>
          <h3 className="text-sm font-medium text-[#E2E8F0]">Daily Activity Stream</h3>
          <p className="mt-0.5 text-xs text-[#94A3B8]">
            Timeline of recorded actions, edits, and updates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <span className="h-2 w-2 rounded-full bg-[#DDE1E5]" />
            <span>
              Total:{" "}
              <strong className="font-semibold text-[#E2E8F0]">{totalActivities}</strong>
            </span>
          </div>
        </div>
      </div>

      {items.length === 0 || totalActivities === 0 ? (
        <div className="flex h-52 flex-col items-center justify-center text-center">
          <p className="text-sm text-[#94A3B8]">No activity recorded in this period</p>
          <span className="mt-1 text-xs text-zinc-500">
            Actions like issue creation, comments, and status updates will appear here.
          </span>
        </div>
      ) : (
        <div className="relative mt-4">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full overflow-visible"
            aria-label="Daily activity bar chart"
          >
            {/* Grid lines */}
            {[0, 0.5, 1].map((pct, i) => {
              const yVal = paddingTop + plotHeight * pct
              const rawLabelVal = Math.round(chartMax * (1 - pct))
              const labelVal = Number.isFinite(rawLabelVal) ? rawLabelVal : 0

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

            {/* Bars */}
            {items.map((d, index) => {
              const count = counts[index] ?? 0
              const xCenter = paddingLeft + (items.length > 1 ? index * step : plotWidth / 2)
              const barX = xCenter - barWidth / 2
              const barY = getY(count)
              const rawBarH = paddingTop + plotHeight - barY
              const barH = Number.isFinite(rawBarH) ? Math.max(rawBarH, 2) : 2
              const safeBarY = Number.isFinite(barY) ? barY : paddingTop + plotHeight - barH
              const isHovered = hoveredIndex === index

              return (
                <g
                  key={d.date || index}
                  className="cursor-pointer transition-opacity"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Invisible hit area for easier targeting */}
                  <rect
                    x={xCenter - (step / 2 || barWidth)}
                    y={paddingTop}
                    width={Math.max(step || barWidth * 2, 8)}
                    height={plotHeight}
                    fill="transparent"
                  />

                  {/* Rendered bar */}
                  <rect
                    x={barX}
                    y={safeBarY}
                    width={barWidth}
                    height={barH}
                    rx={2}
                    fill={isHovered ? "#FFFFFF" : "#DDE1E5"}
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
              className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-md border border-[#27272A] bg-black/95 px-2.5 py-1.5 shadow-lg backdrop-blur-xs"
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
              <div className="mt-0.5 text-[11px] text-[#94A3B8]">
                Activities:{" "}
                <span className="font-semibold text-white">
                  {counts[hoveredIndex] ?? 0}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
