"use client"

import {
  Briefcase,
  ChevronDown,
  ChevronLeft,
  FolderKanban,
  LayoutGrid,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react"
import { useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

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

/* ───────────────────────── shared styles ───────────────────────── */

const ROW_BASE =
  "relative flex h-10 w-full items-center rounded-md text-left transition-colors"

const ROW_IDLE = "text-[#94A3B8] hover:bg-[#18181B] hover:text-[#E2E8F0]"

// Child rows are 36px tall, so their vertical centre (where the elbow connects) is 18px.
const SUB_ROW =
  "flex h-9 w-full items-center justify-between gap-2 rounded-md px-2.5 text-left text-sm text-[#94A3B8] transition-colors hover:bg-[#18181B] hover:text-[#E2E8F0] data-[state=open]:text-[#E2E8F0]"

/* ───────────────────────── tree helpers ───────────────────────── */

/**
 * One node in the tree. Draws a curved elbow from the guide line to the row,
 * and continues the vertical line downward unless this is the last node.
 */
function TreeNode({ last = false, children }: { last?: boolean; children: ReactNode }) {
  return (
    <div className="relative pl-4">
      {!last && (
        <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-[#27272A]" />
      )}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-[18px] w-3 rounded-bl-lg border-b border-l border-[#27272A]"
      />
      {children}
    </div>
  )
}

/** Container for a group of TreeNodes. `ml` decides where the guide line sits. */
function TreeList({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={["relative mt-1 pb-1", className].join(" ")}>{children}</div>
}

/* ───────────────────────── sidebar items ───────────────────────── */

function SidebarLink({
  icon: Icon,
  label,
  collapsed,
  active = false,
  onClick,
}: {
  icon: LucideIcon
  label: string
  collapsed: boolean
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      title={collapsed ? label : undefined}
      onClick={onClick}
      className={[
        ROW_BASE,
        collapsed ? "justify-center" : "gap-3 px-3",
        active ? "bg-[#27272A] text-[#E2E8F0]" : ROW_IDLE,
      ].join(" ")}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[#5E6AD2]" />
      )}
      <Icon className={["h-4 w-4 shrink-0", active ? "text-[#5E6AD2]" : "text-[#94A3B8]"].join(" ")} />
      {!collapsed && <span className="text-[15px] font-medium">{label}</span>}
    </button>
  )
}

function SidebarSection({
  icon: Icon,
  label,
  collapsed,
  open,
  onOpenChange,
  onExpandSidebar,
  children,
}: {
  icon: LucideIcon
  label: string
  collapsed: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onExpandSidebar: () => void
  children: ReactNode
}) {
  const isOpen = open && !collapsed

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      // The open section becomes one grouped block: parent + children.
      className="rounded-md transition-colors data-[state=open]:bg-[#18181B]/50"
    >
      <CollapsibleTrigger
        title={collapsed ? label : undefined}
        onClick={(e) => {
          // No room for a dropdown when collapsed: expand the sidebar and open the section.
          if (collapsed) {
            e.preventDefault()
            onOpenChange(true)
            onExpandSidebar()
          }
        }}
        className={[
          ROW_BASE,
          ROW_IDLE,
          "data-[state=open]:text-[#E2E8F0]",
          collapsed ? "justify-center" : "gap-3 px-3",
        ].join(" ")}
      >
        <Icon
          className={[
            "h-4 w-4 shrink-0 transition-colors",
            isOpen ? "text-[#E2E8F0]" : "text-[#94A3B8]",
          ].join(" ")}
        />
        {!collapsed && (
          <>
            <span className="flex-1 text-[15px] font-medium">{label}</span>
            <ChevronDown
              className={[
                "h-4 w-4 shrink-0 transition-transform duration-200",
                isOpen ? "rotate-180 text-[#E2E8F0]" : "text-[#94A3B8]",
              ].join(" ")}
            />
          </>
        )}
      </CollapsibleTrigger>

      {!collapsed && <CollapsibleContent>{children}</CollapsibleContent>}
    </Collapsible>
  )
}

/* ───────────────────────── main component ───────────────────────── */

export function AppSidebar({
  collapsed: collapsedProp,
  onToggle,
  mobile = false,
  isOpen = true,
  onClose,
  workspaces = [],
}: AppSidebarProps) {
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [workspacesOpen, setWorkspacesOpen] = useState(false)
  const [myWorkspacesOpen, setMyWorkspacesOpen] = useState(false)

  const router = useRouter()

  // The mobile drawer is always fully expanded.
  const collapsed = collapsedProp && !mobile

  const content = (
    <nav className="space-y-1 p-3">
      <SidebarLink icon={LayoutGrid} label="Overview" collapsed={collapsed} active />

      {/* ── Projects ── */}
      <SidebarSection
        icon={FolderKanban}
        label="Projects"
        collapsed={collapsed}
        open={projectsOpen}
        onOpenChange={setProjectsOpen}
        onExpandSidebar={onToggle}
      >
        {/* ml-5 (20px) puts the guide line under the centre of the 16px icon */}
        <TreeList className="ml-5 mr-2">
          <TreeNode last>
            <button type="button" className={SUB_ROW}>
              My projects
            </button>
          </TreeNode>
        </TreeList>
      </SidebarSection>

      {/* ── Workspaces ── */}
      <SidebarSection
        icon={Briefcase}
        label="Workspaces"
        collapsed={collapsed}
        open={workspacesOpen}
        onOpenChange={setWorkspacesOpen}
        onExpandSidebar={onToggle}
      >
        <TreeList className="ml-5 mr-2">
          <TreeNode>
            <button type="button" className={SUB_ROW}>
              Invites
            </button>
          </TreeNode>

          <TreeNode last>
            {/* Nested collapsible with its own state */}
            <Collapsible open={myWorkspacesOpen} onOpenChange={setMyWorkspacesOpen}>
              <CollapsibleTrigger className={SUB_ROW}>
                <span>My workspaces</span>
                <ChevronDown
                  className={[
                    "h-4 w-4 shrink-0 transition-transform duration-200",
                    myWorkspacesOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
              </CollapsibleTrigger>

              <CollapsibleContent>
                {/* Second level: its guide line starts under the "My workspaces" text */}
                <TreeList className="ml-3">
                  {workspaces.length === 0 ? (
                    <TreeNode last>
                      <div className="flex h-9 items-center px-2.5 text-xs text-[#94A3B8]">
                        No workspaces yet
                      </div>
                    </TreeNode>
                  ) : (
                    workspaces.map((workspace, index) => {
                      const name = workspace.name || "Workspace"
                      return (
                        <TreeNode
                          key={workspace.id ?? `${name}-${index}`}
                          last={index === workspaces.length - 1}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              router.push("/workspace")
                              if (mobile) onClose?.()
                            }}
                            className={SUB_ROW}
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#27272A] text-[10px] font-semibold uppercase text-[#E2E8F0]">
                                {name.charAt(0)}
                              </span>
                              <span className="truncate">{name}</span>
                            </span>
                            {workspace.role && (
                              <span className="shrink-0 rounded-full border border-[#27272A] bg-[#27272A] px-1.5 py-0.5 text-[9px] uppercase tracking-[0.08em] text-[#94A3B8]">
                                {workspace.role}
                              </span>
                            )}
                          </button>
                        </TreeNode>
                      )
                    })
                  )}
                </TreeList>
              </CollapsibleContent>
            </Collapsible>
          </TreeNode>
        </TreeList>
      </SidebarSection>

      <div className="my-2 border-t border-[#27272A]" />

      <SidebarLink icon={Settings} label="Settings" collapsed={collapsed} />
    </nav>
  )

  /* ── Mobile drawer ── */
  if (mobile) {
    return (
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-[82vw] max-w-[320px] flex-col border-r border-[#27272A] bg-[#0E0E11] text-[#E2E8F0] shadow-2xl shadow-black/40 transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#27272A] px-3">
          <span className="pl-1 text-[15px] font-semibold tracking-tight text-[#E2E8F0]">IssueForge</span>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#27272A] bg-[#18181B] text-[#94A3B8] transition-colors hover:bg-[#27272A] hover:text-[#E2E8F0]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">{content}</div>
      </aside>
    )
  }

  /* ── Desktop sidebar ── */
  return (
    <aside
      className={[
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[#27272A] bg-[#0E0E11] text-[#E2E8F0] transition-[width] duration-200 md:flex",
        collapsed ? "w-20" : "w-[280px]",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-16 shrink-0 items-center border-b border-[#27272A] px-3",
          collapsed ? "justify-center" : "justify-between",
        ].join(" ")}
      >
        {!collapsed && (
          <span className="pl-1 text-[15px] font-semibold tracking-tight text-[#E2E8F0]">IssueForge</span>
        )}

        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggle}
          className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#27272A] bg-[#18181B] text-[#94A3B8] transition-colors hover:bg-[#27272A] hover:text-[#E2E8F0]"
        >
          <ChevronLeft className={collapsed ? "rotate-180" : ""} size={16} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">{content}</div>
    </aside>
  )
}