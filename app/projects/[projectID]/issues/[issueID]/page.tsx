"use client"

import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import CommentBox from "@/components/comments/CommentBox"
import CommentCard from "@/components/comments/CommentCard"
import IssueActivity, {
    type IssueActivityItem,
} from "@/components/issues/IssueActivity"
import IssueActivityTab, {
    type IssueActivityTabItem,
} from "@/components/issues/IssueActivityTab"
import IssueDate from "@/components/issues/IssueDate"
import IssueDetails, { type IssueAttachment } from "@/components/issues/IssueDetails"
import IssueStatusAndPriority, {
    type IssuePriority,
    type IssueStatus,
} from "@/components/issues/IssueStatusAndPriority"
import IssueTabs, { type IssueTabKey } from "@/components/issues/IssueTabs"
import { useRouter } from "next/navigation"
import { getIssueById, updateIssueDetails, updateIssuePriority, updateIssueStatus, deleteIssue } from "@/services/issues.service"
import { listIssueActivities } from "@/services/activities.service"
import { getProjectById } from "@/services/projects.service"
import { me } from "@/services/account.service"
import {
    createAttachment,
    deleteAttachment,
    listIssueAttachments,
} from "@/services/attachments.service"
import { useComments, type CommentViewModel } from "@/hooks/use-comments"
import { useLabels } from "@/hooks/use-labels"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"

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
    const status = value?.toUpperCase()

    if (status === "DONE") return "DONE"
    if (status === "IN_PROGRESS") return "IN_PROGRESS"
    return "TODO"
}

