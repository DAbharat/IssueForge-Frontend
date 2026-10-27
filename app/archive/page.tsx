"use client"

import { RefreshCw } from "lucide-react"
import { useArchive } from "@/hooks/use-archive"
import ArchiveSummaryCards from "@/components/archive/ArchiveSummaryCards"
import ArchiveTabs from "@/components/archive/ArchiveTabs"
import ArchiveSearch from "@/components/archive/ArchiveSearch"
import ArchivedWorkspacesTable from "@/components/archive/ArchivedWorkspacesTable"
import ArchivedProjectsTable from "@/components/archive/ArchivedProjectsTable"
import ArchivedIssuesTable from "@/components/archive/ArchivedIssuesTable"
import ArchivedAttachmentsTable from "@/components/archive/ArchivedAttachmentsTable"

export default function ArchivePage() {
    const {
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
    } = useArchive()

    const isSearching = Boolean(searchQuery.trim())

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#E2E8F0]">Archive</h1>
                    <p className="text-xs text-[#94A3B8]">
                        Manage and restore deleted workspaces, projects, issues, and attachments.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={reload}
                    disabled={isLoadingTab || isRestoring}
                    title="Refresh archive data"
                    className="inline-flex h-8 w-fit items-center gap-1.5 rounded-md border border-[#27272A] bg-[#18181B] px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46] disabled:opacity-40"
                >
                    <RefreshCw className={`h-3 w-3 ${isLoadingTab ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* 1. Summary Cards */}
            <ArchiveSummaryCards
                counts={counts}
                activeTab={activeTab}
                onTabSelect={setActiveTab}
                isLoading={isLoadingCounts}
            />

            {/* 2. Navigation Tabs */}
            <ArchiveTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={counts}
            />

            {/* 3. Search Bar */}
            <div className="flex items-center justify-between gap-4">
                <ArchiveSearch
                    value={searchQuery}
                    onChange={setSearchQuery}
                    activeTab={activeTab}
                />
            </div>

            {/* 4. Tab Content Table */}
            <div>
                {isLoadingTab ? (
                    <div className="flex h-48 items-center justify-center rounded-lg border border-[#27272A] bg-[#0E0E11] text-xs text-[#94A3B8]">
                        Loading {activeTab.toLowerCase()}…
                    </div>
                ) : (
                    <>
                        {activeTab === "Workspaces" && (
                            <ArchivedWorkspacesTable
                                workspaces={workspaces}
                                isRestoring={isRestoring}
                                restoringId={restoringId}
                                onRestore={(id, name) => handleRestore("workspace", id, name)}
                                isSearching={isSearching}
                                onClearSearch={() => setSearchQuery("")}
                            />
                        )}

                        {activeTab === "Projects" && (
                            <ArchivedProjectsTable
                                projects={projects}
                                isRestoring={isRestoring}
                                restoringId={restoringId}
                                onRestore={(id, name) => handleRestore("project", id, name)}
                                isSearching={isSearching}
                                onClearSearch={() => setSearchQuery("")}
                            />
                        )}

                        {activeTab === "Issues" && (
                            <ArchivedIssuesTable
                                issues={issues}
                                isRestoring={isRestoring}
                                restoringId={restoringId}
                                onRestore={(id, name) => handleRestore("issue", id, name)}
                                isSearching={isSearching}
                                onClearSearch={() => setSearchQuery("")}
                            />
                        )}

                        {activeTab === "Attachments" && (
                            <ArchivedAttachmentsTable
                                attachments={attachments}
                                isRestoring={isRestoring}
                                restoringId={restoringId}
                                onRestore={(id, name) => handleRestore("attachment", id, name)}
                                isSearching={isSearching}
                                onClearSearch={() => setSearchQuery("")}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
