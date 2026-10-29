"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useProfile } from "@/hooks/use-profile"
import { toast } from "@/components/ui/toast"

export type WorkspaceOption = {
    id: string | number
    name: string
    role?: string
}

const ACTIVE_WORKSPACE_KEY = "activeWorkspaceId"

/**
 * Manages the active workspace state and switching logic.
 *
 * - Reads the full workspaces list from `useProfile` (via GET /api/me)
 * - Persists the active workspace ID in localStorage so it survives page refresh
 * - Provides `switchWorkspace` which updates state, persists, and navigates to /workspace
 * - Provides `handleWorkspaceCreated` to instantly update the list, switch, and re-sync
 */
export function useWorkspaceSwitcher() {
    const { profile, refetch } = useProfile()
    const router = useRouter()

    const [workspaces, setWorkspaces] = useState<WorkspaceOption[]>([])
    const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceOption | null>(null)

    // Sync workspaces when profile changes
    useEffect(() => {
        if (profile?.workspaces) {
            const list: WorkspaceOption[] = profile.workspaces.map((ws) => ({
                id: ws.id,
                name: ws.name,
                role: ws.role,
            }))
            setWorkspaces(list)
        }
    }, [profile])

    // Listen to workspace-updated custom event
    useEffect(() => {
        const handleWorkspaceUpdated = () => {
            refetch()
        }
        window.addEventListener("workspace-updated", handleWorkspaceUpdated)
        return () => {
            window.removeEventListener("workspace-updated", handleWorkspaceUpdated)
        }
    }, [refetch])

    // Resolve the active workspace once workspaces are available
    useEffect(() => {
        if (workspaces.length === 0) return

        try {
            const storedId = window.localStorage.getItem(ACTIVE_WORKSPACE_KEY)
            const stored = storedId
                ? workspaces.find((ws) => String(ws.id) === storedId) ?? null
                : null

            // Fall back to the first workspace if nothing is stored
            setActiveWorkspace(stored ?? workspaces[0])
        } catch {
            setActiveWorkspace(workspaces[0])
        }
    }, [workspaces])

    const switchWorkspace = useCallback(
        (workspace: WorkspaceOption, tab: string = "General") => {
            const currentId =
                activeWorkspace?.id ??
                (typeof window !== "undefined"
                    ? window.localStorage.getItem(ACTIVE_WORKSPACE_KEY)
                    : null)
            const isDifferentWorkspace =
                !currentId || String(currentId) !== String(workspace.id)

            try {
                window.localStorage.setItem(ACTIVE_WORKSPACE_KEY, String(workspace.id))
                // Keep legacy key in sync so other parts of the app that read
                // "workspaceName" from localStorage continue to work.
                window.localStorage.setItem("workspaceName", workspace.name)
            } catch {
                // ignore storage errors
            }

            setActiveWorkspace(workspace)
            // Navigate to the workspace with target workspaceId and tab
            router.push(`/workspace?workspaceId=${workspace.id}&tab=${tab}`)

            if (isDifferentWorkspace) {
                toast.info(`you have switched to "${workspace.name}" workspace`)
            }
        },
        [activeWorkspace, router]
    )

    const handleWorkspaceCreated = useCallback(
        async (newWs: WorkspaceOption) => {
            setWorkspaces((prev) => {
                if (prev.some((w) => String(w.id) === String(newWs.id))) return prev
                return [...prev, newWs]
            })
            switchWorkspace(newWs)
            await refetch()
        },
        [switchWorkspace, refetch]
    )

    return {
        activeWorkspace,
        workspaces,
        switchWorkspace,
        handleWorkspaceCreated,
        refreshWorkspaces: refetch,
        /** The raw profile returned by useProfile — exposed so callers avoid a
         *  second useProfile call for sidebar / other UI needs. */
        profile,
    }
}
