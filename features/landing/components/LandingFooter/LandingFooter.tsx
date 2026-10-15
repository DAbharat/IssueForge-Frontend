"use client"

import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="border-t border-[#27272A] bg-[#000000] py-14 text-xs text-[#94A3B8]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        {/* Brand */}
        <div className="flex flex-col">
          <span className="font-semibold text-[#E2E8F0] text-sm tracking-tight">
            IssueForge
          </span>
          <p className="mt-1.5 max-w-xs text-xs text-[#71717A] leading-relaxed">
            Lightweight, developer-first issue tracking and project management.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-[#94A3B8]">
          <a href="#features" className="hover:text-[#E2E8F0] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-[#E2E8F0] transition-colors">
            How it works
          </a>
          <Link href="/login" className="hover:text-[#E2E8F0] transition-colors">
            Sign in
          </Link>
          <Link href="/register" className="hover:text-[#E2E8F0] transition-colors">
            Get started
          </Link>
          <a
            href="https://github.com/DAbharat/IssueForge-Frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E2E8F0] transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8 text-[11px] text-[#71717A]">
        <p>© 2026 IssueForge. All rights reserved.</p>
      </div>
    </footer>
  )
}
