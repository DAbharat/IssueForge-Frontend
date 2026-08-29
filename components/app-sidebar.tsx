import { ChevronLeft, FolderKanban, LayoutGrid, MessageSquareText, Settings, Users } from "lucide-react"

const navItems = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Projects", icon: FolderKanban },
  { label: "Issues", icon: MessageSquareText },
  { label: "Members", icon: Users },
  { label: "Settings", icon: Settings },
]

type AppSidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  return (
    <aside
      className={[
        "shrink-0 border-r border-white/10 bg-[#0f1327] text-white transition-all duration-200",
        collapsed ? "w-21" : "w-70",
      ].join(" ")}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-3">
        {!collapsed && <span className="text-[15px] font-semibold tracking-tight text-white">IssueForge</span>}

        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggle}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 bg-white/4 text-white/75 transition-colors hover:bg-white/8 hover:text-white"
        >
          <ChevronLeft className={collapsed ? "rotate-180" : ""} size={16} />
        </button>
      </div>

      <nav className="space-y-2 p-3">
        {navItems.map(({ label, icon: Icon }) => {
          const active = label === "Overview"

          return (
            <button
              key={label}
              type="button"
              className={[
                "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-[15px] font-medium transition-colors",
                active ? "bg-white/6 text-white" : "text-white/75 hover:bg-white/6 hover:text-white",
                collapsed && "justify-center px-2",
              ].join(" ")}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}