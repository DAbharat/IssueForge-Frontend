"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import Navbar from "@/components/layout/Navbar"
import { useProfile } from "@/hooks/use-profile"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { profile } = useProfile()
  const [userName, setUserName] = useState("User")
  const [workspaceName, setWorkspaceName] = useState<string | undefined>()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.fullname) {
          setUserName(parsedUser.fullname)
        }
      }

      const storedWorkspace = window.localStorage.getItem("workspaceName")
      if (storedWorkspace) {
        setWorkspaceName(storedWorkspace)
      }
    } catch {
      // ignore localStorage parsing errors and keep the default values
    }
  }, [])

  useEffect(() => {
    if (profile?.workspaces && profile.workspaces.length > 0) {
      const firstWorkspaceName = profile.workspaces[0]?.name
      if (firstWorkspaceName) {
        setWorkspaceName(firstWorkspaceName)
      }
    }
  }, [profile])

  useEffect(() => {
    const updateViewport = () => {
      const nextIsMobile = window.innerWidth < 768
      setIsMobile(nextIsMobile)
      if (!nextIsMobile) {
        setMobileSidebarOpen(false)
      }
    }

    updateViewport()
    window.addEventListener("resize", updateViewport)

    return () => window.removeEventListener("resize", updateViewport)
  }, [])

  const isAuthRoute = pathname === "/login" || pathname === "/register"

  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen w-full bg-[#000000] text-[#E2E8F0]">
      {!isMobile && (
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
          workspaces={profile?.workspaces ?? []}
        />
      )}

      {isMobile && (
        <>
          <div
            className={[
              "fixed inset-0 z-40 bg-black/60 transition-opacity duration-200",
              mobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
            ].join(" ")}
            onClick={() => setMobileSidebarOpen(false)}
          />

          <AppSidebar
            collapsed={false}
            onToggle={() => setMobileSidebarOpen((prev) => !prev)}
            mobile
            isOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
            workspaces={profile?.workspaces ?? []}
          />
        </>
      )}

      <div className="flex min-h-screen flex-1 flex-col bg-[#000000]">
        <Navbar
          workspaceName={workspaceName}
          userName={userName}
          isMobile={isMobile}
          onMobileSidebarToggle={() => setMobileSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 bg-[#000000] p-6 text-[#E2E8F0]">{children}</main>
      </div>
    </div>
  )
}
