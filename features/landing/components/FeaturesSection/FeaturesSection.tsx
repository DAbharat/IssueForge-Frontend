"use client"

import { ScrollFade } from "../common/ScrollFade"

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 border-t border-[#27272A] bg-[#000000]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollFade direction="up" delay={50}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-[#94A3B8]">
              BUILT FOR ENGINEERING TEAMS
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#E2E8F0] sm:text-4xl">
              Everything you need to ship on schedule.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#94A3B8] sm:text-base">
              IssueForge strips away unnecessary complexity and focuses on the core tools
              software teams rely on every day.
            </p>
          </div>
        </ScrollFade>

        {/* Bento Grid with ScrollFade animations */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
          {/* Card 1: High-Density Issue Tracking (span 4) */}
          <ScrollFade direction="up" delay={100} className="md:col-span-4 h-full">
            <div className="flex h-full flex-col justify-between rounded-xl border border-[#27272A] bg-[#101012] p-6 transition-colors hover:border-[#3F3F46]">
              <div>
                <h3 className="text-base font-semibold text-[#E2E8F0]">
                  High-Density Issue Tracking
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
                  Structured statuses, 4-level priorities, assignees, and optional milestone due dates.
                </p>
              </div>

              {/* Live Mini-UI */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between rounded-md border border-[#27272A] bg-[#141416] px-3.5 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#CA8A04]" />
                    <span className="text-[#E2E8F0]">Granular workspace roles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-emerald-500/20 bg-emerald-500/5 px-1.5 py-0.5 text-[10px] font-mono text-emerald-300">
                      backend
                    </span>
                    <span className="font-mono text-[11px] text-[#71717A]">#102</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border border-[#27272A] bg-[#141416] px-3.5 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#71717A]" />
                    <span className="text-[#E2E8F0]">Implement JWT token rotation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-red-500/20 bg-red-500/5 px-1.5 py-0.5 text-[10px] font-mono text-red-300">
                      security
                    </span>
                    <span className="font-mono text-[11px] text-[#71717A]">#104</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border border-[#27272A] bg-[#141416] px-3.5 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                    <span className="text-[#E2E8F0]">Invitation email token generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-red-500/20 bg-red-500/5 px-1.5 py-0.5 text-[10px] font-mono text-red-300">
                      security
                    </span>
                    <span className="font-mono text-[11px] text-[#71717A]">#98</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollFade>

          {/* Card 2: Workspaces & Projects (span 2) */}
          <ScrollFade direction="up" delay={180} className="md:col-span-2 h-full">
            <div className="flex h-full flex-col justify-between rounded-xl border border-[#27272A] bg-[#101012] p-6 transition-colors hover:border-[#3F3F46]">
              <div>
                <h3 className="text-base font-semibold text-[#E2E8F0]">
                  Workspaces & Projects
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
                  Isolated team workspaces with designated project leads.
                </p>
              </div>

              {/* Live Mini-UI */}
              <div className="mt-6 space-y-1.5">
                <div className="rounded-md border border-[#27272A] bg-[#18181B] px-3 py-2 text-xs font-medium text-[#E2E8F0]">
                  Core Team
                </div>
                <div className="ml-3 rounded-md border border-[#27272A] bg-[#141416] px-3 py-1.5 text-xs text-[#94A3B8]">
                  IssueForge Web
                </div>
                <div className="ml-3 rounded-md border border-[#27272A] bg-[#141416] px-3 py-1.5 text-xs text-[#94A3B8]">
                  Go API
                </div>
              </div>
            </div>
          </ScrollFade>

          {/* Card 3: Audit Trail & Activity History (span 3) */}
          <ScrollFade direction="up" delay={100} className="md:col-span-3 h-full">
            <div className="flex h-full flex-col justify-between rounded-xl border border-[#27272A] bg-[#101012] p-6 transition-colors hover:border-[#3F3F46]">
              <div>
                <h3 className="text-base font-semibold text-[#E2E8F0]">
                  Audit Trail & Activity History
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
                  Every status change, assignment, and edit, in order.
                </p>
              </div>

              {/* Live Mini-UI */}
              <div className="mt-6 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-[#27272A]/40 pb-2">
                  <span className="text-[#E2E8F0]">
                    Alex moved #102 to <span className="text-[#CA8A04] font-medium">In Progress</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#71717A]">4m</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#27272A]/40 pb-2">
                  <span className="text-[#E2E8F0]">David completed #98</span>
                  <span className="font-mono text-[11px] text-[#71717A]">18m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#E2E8F0] flex items-center gap-1.5">
                    Sarah labeled #104{" "}
                    <span className="rounded border border-red-500/20 bg-red-500/5 px-1 py-0.2 text-[10px] font-mono text-red-300">
                      security
                    </span>
                  </span>
                  <span className="font-mono text-[11px] text-[#71717A]">1h</span>
                </div>
              </div>
            </div>
          </ScrollFade>

          {/* Card 4: Granular Team Roles & Access (span 3) */}
          <ScrollFade direction="up" delay={160} className="md:col-span-3 h-full">
            <div className="flex h-full flex-col justify-between rounded-xl border border-[#27272A] bg-[#101012] p-6 transition-colors hover:border-[#3F3F46]">
              <div>
                <h3 className="text-base font-semibold text-[#E2E8F0]">
                  Granular Team Roles & Access
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
                  Invite via secure links. Owner, Admin, and Member permissions.
                </p>
              </div>

              {/* Live Mini-UI */}
              <div className="mt-6 flex items-center gap-2">
                <span className="rounded bg-[#E2E8F0] px-2.5 py-1 text-xs font-semibold text-black">
                  Owner
                </span>
                <span className="rounded border border-[#3F3F46] bg-[#27272A] px-2.5 py-1 text-xs font-medium text-[#E2E8F0]">
                  Admin
                </span>
                <span className="rounded border border-[#3F3F46] bg-[#27272A] px-2.5 py-1 text-xs font-medium text-[#94A3B8]">
                  Member
                </span>
              </div>
            </div>
          </ScrollFade>

          {/* Card 5: Project-Scoped Labels (span 3) */}
          <ScrollFade direction="up" delay={220} className="md:col-span-3 h-full">
            <div className="flex h-full flex-col justify-between rounded-xl border border-[#27272A] bg-[#101012] p-6 transition-colors hover:border-[#3F3F46]">
              <div>
                <h3 className="text-base font-semibold text-[#E2E8F0]">
                  Project-Scoped Labels
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
                  Color-coded labels to filter by technical domain.
                </p>
              </div>

              {/* Live Mini-UI */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="rounded border border-red-500/25 bg-red-500/10 px-2 py-0.5 text-xs font-mono text-red-300">
                  security
                </span>
                <span className="rounded border border-blue-500/25 bg-blue-500/10 px-2 py-0.5 text-xs font-mono text-blue-300">
                  frontend
                </span>
                <span className="rounded border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-xs font-mono text-emerald-300">
                  backend
                </span>
                <span className="rounded border border-zinc-500/30 bg-zinc-500/10 px-2 py-0.5 text-xs font-mono text-zinc-300">
                  design
                </span>
              </div>
            </div>
          </ScrollFade>

          {/* Card 6: Safe Archive & Instant Restore (span 3) */}
          <ScrollFade direction="up" delay={280} className="md:col-span-3 h-full">
            <div className="flex h-full flex-col justify-between rounded-xl border border-[#27272A] bg-[#101012] p-6 transition-colors hover:border-[#3F3F46]">
              <div>
                <h3 className="text-base font-semibold text-[#E2E8F0]">
                  Safe Archive & Instant Restore
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
                  Archive finished projects. Restore them whenever needed, non-destructively.
                </p>
              </div>

              {/* Live Mini-UI */}
              <div className="mt-6">
                <div className="flex items-center justify-between rounded-md border border-[#27272A] bg-[#141416] px-3.5 py-2.5 text-xs">
                  <span className="font-medium text-[#E2E8F0]">Legacy Portal</span>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-[#71717A]">Archived</span>
                    <span className="text-[#3F3F46]">·</span>
                    <span className="text-[#DDE1E5] font-medium hover:underline cursor-pointer">
                      Restore
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollFade>
        </div>
      </div>
    </section>
  )
}
