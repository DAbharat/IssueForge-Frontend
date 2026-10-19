"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "@/components/ui/toast"
import {
    deleteComment,
    listIssueComments,
    createComment,
    updateComment,
    type Comment,
} from "@/services/comments.service"
import { listCommentAttachments, type Attachment } from "@/services/attachments.service"

// ─── Relative time helper ─────────────────────────────────────────────────────

function formatRelativeTime(dateString?: string): string {
    if (!dateString) return ""

    const diff = Date.now() - new Date(dateString).getTime()
    const minutes = Math.floor(diff / 60_000)
    const hours = Math.floor(diff / 3_600_000)
    const days = Math.floor(diff / 86_400_000)

    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hr ago`
    if (days === 1) return "1 day ago"
    return `${days} days ago`
}

// ─── Public shape returned by the hook ───────────────────────────────────────

export type CommentViewModel = {
    id: string | number
    authorId: string | number
    authorName: string
    authorUsername: string
    authorInitials: string
    content: string
    relativeTime: string
    parentCommentId?: string | number | null
    isEdited: boolean
    attachments: Attachment[]
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useComments(issueId: string | null, currentUserId?: string | number | null) {
    const [comments, setComments] = useState<CommentViewModel[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // ── Map raw API comment → view model ──────────────────────────────────────
    function toViewModel(c: Comment, attachments: Attachment[] = []): CommentViewModel {
        const name = c.author_name ?? `User #${c.author_id}`
        // Derive initials from name (up to 2 words)
        const initials = name
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("")

        return {
            id: String(c.id),
            authorId: c.author_id,
            authorName: name,
            // Username is not returned by the comment API; fall back to ID
            authorUsername: `user${c.author_id}`,
            authorInitials: initials,
            content: c.content,
            relativeTime: formatRelativeTime(c.created_at),
            parentCommentId: c.parent_comment_id,
            isEdited: Boolean(c.is_edited),
            attachments,
        }
    }

    // ── Load comments ─────────────────────────────────────────────────────────
    const loadComments = useCallback(async () => {
        if (!issueId) return

        setIsLoading(true)
        setError(null)

        try {
            const raw = await listIssueComments(issueId)
            const mapped = await Promise.all(
                raw.map(async (comment) => {
                    const attachments = await listCommentAttachments(comment.id).catch(() => [])
                    return toViewModel(comment, attachments)
                })
            )
            setComments(mapped)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load comments")
        } finally {
            setIsLoading(false)
        }
    }, [issueId])

    useEffect(() => {
        // Initial server-state load for this issue.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadComments()
    }, [loadComments])

    // ── Submit a new comment ──────────────────────────────────────────────────
    const submitComment = useCallback(
        async (content: string, parentCommentId?: string | number): Promise<CommentViewModel | null> => {
            if (!issueId || !content.trim()) return null

            setIsSubmitting(true)
            setError(null)

            try {
                const created = await createComment(issueId, {
                    content: content.trim(),
                    parent_comment_id: parentCommentId,
                })
                const viewModel = toViewModel(created)
                setComments((prev) => [...prev, viewModel])
                toast.success("Comment posted", "Your comment has been added.")
                return viewModel
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to post comment"
                setError(message)
                toast.error("Failed to post comment", message)
                return null
            } finally {
                setIsSubmitting(false)
            }
        },
        [issueId]
    )

    const editComment = useCallback(async (commentId: string | number, content: string) => {
        if (!content.trim()) return
        try {
            const updated = await updateComment(commentId, { content: content.trim() })
            setComments((current) => current.map((comment) =>
                String(comment.id) === String(commentId) ? toViewModel(updated, comment.attachments) : comment
            ))
            toast.success("Comment updated", "Your comment was edited successfully.")
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to update comment"
            toast.error("Failed to update comment", message)
            throw err
        }
    }, [])

    const removeComment = useCallback(async (commentId: string | number) => {
        try {
            await deleteComment(commentId)
            setComments((current) => current.filter((comment) => String(comment.id) !== String(commentId)))
            toast.success("Comment deleted", "Comment removed successfully.")
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to delete comment"
            toast.error("Failed to delete comment", message)
            throw err
        }
    }, [])

    return {
        comments,
        isLoading,
        isSubmitting,
        error,
        submitComment,
        editComment,
        removeComment,
        currentUserId,
        reload: loadComments,
    }
}
