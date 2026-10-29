"use client"

export const ISSUE_TABS = ["Details", "Comments", "Activity"] as const

export type IssueTabKey = (typeof ISSUE_TABS)[number]

export type IssueTabLabel = {
  id: string | number
  name: string
  color?: string
}

type IssueTabsProps = {
  activeTab: IssueTabKey
  onTabChange: (tab: IssueTabKey) => void
  labels?: IssueTabLabel[]
}

export default function IssueTabs({
  activeTab,
  onTabChange,
  labels = [],
}: IssueTabsProps) {
  return (
    <div
      className="grid grid-cols-3 items-end border-b border-[#27272A] pb-2"
      role="tablist"
      aria-label="Issue sections"
    >
      {ISSUE_TABS.map((tab) => {
        const isActive = activeTab === tab

        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab)}
            className={[
              "relative flex items-center justify-center gap-1.5 pb-2 text-sm font-medium transition-colors",
              isActive
                ? "text-[#E2E8F0]"
                : "text-[#94A3B8] hover:text-[#E2E8F0]",
            ].join(" ")}
          >
            <span>{tab}</span>

            {tab === "Details" && labels.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <span className="hidden sm:inline-flex items-center gap-1">
                  {labels.slice(0, 2).map((label) => (
                    <span
                      key={label.id}
                      className="inline-flex items-center gap-1 rounded-full border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[10px] font-medium text-[#D4D4D8]"
                    >
                      {label.color && (
                        <span
                          className="h-1.5 w-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: label.color }}
                        />
                      )}
                      <span className="max-w-[70px] truncate">{label.name}</span>
                    </span>
                  ))}
                  {labels.length > 2 && (
                    <span className="rounded-full border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[10px] text-[#A1A1AA]">
                      +{labels.length - 2}
                    </span>
                  )}
                </span>
                <span className="sm:hidden inline-flex items-center gap-1 rounded-full border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[10px] text-[#A1A1AA]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
                  {labels.length}
                </span>
              </span>
            )}

            {isActive && (
              <span className="absolute inset-x-5 -bottom-2.25 h-0.5 rounded-full bg-[#E2E8F0]" />
            )}
          </button>
        )
      })}
    </div>
  )
}