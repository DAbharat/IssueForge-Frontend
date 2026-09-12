"use client"

import { useEffect, useMemo, useState } from "react"
import IssueActivity, {
    type IssueActivityItem,
} from "@/components/issues/IssueActivity"
import IssueActivityTab, {
    type IssueActivityTabItem,
} from "@/components/issues/IssueActivityTab"
import IssueDate from "@/components/issues/IssueDate"
import IssueDetails from "@/components/issues/IssueDetails"
import IssueStatusAndPriority, {
    type IssuePriority,
    type IssueStatus,
} from "@/components/issues/IssueStatusAndPriority"
import IssueTabs, { type IssueTabKey } from "@/components/issues/IssueTabs"
import {
    getIssueById,
    updateIssuePriority,
    updateIssueStatus,
} from "@/services/issues.service"
import { listIssueActivities } from "@/services/activities.service"
import { getProjectById } from "@/services/projects.service"

function formatDate(dateString?: string) {
    if (!dateString) return "—"

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(dateString))
}

function normalizeStatus(value?: string): IssueStatus {
    const status = value?.toLowerCase()

    if (status === "done") return "done"
    if (status === "in_progress" || status === "in progress") return "in_progress"
    return "todo"
}

function normalizePriority(value?: string): IssuePriority {
    const priority = value?.toLowerCase()

    if (priority === "high") return "high"
    if (priority === "medium") return "medium"
    return "low"
}

function mapActivityType(action?: string): IssueActivityTabItem["type"] {
    const text = (action ?? "").toLowerCase()

    if (text.includes("comment")) return "comment"
    if (text.includes("assignee") || text.includes("assigned")) return "assignee"
    if (text.includes("status")) return "status"
    return "update"
}

