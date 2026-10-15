"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollFade } from "../common/ScrollFade"

export function CtaSection() {
  return (
    <section className="border-t border-[#27272A] bg-[#000000] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollFade direction="up" delay={50}>
          <div className="relative overflow-hidden rounded-2xl border border-[#27272A] bg-[#101012] px-6 py-16 text-center sm:px-12 sm:py-24">
            {/* Subtle neutral top ambient glow */}
            <div
              className="pointer-events-none absolute left-1/2 top-0 -z-10 h-48 w-96 -translate-x-1/2 rounded-full bg-white/[0.04] blur-3xl"
              aria-hidden="true"
            />

            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Ready to bring your work<br className="hidden sm:inline" /> together?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#94A3B8] sm:text-base">
              A clean, distraction-free issue tracker built for developers.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild className="h-10 rounded-md bg-[#DDE1E5] px-6 text-sm font-semibold text-black transition-all hover:bg-white active:scale-[0.98]">
                <Link href="/register">Get started</Link>
              </Button>
              <Button asChild variant="outline" className="h-10 rounded-md border border-[#27272A] bg-transparent px-6 text-sm font-medium text-[#E2E8F0] transition-colors hover:bg-[#18181B] hover:text-white">
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </ScrollFade>
      </div>
    </section>
  )
}