import { ChevronDown, ChevronLeft, FolderKanban, LayoutGrid, Settings, X } from "lucide-react"
import { useState } from "react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type SidebarWorkspace = {
  id?: string | number
  name?: string
  role?: string
}

type AppSidebarProps = {
  collapsed: boolean
  onToggle: () => void
  mobile?: boolean
  isOpen?: boolean
  onClose?: () => void
  workspaces?: SidebarWorkspace[]
}

export function AppSidebar({
  collapsed,
  onToggle,
  mobile = false,
  isOpen = true,
  onClose,
  workspaces = [],
}: AppSidebarProps) {
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [workspacesOpen, setWorkspacesOpen] = useState(false)
  const [myWorkspacesOpen, setMyWorkspacesOpen] = useState(false)

  const renderOverviewItem = () => (
    <button
      key="Overview"
      type="button"
      className="flex w-full items-center gap-3 rounded-sm border-l-2 border-[#5E6AD2] bg-[#1E222D] px-3 py-2 text-left text-[15px] font-medium text-[#E2E8F0] transition-colors hover:bg-[#1E222D]"
    >
      <LayoutGrid className="h-4 w-4 shrink-0 text-[#5E6AD2]" />
      {!collapsed && <span>Overview</span>}
    </button>
  )

  const renderSettingsItem = () => (
    <button
      key="Settings"
      type="button"
      className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-[15px] font-medium text-[#94A3B8] transition-colors hover:bg-[#171A21] hover:text-[#E2E8F0]"
    >
      <Settings className="h-4 w-4 shrink-0 text-[#94A3B8]" />
      {!collapsed && <span>Settings</span>}
    </button>
  )

  const renderProjectsSection = () => (
    <Collapsible key="Projects" open={projectsOpen} onOpenChange={setProjectsOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-[#94A3B8] transition-colors hover:bg-[#171A21] hover:text-[#E2E8F0]">
        <div className="flex flex-1 items-center gap-3">
          <FolderKanban className="h-4 w-4 shrink-0 text-[#94A3B8]" />
          {!collapsed && <span className="text-[15px] font-medium">Projects</span>}
        </div>

        {!collapsed && (
          <ChevronDown
            className={[
              "h-4 w-4 shrink-0 text-[#94A3B8] transition-transform",
              projectsOpen ? "rotate-180" : "",
            ].join(" ")}
          />
        )}
      </CollapsibleTrigger>

      {!collapsed && (
        <CollapsibleContent className="pt-1">
          <div className="ml-4.75 space-y-0.5 border-l border-[#222631] pl-4">
            <button
              type="button"
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm text-[#94A3B8] transition-colors hover:bg-[#171A21] hover:text-[#E2E8F0]"
            >
              My projects
            </button>
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  )

  const renderWorkspacesSection = () => (
    <Collapsible key="Workspaces" open={workspacesOpen} onOpenChange={setWorkspacesOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-[#94A3B8] transition-colors hover:bg-[#171A21] hover:text-[#E2E8F0]">
        <div className="flex flex-1 items-center gap-3">
          <FolderKanban className="h-4 w-4 shrink-0 text-[#94A3B8]" />
          {!collapsed && <span className="text-[15px] font-medium">Workspaces</span>}
        </div>

        {!collapsed && (
          <ChevronDown
            className={[
              "h-4 w-4 shrink-0 text-[#94A3B8] transition-transform",
              workspacesOpen ? "rotate-180" : "",
            ].join(" ")}
          />
        )}
      </CollapsibleTrigger>

      {!collapsed && (
        <CollapsibleContent className="pt-1">
          <div className="ml-4.75 space-y-0.5 border-l border-[#222631] pl-4">
            <button
              type="button"
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm text-[#94A3B8] transition-colors hover:bg-[#171A21] hover:text-[#E2E8F0]"
            >
              Invites
            </button>

            {/* Nested "My workspaces" now owns its own Collapsible root,
                so its CollapsibleTrigger binds to ITS state, not the parent's. */}
            <Collapsible open={myWorkspacesOpen} onOpenChange={setMyWorkspacesOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-[#94A3B8] transition-colors hover:bg-[#171A21] hover:text-[#E2E8F0]">
                <span>My workspaces</span>
                <ChevronDown
                  className={[
                    "h-4 w-4 shrink-0 transition-transform",
                    myWorkspacesOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
              </CollapsibleTrigger>

              <CollapsibleContent className="pt-0.5">
                <div className="ml-3.75 space-y-0.5 border-l border-[#222631] pl-3">
                  {workspaces.length === 0 ? (
                    <div className="px-2 py-1.5 text-xs text-[#94A3B8]">No workspaces yet</div>
                  ) : (
                    workspaces.map((workspace) => (
                      <button
                        key={workspace.id ?? workspace.name ?? "workspace"}
                        type="button"
                        className="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-[#94A3B8] transition-colors hover:bg-[#171A21] hover:text-[#E2E8F0]"
                      >
                        <span className="truncate">{workspace.name || "Workspace"}</span>
                        {workspace.role && (
                          <span className="shrink-0 rounded-full border border-[#222631] bg-[#1E222D] px-1.5 py-0.5 text-[9px] uppercase tracking-[0.08em] text-[#94A3B8]">
                            {workspace.role}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  )

  const content = (
    <nav className="space-y-1 p-3">
      {renderOverviewItem()}
      {renderProjectsSection()}
      {renderWorkspacesSection()}
      <div className="my-2 border-t border-[#222631]" />
      {renderSettingsItem()}
    </nav>
  )

  if (mobile) {
    return (
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex h-screen w-[82vw] max-w-[320px] flex-col border-r border-[#222631] bg-[#12141A] text-[#E2E8F0] shadow-2xl shadow-black/40 transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#222631] px-3">
          <span className="text-[15px] font-semibold tracking-tight text-[#E2E8F0]">IssueForge</span>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#222631] bg-[#1A1D24] text-[#94A3B8] transition-colors hover:bg-[#171A21] hover:text-[#E2E8F0]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto">{content}</div>
      </aside>
    )
  }

  return (
    <aside
      className={[
        "hidden shrink-0 border-r border-[#222631] bg-[#12141A] text-[#E2E8F0] transition-all duration-200 md:block",
        collapsed ? "w-21" : "w-70",
      ].join(" ")}
    >
      <div className="flex h-16 items-center justify-between border-b border-[#222631] px-3">
        {!collapsed && <span className="text-[15px] font-semibold tracking-tight text-[#E2E8F0]">IssueForge</span>}

        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggle}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-sm border border-[#222631] bg-[#1A1D24] text-[#94A3B8] transition-colors hover:bg-[#171A21] hover:text-[#E2E8F0]"
        >
          <ChevronLeft className={collapsed ? "rotate-180" : ""} size={16} />
        </button>
      </div>

      <div className="overflow-y-auto">{content}</div>
    </aside>
  )
}