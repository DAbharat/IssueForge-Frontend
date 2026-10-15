"use client"

import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HERO_HIGHLIGHTS } from "../../constants"
import { ProductPreview } from "../ProductPreview"
import { ScrollFade } from "../common/ScrollFade"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Faint subtle grid background with radial mask */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"
        aria-hidden="true"
      />

      {/* Soft neutral ambient glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollFade direction="up" delay={50}>
          <div className="flex flex-col items-center text-center">
            {/* Release Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#101012] px-3.5 py-1 text-xs text-[#94A3B8] shadow-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#DDE1E5]" />
              <span className="font-medium text-[#E2E8F0]">IssueForge 1.0</span>
              <span className="text-[#3F3F46]">·</span>
              <span>Developer-first issue management</span>
            </div>

            {/* Heading */}
            <h1 className="mt-7 max-w-4xl text-4xl font-semibold tracking-tight text-[#E2E8F0] sm:text-6xl lg:text-7xl sm:leading-[1.12]">
              Turn complex work into{" "}
              <span className="block sm:inline text-white">clear progress.</span>
            </h1>

            {/* Subcopy */}
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#94A3B8] sm:text-base">
              Organize projects, track issues, and keep your team aligned in one
              high-density, keyboard-friendly workspace.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                className="h-10 rounded-md bg-[#DDE1E5] px-5 text-sm font-semibold text-black hover:bg-white active:scale-[0.98] transition-all"
              >
                <Link href="/register">
                  Get started
                  <ArrowRight className="h-4 w-4 ml-1.5" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-10 rounded-md border border-[#27272A] bg-transparent px-5 text-sm font-medium text-[#E2E8F0] hover:bg-[#18181B] hover:text-white transition-colors"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>

            {/* Highlights */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#94A3B8]">
              {HERO_HIGHLIGHTS.map((highlight) => (
                <span key={highlight} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#DDE1E5]" aria-hidden="true" />
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </ScrollFade>

        {/* Product Preview Interface with Scroll Fade */}
        <div className="mt-12 sm:mt-16">
          <ScrollFade direction="up" delay={150}>
            <ProductPreview />
          </ScrollFade>
        </div>
      </div>
    </section>
  )
}
