"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import Navbar from "@/components/layout/Navbar"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [userName, setUserName] = useState("User")
  const [workspaceName, setWorkspaceName] = useState<string | undefined>()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.fullname) {
          setUserName(parsedUser.fullname)
        }
        if (parsedUser.workspaceName) {
          setWorkspaceName(parsedUser.workspaceName)
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

  const isAuthRoute = pathname === "/login" || pathname === "/register"

  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen w-full bg-[#050213] text-white">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((prev) => !prev)} />

      <div className="flex min-h-screen flex-1 flex-col bg-[#050213]">
        <Navbar workspaceName={workspaceName} userName={userName} />
        <main className="flex-1 bg-[#050213] p-6">{children}</main>
      </div>
    </div>
  )
}
