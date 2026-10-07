"use client"

export const WORKSPACE_TABS = [
  "General",
  "Members",
  "Projects",
  "Danger Zone",
] as const

export type WorkspaceTabKey = (typeof WORKSPACE_TABS)[number]

type WorkspaceTabsProps = {
  activeTab: WorkspaceTabKey
  onTabChange: (tab: WorkspaceTabKey) => void
}

export default function WorkspaceTabs({
  activeTab,
  onTabChange,
}: WorkspaceTabsProps) {
  return (
    <div
      className="flex items-end gap-7 border-b border-[#27272A] pb-2"
      role="tablist"
      aria-label="Workspace sections"
    >
      {WORKSPACE_TABS.map((tab) => {
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