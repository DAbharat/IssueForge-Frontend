"use client"

export const PROJECT_TABS = ["Overview", "Issues", "Members", "Activity", "Analytics", "Settings"] as const

export type ProjectTabKey = (typeof PROJECT_TABS)[number]

type ProjectTabsProps = {
  activeTab: ProjectTabKey
  onTabChange: (tab: ProjectTabKey) => void
  canViewAnalytics?: boolean
}

export default function ProjectTabs({
  activeTab,
  onTabChange,
  canViewAnalytics = true,
}: ProjectTabsProps) {
  const visibleTabs = PROJECT_TABS.filter((tab) => {
    if (tab === "Analytics") {
      return canViewAnalytics
    }
    return true
  })

  return (
    <div className="overflow-x-auto" role="tablist" aria-label="Project sections">
      <div className="flex min-w-[36rem] items-end border-b border-[#27272A] pb-2">
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
                "relative flex flex-1 items-center justify-center pb-2 text-sm font-medium transition-colors",
                isActive ? "text-[#E2E8F0]" : "text-[#94A3B8] hover:text-[#E2E8F0]",
              ].join(" ")}
            >
              {tab}
              {isActive && <span className="absolute inset-x-5 -bottom-2.25 h-0.5 rounded-full bg-[#E2E8F0]" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

