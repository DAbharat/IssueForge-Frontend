"use client"

import { usePathname } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import Navbar from "@/components/layout/Navbar"
import CreateWorkspaceDialog from "@/components/workspaces/CreateWorkspaceDialog"
import { useWorkspaceSwitcher } from "@/hooks/use-workspace-switcher"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { activeWorkspace, workspaces, switchWorkspace, handleWorkspaceCreated, profile } = useWorkspaceSwitcher()
  const [userName, setUserName] = useState("User")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.fullname) {
          setUserName(parsedUser.fullname)
        }
      }
    } catch {
      // ignore localStorage parsing errors and keep the default values
    }
  }, [])

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

  const isPublicRoute = pathname === "/" || pathname === "/login" || pathname === "/register"

  if (isPublicRoute) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen w-full bg-[#000000] text-[#E2E8F0]">
      {!isMobile && (
        <Suspense fallback={null}>
          <AppSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((prev) => !prev)}
            workspaces={workspaces.length > 0 ? workspaces : (profile?.workspaces ?? [])}
            activeWorkspaceId={activeWorkspace?.id}
            onWorkspaceSelect={switchWorkspace}
          />
        </Suspense>
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

          <Suspense fallback={null}>
            <AppSidebar
              collapsed={false}
              onToggle={() => setMobileSidebarOpen((prev) => !prev)}
              mobile
              isOpen={mobileSidebarOpen}
              onClose={() => setMobileSidebarOpen(false)}
              workspaces={workspaces.length > 0 ? workspaces : (profile?.workspaces ?? [])}
              activeWorkspaceId={activeWorkspace?.id}
              onWorkspaceSelect={switchWorkspace}
            />
          </Suspense>
        </>
      )}

      <div className="flex min-h-screen flex-1 flex-col bg-[#000000]">
        <Navbar
          workspaceName={activeWorkspace?.name}
          workspaces={workspaces}
          onWorkspaceSwitch={switchWorkspace}
          onCreateWorkspace={() => setIsCreateWorkspaceOpen(true)}
          userName={userName}
          isMobile={isMobile}
          onMobileSidebarToggle={() => setMobileSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 bg-[#000000] p-6 text-[#E2E8F0]">{children}</main>
      </div>

      <CreateWorkspaceDialog
        isOpen={isCreateWorkspaceOpen}
        onOpenChange={setIsCreateWorkspaceOpen}
        onSuccess={handleWorkspaceCreated}
      />
    </div>
  )
}
