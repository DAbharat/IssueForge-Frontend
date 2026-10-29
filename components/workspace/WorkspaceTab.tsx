"use client"

export const WORKSPACE_TABS = [
  "General",
  "Members",
  "Projects",
  "Invitations",
  "Analytics",
  "Danger Zone",
] as const

export type WorkspaceTabKey = (typeof WORKSPACE_TABS)[number]

type WorkspaceTabsProps = {
  activeTab: WorkspaceTabKey
  onTabChange: (tab: WorkspaceTabKey) => void
  isAdmin?: boolean
}

export default function WorkspaceTabs({
  activeTab,
  onTabChange,
  isAdmin = false,
}: WorkspaceTabsProps) {
  const visibleTabs = WORKSPACE_TABS.filter((tab) => {
    if (tab === "Danger Zone" || tab === "Analytics") {
      return Boolean(isAdmin)
    }
    return true
  })

  return (
    <div
      className="flex items-end gap-7 border-b border-[#27272A] pb-2"
      role="tablist"
      aria-label="Workspace sections"
    >
      {visibleTabs.map((tab) => {
        const isActive = activeTab === tab

        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab)}
            className={[
              "relative pb-2 text-sm font-medium transition-colors",
              isActive
                ? "text-[#E2E8F0]"
                : "text-[#94A3B8] hover:text-[#E2E8F0]",
            ].join(" ")}
          >
            {tab}

            {isActive && (
              <span className="absolute inset-x-0 -bottom-2.25 h-0.5 rounded-full bg-[#E2E8F0]" />
            )}
          </button>
        )
      })}
    </div>
  )
}