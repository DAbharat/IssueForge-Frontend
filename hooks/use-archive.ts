"use client"

import { useCallback, useEffect, useState } from "react"
import {
    getArchiveCounts,
    listArchivedWorkspaces,
    listArchivedProjects,
    listArchivedIssues,
    listArchivedAttachments,
    type ArchiveCounts,
    type ArchivedWorkspace,
    type ArchivedProject,
    type ArchivedIssue,
    type ArchivedAttachment,
} from "@/services/archive.service"
import { restoreDeletedWorkspace } from "@/services/workspaces.service"
import { restoreProject } from "@/services/projects.service"
import { restoreDeletedIssue } from "@/services/issues.service"
import { useDebounce } from "@/hooks/use-debounce"
import { toast } from "@/components/ui/toast"

export const ARCHIVE_TABS = ["Workspaces", "Projects", "Issues", "Attachments"] as const
export type ArchiveTabKey = (typeof ARCHIVE_TABS)[number]

export function useArchive() {
    const [activeTab, setActiveTab] = useState<ArchiveTabKey>("Workspaces")
    const [searchQuery, setSearchQuery] = useState("")
    const debouncedSearch = useDebounce(searchQuery, 350)

    const [counts, setCounts] = useState<ArchiveCounts>({
        workspaces: 0,
        projects: 0,
        issues: 0,
        attachments: 0,
    })

    const [workspaces, setWorkspaces] = useState<ArchivedWorkspace[]>([])
    const [projects, setProjects] = useState<ArchivedProject[]>([])
    const [issues, setIssues] = useState<ArchivedIssue[]>([])
    const [attachments, setAttachments] = useState<ArchivedAttachment[]>([])

    const [isLoadingCounts, setIsLoadingCounts] = useState(true)
    const [isLoadingTab, setIsLoadingTab] = useState(true)
    const [isRestoring, setIsRestoring] = useState(false)
    const [restoringId, setRestoringId] = useState<string | number | null>(null)

    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const fetchCounts = useCallback(async () => {
        try {
            const data = await getArchiveCounts()
            setCounts(data ?? { workspaces: 0, projects: 0, issues: 0, attachments: 0 })
        } catch {
            setCounts({ workspaces: 0, projects: 0, issues: 0, attachments: 0 })
        } finally {
            setIsLoadingCounts(false)
        }
    }, [])

    const fetchTabData = useCallback(async (tab: ArchiveTabKey, search: string, signal?: AbortSignal) => {
        setIsLoadingTab(true)
        try {
            switch (tab) {
                case "Workspaces": {
                    const data = await listArchivedWorkspaces(search || undefined, signal)
                    if (!signal?.aborted) setWorkspaces(Array.isArray(data) ? data : [])
                    break
                }
                case "Projects": {
                    const data = await listArchivedProjects(search || undefined, signal)
                    if (!signal?.aborted) setProjects(Array.isArray(data) ? data : [])
                    break
                }
                case "Issues": {
                    const data = await listArchivedIssues(search || undefined, signal)
                    if (!signal?.aborted) setIssues(Array.isArray(data) ? data : [])
                    break
                }
                case "Attachments": {
                    const data = await listArchivedAttachments(search || undefined, signal)
                    if (!signal?.aborted) setAttachments(Array.isArray(data) ? data : [])
                    break
                }
            }
        } catch {
            if (!signal?.aborted) {
                switch (tab) {
                    case "Workspaces":
                        setWorkspaces([])
                        break
                    case "Projects":
                        setProjects([])
                        break
                    case "Issues":
                        setIssues([])
                        break
                    case "Attachments":
                        setAttachments([])
                        break
                }
            }
        } finally {
            if (!signal?.aborted) {
                setIsLoadingTab(false)
            }
        }
    }, [])

    // Initial counts fetch
    useEffect(() => {
        fetchCounts()
    }, [fetchCounts])

    // Tab or debounced search change with AbortController to cancel superseded calls
    useEffect(() => {
        const controller = new AbortController()
        fetchTabData(activeTab, debouncedSearch, controller.signal)

        return () => {
            controller.abort()
        }
    }, [activeTab, debouncedSearch, fetchTabData])

    const handleRestore = useCallback(
        async (type: "workspace" | "project" | "issue", id: string | number, name?: string) => {
            if (isRestoring) return

            setIsRestoring(true)
            setRestoringId(id)
            setError(null)
            setSuccessMessage(null)

            try {
                if (type === "workspace") {
                    await restoreDeletedWorkspace(id)
                } else if (type === "project") {
                    await restoreProject(id)
                } else if (type === "issue") {
                    await restoreDeletedIssue(id)
                }

                const msg = `${name ? `"${name}"` : "Item"} restored successfully.`
                setSuccessMessage(msg)
                toast.success("Restored successfully", msg)
                // Refresh list and counts
                await Promise.all([fetchCounts(), fetchTabData(activeTab, debouncedSearch)])
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Failed to restore item."
                setError(msg)
                toast.error("Restore failed", msg)
            } finally {
                setIsRestoring(false)
                setRestoringId(null)
            }
        },
        [activeTab, debouncedSearch, fetchCounts, fetchTabData, isRestoring]
    )

    const reload = useCallback(() => {
        fetchCounts()
        fetchTabData(activeTab, debouncedSearch)
    }, [activeTab, debouncedSearch, fetchCounts, fetchTabData])

    return {
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        counts,
        workspaces,
        projects,
        issues,
        attachments,
        isLoadingCounts,
        isLoadingTab,
        isRestoring,
        restoringId,
        error,
        setError,
        successMessage,
        setSuccessMessage,
        handleRestore,
        reload,
    }
}
