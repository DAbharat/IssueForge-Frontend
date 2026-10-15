"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NAV_LINKS } from "../../constants"

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      // Do not hide if mobile drawer is currently open
      if (mobileMenuOpen) return

      const currentScrollY =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        window.scrollY ||
        0

      const prevScrollY = lastScrollYRef.current
      const delta = currentScrollY - prevScrollY

      // Always show when near the top of the page
      if (currentScrollY <= 40) {
        setIsVisible(true)
      } else if (delta > 4 && currentScrollY > 60) {
        // Scrolling down -> fade out & slide up
        setIsVisible(false)
      } else if (delta < -4) {
        // Scrolling up -> fade in & slide down
        setIsVisible(true)
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mobileMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-[#27272A] bg-black/85 backdrop-blur-md transition-all duration-300 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#27272A] bg-[#18181B] transition-colors group-hover:border-[#3F3F46]">
              {/* Isometric 3-layer logo mark */}
              <svg
                className="h-4 w-4 text-[#DDE1E5]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight text-[#E2E8F0]">
              IssueForge
            </span>
          </Link>
        </div>

        {/* Center: The three navigation components (Features, How it works, Product) centered with increased font size */}
        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#94A3B8] transition-colors hover:text-[#E2E8F0]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Side: Auth Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-[#E2E8F0] transition-colors hover:text-white"
          >
            Sign in
          </Link>
          <Button
            asChild
            size="sm"
            className="h-8 rounded-md bg-[#DDE1E5] px-3.5 text-xs font-semibold text-black hover:bg-white active:scale-[0.98] transition-all"
          >
            <Link href="/register">Get started</Link>
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#27272A] bg-[#18181B] text-[#94A3B8] transition-colors hover:text-[#E2E8F0]"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#27272A] bg-[#000000] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile Navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-[#94A3B8] hover:bg-[#18181B] hover:text-[#E2E8F0]"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-[#27272A] pt-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-md border border-[#27272A] bg-[#18181B] py-2 text-xs font-medium text-[#E2E8F0]"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-md bg-[#DDE1E5] py-2 text-xs font-semibold text-black hover:bg-white"
              >
                Get started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
