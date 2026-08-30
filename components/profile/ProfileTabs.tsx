"use client"

export const PROFILE_TABS = ["Workspaces", "Projects", "Issues"] as const

export type ProfileTabKey = (typeof PROFILE_TABS)[number]

type ProfileTabsProps = {
  activeTab: ProfileTabKey
  onTabChange: (tab: ProfileTabKey) => void
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="grid grid-cols-3 items-end border-b border-[#222631] pb-2" role="tablist" aria-label="Profile sections">
      {PROFILE_TABS.map((tab) => {
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
