"use client"

import { useCallback, useEffect, useState } from "react"
import { listProjectActivities, type ProjectActivity } from "@/services/activities.service"

export type ProjectActivityItem = {
    id: string | number
    actor: string
    action: string
    timestamp: string
    details?: string
    type: "created" | "update" | "member_add" | "member_remove" | "lead" | "archive" | "delete" | "restore" | "issue"
}

function formatDate(dateString?: string): string {
    if (!dateString) return "—"

    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date)
}

function formatDetails(item: ProjectActivity): string | undefined {
    const detailsParts: string[] = []

    if (item.target_user_name || item.target_user_username) {
        const target = item.target_user_name
            ? `${item.target_user_name}${item.target_user_username ? ` (@${item.target_user_username})` : ""}`
            : `@${item.target_user_username}`
        detailsParts.push(`Target: ${target}`)
    }

    if (item.field_name) {
        detailsParts.push(`${item.field_name}: ${item.old_value ?? "—"} → ${item.new_value ?? "—"}`)
    } else if (item.old_value || item.new_value) {
        detailsParts.push(`${item.old_value ?? "—"} → ${item.new_value ?? "—"}`)
    }

    return detailsParts.length > 0 ? detailsParts.join(" • ") : undefined
}

function mapActivityType(action?: string): ProjectActivityItem["type"] {
    const text = (action ?? "").toUpperCase()

    if (text.includes("MEMBER_ADDED")) return "member_add"
    if (text.includes("MEMBER_REMOVED")) return "member_remove"
    if (text.includes("LEAD")) return "lead"
    if (text.includes("ARCHIVED")) return "archive"
    if (text.includes("DELETED")) return "delete"
    if (text.includes("RESTORED")) return "restore"
    if (text.includes("ISSUE")) return "issue"
    if (text.includes("CREATED")) return "created"
    return "update"
}

export function useProjectActivities(projectId: string | number | null, limit = 50, offset = 0) {
    const [rawActivities, setRawActivities] = useState<ProjectActivity[]>([])
    const [activities, setActivities] = useState<ProjectActivityItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchActivities = useCallback(async () => {
        if (!projectId) return

        setIsLoading(true)
        setError(null)

        try {
            const data = await listProjectActivities(projectId, limit, offset)
            setRawActivities(data)

            const formatted: ProjectActivityItem[] = data.map((item) => ({
                id: item.id,
                actor: item.actor_name || item.actor_username || (item.actor_id ? `User #${item.actor_id}` : "System"),
                action: item.activity_type,
                details: formatDetails(item),
                type: mapActivityType(item.activity_type),
                timestamp: formatDate(item.created_at),
            }))

            setActivities(formatted)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load project activities")
        } finally {
            setIsLoading(false)
        }
    }, [projectId, limit, offset])

    useEffect(() => {
        if (!projectId) {
            setActivities([])
            setRawActivities([])
            return
        }

        fetchActivities()
    }, [projectId, fetchActivities])

    return {
        activities,
        rawActivities,
        isLoading,
        error,
        reload: fetchActivities,
    }
}
