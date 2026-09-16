"use client"

import { useCallback, useEffect, useState } from "react"
import {
    listIssueComments,
    createComment,
    type Comment,
} from "@/services/comments.service"

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
    id: string
    authorName: string
    authorUsername: string
    authorInitials: string
    content: string
    relativeTime: string
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useComments(issueId: string | null) {
    const [comments, setComments] = useState<CommentViewModel[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // ── Map raw API comment → view model ──────────────────────────────────────
    function toViewModel(c: Comment): CommentViewModel {
        const name = c.author_name ?? `User #${c.author_id}`
        // Derive initials from name (up to 2 words)
        const initials = name
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("")

        return {
            id: String(c.id),
            authorName: name,
            // Username is not returned by the comment API; fall back to ID
            authorUsername: `user${c.author_id}`,
            authorInitials: initials,
            content: c.content,
            relativeTime: formatRelativeTime(c.created_at),
        }
    }

    // ── Load comments ─────────────────────────────────────────────────────────
    const loadComments = useCallback(async () => {
        if (!issueId) return

        setIsLoading(true)
        setError(null)

        try {
            const raw = await listIssueComments(issueId)
            setComments(raw.map(toViewModel))
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load comments")
        } finally {
            setIsLoading(false)
        }
    }, [issueId])

    useEffect(() => {
        loadComments()
    }, [loadComments])

    // ── Submit a new comment ──────────────────────────────────────────────────
    const submitComment = useCallback(
        async (content: string): Promise<boolean> => {
            if (!issueId || !content.trim()) return false

            setIsSubmitting(true)
            setError(null)

            try {
                const created = await createComment(issueId, { content: content.trim() })
                setComments((prev) => [...prev, toViewModel(created)])
                return true
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to post comment")
                return false
            } finally {
                setIsSubmitting(false)
            }
        },
        [issueId]
    )

    return {
        comments,
        isLoading,
        isSubmitting,
        error,
        submitComment,
        reload: loadComments,
    }
}