export default function IssuePage({
    params,
}: {
    params: Promise<{ projectID: string; issueID: string }>
}) {
    const [projectID, setProjectID] = useState<string | null>(null)
    const [issueID, setIssueID] = useState<string | null>(null)
    const [issueTitle, setIssueTitle] = useState("")
    const [issueDescription, setIssueDescription] = useState("")
    const [status, setStatus] = useState<IssueStatus>("todo")
    const [priority, setPriority] = useState<IssuePriority>("low")
    const [assigneeLabel, setAssigneeLabel] = useState("Unassigned")
    const [assigneeEmail, setAssigneeEmail] = useState<string | undefined>()
    const [projectName, setProjectName] = useState("Project")
    const [createdAt, setCreatedAt] = useState<string | undefined>()
    const [updatedAt, setUpdatedAt] = useState<string | undefined>()
    const [activity, setActivity] = useState<IssueActivityTabItem[]>([])
    const [activeTab, setActiveTab] = useState<IssueTabKey>("Details")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        params.then((p) => {
            setProjectID(p.projectID)
            setIssueID(p.issueID)
        })
    }, [params])

    useEffect(() => {
        if (!issueID || !projectID) return

        const resolvedProjectID = projectID
        let cancelled = false

        async function loadIssue() {
            setIsLoading(true)
            setError(null)

            try {
                const resolvedIssueId = issueID
                if (!resolvedIssueId) return

                const [issue, issueActivities, project] = await Promise.all([
                    getIssueById(resolvedIssueId),
                    listIssueActivities(resolvedIssueId),
                    getProjectById(resolvedProjectID),
                ])

                if (cancelled) return

                setIssueTitle(issue.title || "Untitled issue")
                setIssueDescription(issue.description || "")
                setStatus(normalizeStatus(issue.status))
                setPriority(normalizePriority(issue.priority))
                setAssigneeLabel(
                    issue.assignee_name ||
                    (issue.assigned_to ? `Assignee #${issue.assigned_to}` : "Unassigned")
                )
                setProjectName(project.name)
                setCreatedAt(issue.created_at)
                setUpdatedAt(issue.updated_at)

                setActivity(
                    issueActivities.map((item) => ({
                        id: item.id,
                        actor: item.user_id ? `User #${item.user_id}` : "System",
                        action: item.action,
                        details: item.details,
                        type: mapActivityType(item.action),
                        timestamp: formatDate(item.created_at),
                    }))
                )
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error ? err.message : "Failed to load issue details"
                    )
                }
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        loadIssue()

        return () => {
            cancelled = true
        }
    }, [issueID, projectID])

    const activitySidebar = useMemo<IssueActivityItem[]>(
        () =>
            activity.map((item) => ({
                id: item.id,
                actor: item.actor,
                message: item.details ? `${item.action} ${item.details}` : item.action,
                timestamp: item.timestamp,
            })),
        [activity]
    )

    const handleStatusChange = async (nextStatus: IssueStatus) => {
        if (!issueID) return

        setStatus(nextStatus)

        try {
            await updateIssueStatus(issueID, nextStatus)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to update issue status")
        }
    }

    const handlePriorityChange = async (nextPriority: IssuePriority) => {
        if (!issueID) return

        setPriority(nextPriority)

        try {
            await updateIssuePriority(issueID, nextPriority)
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to update issue priority"
            )
        }
    }

    const renderTabContent = () => {
        if (activeTab === "Details") {
            return <IssueDetails title={issueTitle} description={issueDescription} />
        }

        if (activeTab === "Comments") {
            return (
                <div className="rounded-xl border border-[#27272A] bg-[#101012] p-4 text-xs text-[#71717A]">
                    No comments yet.
                </div>
            )
        }

        return <IssueActivityTab activities={activity} />
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#000000] p-6 text-[#E2E8F0]">
                Loading issue...
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#000000] p-6 text-[#E2E8F0]">
                {error}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#000000]">
            <div className="mx-auto w-full max-w-7xl px-6 py-3 sm:px-8 lg:px-10">
                {/* Everything below "Back to issues" is one grid — header lives in the
          left column so both columns start at the same y */}
                <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
                    {/* Main Column */}
                    <main className="min-w-0">
                        {/* Issue Header */}
                        <header className="border-b border-[#27272A] pb-8">
                            <div className="flex flex-col gap-4">
                                {/* Title + actions */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-baseline gap-3">
                                        <span className="shrink-0 text-2xl font-medium leading-tight text-[#52525B]">
                                            #{issueID}
                                        </span>
                                        <h1 className="min-w-0 text-2xl font-semibold leading-tight tracking-tight text-[#E2E8F0]">
                                            {issueTitle}
                                        </h1>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#27272A] bg-[#101012] text-[#A1A1AA] transition-colors hover:border-[#3F3F46] hover:text-[#E2E8F0]"
                                        >
                                            <span className="text-sm">•••</span>
                                        </button>

                                        <button
                                            type="button"
                                            className="inline-flex h-8 items-center rounded-md border border-[#27272A] bg-[#18181B] px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46]"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>

                                {/* Description */}
                                {issueDescription ? (
                                    <p className="max-w-3xl text-sm leading-6 text-[#71717A]">
                                        {issueDescription}
                                    </p>
                                ) : null}

                                {/* Status / Priority */}
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="inline-flex h-7 items-center gap-2 rounded-md border border-[#27272A] bg-[#101012] px-3 text-[11px] font-medium text-[#D4D4D8]">
                                        <span
                                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${status === "in_progress"
                                                ? "bg-[#CA8A04]"
                                                : status === "done"
                                                    ? "bg-[#22C55E]"
                                                    : "bg-[#71717A]"
                                                }`}
                                        />
                                        {status === "in_progress"
                                            ? "In Progress"
                                            : status === "done"
                                                ? "Done"
                                                : "Todo"}
                                    </span>

                                    <span className="inline-flex h-7 items-center gap-2 rounded-md border border-[#27272A] bg-[#101012] px-3 text-[11px] font-medium text-[#D4D4D8]">
                                        <span
                                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${priority === "high"
                                                ? "bg-[#EF4444]"
                                                : priority === "medium"
                                                    ? "bg-[#CA8A04]"
                                                    : "bg-[#71717A]"
                                                }`}
                                        />
                                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                    </span>
                                </div>

                                <div className="border-t border-[#27272A]" />

                                {/* Metadata — single row, icon-led groups */}
                                <div className="flex w-full items-stretch justify-between text-xs">
                                    {/* Assignee */}
                                    <div className="flex flex-1 items-center gap-2.5">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#27272A] bg-[#18181B] text-[10px] font-semibold text-[#A1A1AA]">
                                            {assigneeLabel === "Unassigned"
                                                ? "U"
                                                : assigneeLabel
                                                    .split(" ")
                                                    .slice(0, 2)
                                                    .map((part) => part[0])
                                                    .join("")}
                                        </div>
                                        <div className="flex flex-col justify-center gap-0.5">
                                            <span className="text-xs font-medium leading-none text-[#D4D4D8]">
                                                {assigneeLabel}
                                            </span>
                                            <span className="text-[10px] leading-none text-[#52525B]">
                                                Assignee
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mx-4 w-px shrink-0 self-stretch bg-[#27272A]" />

                                    {/* Created */}
                                    <div className="flex flex-1 items-center gap-2.5">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.75"
                                            className="h-4 w-4 shrink-0 text-[#52525B]"
                                        >
                                            <rect x="3" y="4" width="18" height="18" rx="2" />
                                            <path d="M16 2v4M8 2v4M3 10h18" />
                                        </svg>
                                        <div className="flex flex-col justify-center gap-0.5">
                                            <span className="text-[10px] leading-none text-[#52525B]">Created</span>
                                            <span className="text-xs leading-none text-[#A1A1AA]">
                                                {formatDate(createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mx-4 w-px shrink-0 self-stretch bg-[#27272A]" />

                                    {/* Updated */}
                                    <div className="flex flex-1 items-center gap-2.5">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.75"
                                            className="h-4 w-4 shrink-0 text-[#52525B]"
                                        >
                                            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                                            <path d="M21 3v6h-6" />
                                        </svg>
                                        <div className="flex flex-col justify-center gap-0.5">
                                            <span className="text-[10px] leading-none text-[#52525B]">Updated</span>
                                            <span className="text-xs leading-none text-[#A1A1AA]">
                                                {formatDate(updatedAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mx-4 w-px shrink-0 self-stretch bg-[#27272A]" />

                                    {/* Labels */}
                                    <div className="flex flex-1 items-center gap-2.5">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.75"
                                            className="h-4 w-4 shrink-0 text-[#52525B]"
                                        >
                                            <path d="M20.59 13.41 12 22l-9-9V4h9l8.59 9.41z" />
                                            <circle cx="7" cy="7" r="1.5" />
                                        </svg>
                                        <div className="flex flex-col justify-center gap-0.5">
                                            <span className="text-[10px] leading-none text-[#52525B]">Labels</span>
                                            <span className="text-xs leading-none text-[#A1A1AA]">—</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Tabs */}
                        <div className="pt-10">
                            <IssueTabs activeTab={activeTab} onTabChange={setActiveTab} />
                        </div>

                        {/* Tab Content */}
                        <div className="pt-6">{renderTabContent()}</div>
                    </main>

                    {/* Sidebar — now a true grid sibling of `main`, so it starts at
            the same y-coordinate as the header above */}
                    <aside className="min-w-0 space-y-5">
                        <IssueStatusAndPriority
                            status={status}
                            priority={priority}
                            assignee={{
                                initials:
                                    assigneeLabel === "Unassigned"
                                        ? "U"
                                        : assigneeLabel
                                            .split(" ")
                                            .slice(0, 2)
                                            .map((part) => part[0])
                                            .join(""),
                                name: assigneeLabel,
                            }}
                            project={{
                                initials: projectName.slice(0, 2).toUpperCase(),
                                name: projectName,
                            }}
                            onStatusChange={handleStatusChange}
                            onPriorityChange={handlePriorityChange}
                        />
                        <IssueDate createdAt={formatDate(createdAt)} updatedAt={formatDate(updatedAt)} />
                        <IssueActivity activities={activitySidebar} />
                    </aside>
                </div>
            </div>
        </div>
    )
}
