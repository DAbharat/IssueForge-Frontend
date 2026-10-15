"use client"

import { WORKFLOW_STEPS } from "../../constants"
import { ScrollFade } from "../common/ScrollFade"

export function WorkflowSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 border-t border-[#27272A] bg-[#000000]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header - Left Aligned with Cards */}
        <ScrollFade direction="up" delay={50}>
          <div className="max-w-2xl text-left">
            <p className="font-mono text-xs uppercase tracking-widest text-[#94A3B8]">
              SIMPLE, REPEATABLE WORKFLOW
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#E2E8F0] sm:text-4xl">
              How IssueForge powers your<br />sprint.
            </h2>
          </div>
        </ScrollFade>

        {/* 3 Step Cards with Cascading Scroll Fade Transitions */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {WORKFLOW_STEPS.map((item, index) => (
            <ScrollFade
              key={item.step}
              direction="up"
              delay={100 + index * 100}
              className="h-full"
            >
              <div className="relative flex h-full flex-col justify-between rounded-xl border border-[#27272A] bg-[#101012] p-8 transition-colors hover:border-[#3F3F46]">
                <div>
                  <span
                    className={[
                      "font-mono text-5xl font-bold select-none",
                      item.isAccent ? "text-[#DDE1E5]" : "text-[#71717A]/40",
                    ].join(" ")}
                  >
                    {item.step}
                  </span>

                  <h3 className="mt-8 text-base font-semibold text-[#E2E8F0]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#94A3B8]">
                    {item.description}
                  </p>
                </div>
              </div>
            </ScrollFade>
          ))}
        </div>
      </div>
    </section>
  )
}
