"use client"

export const PROJECT_TABS = ["Overview", "Issues", "Members"] as const

export type ProjectTabKey = (typeof PROJECT_TABS)[number]

type ProjectTabsProps = {
  activeTab: ProjectTabKey
  onTabChange: (tab: ProjectTabKey) => void
}

export default function ProjectTabs({ activeTab, onTabChange }: ProjectTabsProps) {
  return (
    <div className="grid grid-cols-3 items-end border-b border-[#222631] pb-2" role="tablist" aria-label="Project sections">
      {PROJECT_TABS.map((tab) => {
        const isActive = activeTab === tab

        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab)}
            className={[
              "relative flex items-center justify-center pb-2 text-sm font-medium transition-colors",
              isActive ? "text-[#E2E8F0]" : "text-[#94A3B8] hover:text-[#E2E8F0]",
            ].join(" ")}
          >
            {tab}
            {isActive && <span className="absolute inset-x-5 -bottom-2.25 h-0.5 rounded-full bg-[#E2E8F0]" />}
          </button>
        )
      })}
    </div>
  )
}

