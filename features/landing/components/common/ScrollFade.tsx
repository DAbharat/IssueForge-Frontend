"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

type ScrollFadeProps = {
  children: ReactNode
  className?: string
  delay?: number // in ms
  direction?: "up" | "down" | "none"
}

export function ScrollFade({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollFadeProps) {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = domRef.current
    if (!element) return

    // IntersectionObserver that triggers both when entering and exiting
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When scrolling down into view or scrolling up into view -> true
        // When scrolling away (above or below) -> false, so it fades out
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  const transformStyle = () => {
    if (isVisible) return "translate-y-0 opacity-100 scale-100"
    if (direction === "up") return "translate-y-8 opacity-0 scale-[0.98]"
    if (direction === "down") return "-translate-y-8 opacity-0 scale-[0.98]"
    return "opacity-0 scale-[0.98]"
  }

  return (
    <div
      ref={domRef}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: "600ms",
      }}
      className={`transition-all ease-out ${transformStyle()} ${className}`}
    >
      {children}
    </div>
  )
}