function normalizePriority(value?: string): IssuePriority {
    const priority = value?.toUpperCase()

    if (priority === "HIGH") return "HIGH"
    if (priority === "MEDIUM") return "MEDIUM"
    return "LOW"
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
    const [status, setStatus] = useState<IssueStatus>("TODO")
    const [priority, setPriority] = useState<IssuePriority>("LOW")
    const [assigneeLabel, setAssigneeLabel] = useState("Unassigned")
    const [assigneeEmail, setAssigneeEmail] = useState<string | undefined>()
    const [projectName, setProjectName] = useState("Project")
    const [createdAt, setCreatedAt] = useState<string | undefined>()
    const [updatedAt, setUpdatedAt] = useState<string | undefined>()
    const [activity, setActivity] = useState<IssueActivityTabItem[]>([])
    const [activeTab, setActiveTab] = useState<IssueTabKey>("Details")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // ── Permission state ───────────────────────────────────────────────────────
    const [currentUserId, setCurrentUserId] = useState<string | number | null>(null)
    const [issueAssigneeId, setIssueAssigneeId] = useState<string | number | null>(null)
    const [issueCreatedBy, setIssueCreatedBy] = useState<string | number | null>(null)
    const [projectLeadId, setProjectLeadId] = useState<string | number | null>(null)
    const [attachments, setAttachments] = useState<IssueAttachment[]>([])
    const [isUploadingAttachment, setIsUploadingAttachment] = useState(false)
    const [deletingAttachmentId, setDeletingAttachmentId] = useState<string | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [isSavingEdit, setIsSavingEdit] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeletingIssue, setIsDeletingIssue] = useState(false)
    const router = useRouter()

    // ── Comments ──────────────────────────────────────────────────────────────
    const {
        comments,
        isSubmitting,
        error: commentsError,
        submitComment,
        editComment,
        removeComment,
        reload: reloadComments,
    } = useComments(issueID, currentUserId)
    const {
        projectLabels,
        issueLabels,
        isLoading: isLoadingLabels,
        isUpdating: isUpdatingLabels,
        attachLabels,
        removeLabel,
    } = useLabels(projectID, issueID)
    const [commentText, setCommentText] = useState("")
    const [replyToCommentId, setReplyToCommentId] = useState<string | number | null>(null)
    const [commentAttachment, setCommentAttachment] = useState<File | null>(null)
    const [expandedCommentIds, setExpandedCommentIds] = useState<Set<string>>(new Set())

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

                const [issue, issueActivities, project, currentUser, issueAttachments] = await Promise.all([
                    getIssueById(resolvedIssueId),
                    listIssueActivities(resolvedIssueId),
                    getProjectById(resolvedProjectID),
                    me(),
                    listIssueAttachments(resolvedIssueId),
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

                // ── Permission data ────────────────────────────────────────
                setCurrentUserId(currentUser?.id ?? null)
                setIssueAssigneeId(issue.assigned_to ?? null)
                setIssueCreatedBy(issue.created_by ?? issue.creator_id ?? null)
                setProjectLeadId(project.lead_id ?? null)
                setAttachments(
                    issueAttachments.map((attachment) => ({
                        id: String(attachment.id),
                        name: attachment.original_name,
                        url: attachment.url,
                    }))
                )

                setActivity(
                    issueActivities.map((item) => ({
                        id: item.id,
                        actor: item.actor_name ?? (item.actor_id ? `User #${item.actor_id}` : "System"),
                        action: item.activity_type,
                        details: item.field_name
                            ? `${item.field_name}: ${item.old_value ?? "—"} → ${item.new_value ?? "—"}`
                            : undefined,
                        type: mapActivityType(item.activity_type),
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
                message: item.details ? `${item.action} — ${item.details}` : item.action,
                timestamp: item.timestamp,
            })),
        [activity]
    )

    const handleStatusChange = async (nextStatus: IssueStatus) => {
        if (!issueID) return

        const prev = status
        setStatus(nextStatus)

        try {
            await updateIssueStatus(issueID, nextStatus)
            toast.success("Status updated", `Issue status set to ${nextStatus.replace("_", " ")}.`)
        } catch (err) {
            setStatus(prev)
            toast.error("Failed to update status", err instanceof Error ? err.message : "Unable to update issue status.")
        }
    }

    const handlePriorityChange = async (nextPriority: IssuePriority) => {
        if (!issueID) return

        const prev = priority
        setPriority(nextPriority)

        try {
            await updateIssuePriority(issueID, nextPriority)
            toast.success("Priority updated", `Issue priority set to ${nextPriority}.`)
        } catch (err) {
            setPriority(prev)
            toast.error("Failed to update priority", err instanceof Error ? err.message : "Unable to update issue priority.")
        }
    }

    const canEditDetails =
        currentUserId !== null &&
        (String(currentUserId) === String(issueCreatedBy) ||
            String(currentUserId) === String(projectLeadId))

    function handleOpenEditDialog() {
        setEditTitle(issueTitle)
        setEditDescription(issueDescription)
        setIsEditDialogOpen(true)
    }

    async function handleSaveIssueDetails() {
        if (!issueID || editTitle.trim().length < 8 || editDescription.trim().length < 10) return

        setIsSavingEdit(true)
        try {
            const updatedIssue = await updateIssueDetails(issueID, {
                title: editTitle.trim(),
                description: editDescription.trim(),
            })
            setIssueTitle(updatedIssue.title)
            setIssueDescription(updatedIssue.description ?? "")
            setUpdatedAt(updatedIssue.updated_at)
            setIsEditDialogOpen(false)
            toast.success("Issue updated", "Issue details saved successfully.")
        } catch (err) {
            toast.error("Failed to update issue", err instanceof Error ? err.message : "Unable to update issue details.")
        } finally {
            setIsSavingEdit(false)
        }
    }

    async function handleDeleteIssue() {
        if (!issueID || !projectID) return
        setIsDeletingIssue(true)
        try {
            await deleteIssue(issueID)
            toast.success("Issue deleted", "Issue was deleted successfully.")
            router.push(`/projects/${projectID}`)
        } catch (err) {
            toast.error("Failed to delete issue", err instanceof Error ? err.message : "Unable to delete issue.")
            setIsDeletingIssue(false)
            setIsDeleteDialogOpen(false)
        }
    }

    const handleUploadImages = async (images: Array<{ file: File; blob: Blob }>) => {
        if (!issueID) return

        setIsUploadingAttachment(true)
        try {
            const uploaded = await Promise.all(
                images.map(({ file, blob }) => {
                    const formData = new FormData()
                    formData.append("file", blob, file.name)
                    return createAttachment(issueID, formData)
                })
            )
            setAttachments((current) => [
                ...current,
                ...uploaded.map((attachment, index) => ({
                    id: String(attachment.id),
                    name: attachment.original_name,
                    url: attachment.url,
                    previewUrl: URL.createObjectURL(images[index].blob),
                })),
            ])
            toast.success("Attachment uploaded", "Image uploaded successfully.")
        } catch (err) {
            toast.error("Upload failed", err instanceof Error ? err.message : "Unable to upload attachment.")
            throw err
        } finally {
            setIsUploadingAttachment(false)
        }
    }

    const handleDeleteAttachment = async (attachmentId: string) => {
        setDeletingAttachmentId(attachmentId)
        try {
            await deleteAttachment(attachmentId)
            setAttachments((current) => current.filter((attachment) => attachment.id !== attachmentId))
            toast.success("Attachment deleted", "Attachment removed.")
        } catch (err) {
            toast.error("Failed to delete attachment", err instanceof Error ? err.message : "Unable to delete attachment.")
            throw err
        } finally {
            setDeletingAttachmentId(null)
        }
    }

    async function handleSubmitComment(parentCommentId?: string | number) {
        try {
            const created = await submitComment(commentText, parentCommentId)
            if (!created) return

            if (commentAttachment && issueID) {
                const formData = new FormData()
                formData.append("file", commentAttachment)
                formData.append("comment_id", String(created.id))
                await createAttachment(issueID, formData)
                await reloadComments()
            }

            setCommentText("")
            setReplyToCommentId(null)
            setCommentAttachment(null)
        } catch (err) {
            toast.error("Failed to post comment", err instanceof Error ? err.message : "Unable to post comment.")
        }
    }

    function toggleCommentReplies(commentId: string | number) {
        setExpandedCommentIds((current) => {
            const next = new Set(current)
            const key = String(commentId)
            if (next.has(key)) next.delete(key)
            else next.add(key)
            return next
        })
    }

    function renderCommentTree(comment: CommentViewModel, allComments: CommentViewModel[]): ReactNode {
        const replies = allComments.filter(
            (candidate) => String(candidate.parentCommentId) === String(comment.id)
        )
        const replyComposer = replyToCommentId !== null && String(replyToCommentId) === String(comment.id) ? (
            <div className="mt-2">
                <CommentBox
                    value={commentText}
                    onChange={setCommentText}
                    onImageSelect={setCommentAttachment}
                    placeholder={`Reply to ${comment.authorName}`}
                    selectedFileName={commentAttachment?.name}
                    onSubmit={() => handleSubmitComment(comment.id)}
                    isSubmitting={isSubmitting}
                />
            </div>
        ) : null

        return (
            <CommentCard
                key={comment.id}
                commentId={comment.id}
                authorName={comment.authorName}
                authorUsername={comment.authorUsername}
                authorInitials={comment.authorInitials}
                content={comment.content}
                relativeTime={comment.relativeTime}
                isAuthor={currentUserId !== null && String(comment.authorId) === String(currentUserId)}
                isEdited={comment.isEdited}
                attachments={comment.attachments}
                isUpdating={isSubmitting}
                replyCount={replies.length}
                isRepliesOpen={expandedCommentIds.has(String(comment.id))}
                onToggleReplies={() => toggleCommentReplies(comment.id)}
                replyComposer={replyComposer}
                onReply={() => {
                    setReplyToCommentId(comment.id)
                    setCommentText("")
                    setCommentAttachment(null)
                    setExpandedCommentIds((current) => new Set(current).add(String(comment.id)))
                }}
                onEdit={editComment}
                onDelete={removeComment}
            >
                {replies.map((reply) => renderCommentTree(reply, allComments))}
            </CommentCard>
        )
    }

    const renderTabContent = () => {
        if (activeTab === "Details") {
            return (
                <IssueDetails
                    title={issueTitle}
                    description={issueDescription}
                    attachments={attachments}
                    labels={issueLabels}
                    availableLabels={projectLabels}
                    isUploadingAttachment={isUploadingAttachment}
                    isLoadingLabels={isLoadingLabels}
                    isUpdatingLabels={isUpdatingLabels}
                    deletingAttachmentId={deletingAttachmentId}
                    onDeleteAttachment={handleDeleteAttachment}
                    onAttachLabels={attachLabels}
                    onRemoveLabel={removeLabel}
                    onUploadImages={handleUploadImages}
                />
            )
        }

        if (activeTab === "Comments") {
            return (
                <div className="flex flex-col gap-6">
                    {/* ── Comment box ── */}
                    {replyToCommentId === null && <CommentBox
                        value={commentText}
                        onChange={setCommentText}
                        onImageSelect={setCommentAttachment}
                        placeholder="Write a comment"
                        selectedFileName={commentAttachment?.name}
                        onSubmit={() => handleSubmitComment()}
                        isSubmitting={isSubmitting}
                    />}

                    {/* ── Comment list ── */}
                    {comments.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-white/10 py-8 text-center text-xs text-[#94A3B8]">
                            No comments yet. Be the first to comment.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {comments
                                .filter((comment) => !comment.parentCommentId)
                                .map((comment) => renderCommentTree(comment, comments))}
                        </div>
                    )}
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
                                            onClick={handleOpenEditDialog}
                                            disabled={!canEditDetails || isSavingEdit}
                                            title={canEditDetails ? "Edit issue details" : "Only the issue creator or project lead can edit this issue"}
                                            className="inline-flex h-8 items-center rounded-md border border-[#27272A] bg-[#18181B] px-3 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46]"
                                        >
                                            {isSavingEdit ? "Saving…" : "Edit"}
                                        </button>

                                        {canEditDetails && (
                                            <button
                                                type="button"
                                                onClick={() => setIsDeleteDialogOpen(true)}
                                                disabled={isDeletingIssue}
                                                className="inline-flex h-8 items-center rounded-md border border-[#27272A] bg-[#18181B] px-3 text-xs font-medium text-[#EF4444] transition-colors hover:border-[#EF4444]/50 hover:bg-[#EF4444]/10"
                                            >
                                                {isDeletingIssue ? "Deleting…" : "Delete"}
                                            </button>
                                        )}
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
                                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${status === "IN_PROGRESS"
                                                ? "bg-[#CA8A04]"
                                                : status === "DONE"
                                                    ? "bg-[#22C55E]"
                                                    : "bg-[#71717A]"
                                                }`}
                                        />
                                        {status === "IN_PROGRESS"
                                            ? "In Progress"
                                            : status === "DONE"
                                                ? "Done"
                                                : "Todo"}
                                    </span>

                                    <span className="inline-flex h-7 items-center gap-2 rounded-md border border-[#27272A] bg-[#101012] px-3 text-[11px] font-medium text-[#D4D4D8]">
                                        <span
                                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${priority === "HIGH"
                                                ? "bg-[#EF4444]"
                                                : priority === "MEDIUM"
                                                    ? "bg-[#CA8A04]"
                                                    : "bg-[#71717A]"
                                                }`}
                                        />
                                        {priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}
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

                        <Dialog
                            open={isEditDialogOpen}
                            onOpenChange={(open) => {
                                if (!isSavingEdit) setIsEditDialogOpen(open)
                            }}
                        >
                            <DialogContent className="border border-[#27272A] bg-[#0E0E11] text-[#E2E8F0] shadow-2xl sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-[#E2E8F0]">Edit issue</DialogTitle>
                                    <DialogDescription className="text-[#94A3B8]">
                                        Update the issue title and description.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="edit-issue-title" className="text-xs font-medium text-[#94A3B8]">
                                            Title
                                        </label>
                                        <input
                                            id="edit-issue-title"
                                            value={editTitle}
                                            onChange={(event) => setEditTitle(event.target.value)}
                                            disabled={isSavingEdit}
                                            className="w-full rounded-md border border-[#27272A] bg-[#18181B] px-3 py-2 text-sm text-[#E2E8F0] outline-none placeholder:text-[#52525B] focus:border-[#3F3F46] disabled:opacity-50"
                                        />
                                        <p className="text-[11px] text-[#71717A]">Use 8 to 50 characters.</p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="edit-issue-description" className="text-xs font-medium text-[#94A3B8]">
                                            Description
                                        </label>
                                        <textarea
                                            id="edit-issue-description"
                                            value={editDescription}
                                            onChange={(event) => setEditDescription(event.target.value)}
                                            disabled={isSavingEdit}
                                            className="min-h-32 w-full resize-y rounded-md border border-[#27272A] bg-[#18181B] px-3 py-2 text-sm leading-6 text-[#E2E8F0] outline-none placeholder:text-[#52525B] focus:border-[#3F3F46] disabled:opacity-50"
                                        />
                                        <p className="text-[11px] text-[#71717A]">Use 10 to 300 characters.</p>
                                    </div>
                                </div>

                                <DialogFooter className="border-t border-[#27272A] bg-[#09090B]">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditDialogOpen(false)}
                                        disabled={isSavingEdit}
                                        className="rounded-md border border-[#27272A] bg-transparent px-3 py-2 text-xs font-medium text-[#94A3B8] transition-colors hover:bg-[#18181B] hover:text-[#E2E8F0] disabled:opacity-40"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveIssueDetails}
                                        disabled={isSavingEdit || editTitle.trim().length < 8 || editDescription.trim().length < 10}
                                        className="rounded-md border border-[#3F3F46] bg-[#27272A] px-3 py-2 text-xs font-medium text-[#E2E8F0] transition-colors hover:bg-[#3F3F46] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {isSavingEdit ? "Saving…" : "Save changes"}
                                    </button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogContent className="max-w-md border-[#27272A] bg-[#0E0E11] text-[#E2E8F0]">
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-semibold text-[#E2E8F0]">
                                        Delete issue #{issueID}?
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-[#94A3B8]">
                                        This issue will be removed from the project and moved to the Archive. You can view and restore it anytime from the Archive page.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsDeleteDialogOpen(false)}
                                        disabled={isDeletingIssue}
                                        className="rounded-md border border-[#27272A] bg-[#18181B] px-3 py-1.5 text-xs font-medium text-[#E2E8F0] hover:border-[#3F3F46]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeleteIssue}
                                        disabled={isDeletingIssue}
                                        className="rounded-md border border-[#EF4444]/40 bg-[#EF4444]/20 px-3 py-1.5 text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/30"
                                    >
                                        {isDeletingIssue ? "Deleting…" : "Delete issue"}
                                    </button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

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
                            disabled={
                                currentUserId === null ||
                                (
                                    String(currentUserId) !== String(issueAssigneeId) &&
                                    String(currentUserId) !== String(issueCreatedBy) &&
                                    String(currentUserId) !== String(projectLeadId)
                                )
                            }
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
