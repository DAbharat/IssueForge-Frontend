import type { Metadata } from "next"
import { LandingHeader } from "@/features/landing/components/LandingHeader"
import { HeroSection } from "@/features/landing/components/HeroSection"
import { FeaturesSection } from "@/features/landing/components/FeaturesSection"
import { WorkflowSection } from "@/features/landing/components/WorkflowSection"
import { CtaSection } from "@/features/landing/components/CtaSection"
import { LandingFooter } from "@/features/landing/components/LandingFooter"

export const metadata: Metadata = {
  title: "IssueForge — Project management & issue tracking for engineering teams",
  description:
    "Organize projects, track issues, and keep your team aligned in one high-density, keyboard-friendly workspace.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#E2E8F0] selection:bg-[#DDE1E5] selection:text-black">
      <LandingHeader />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}