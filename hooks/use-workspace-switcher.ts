"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useProfile } from "@/hooks/use-profile"

type WorkspaceOption = {
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
 */
export function useWorkspaceSwitcher() {
    const { profile } = useProfile()
    const router = useRouter()

    const workspaces: WorkspaceOption[] =
        profile?.workspaces?.map((ws) => ({
            id: ws.id,
            name: ws.name,
            role: ws.role,
        })) ?? []

    const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceOption | null>(null)

    // Resolve the active workspace once the profile is available
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
    // We only want this to re-run when the list of workspaces itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile])

    const switchWorkspace = useCallback(
        (workspace: WorkspaceOption) => {
            try {
                window.localStorage.setItem(ACTIVE_WORKSPACE_KEY, String(workspace.id))
                // Keep legacy key in sync so other parts of the app that read
                // "workspaceName" from localStorage continue to work.
                window.localStorage.setItem("workspaceName", workspace.name)
            } catch {
                // ignore storage errors
            }

            setActiveWorkspace(workspace)
            // Navigate to the workspace overview so the page context is correct
            router.push("/workspace")
        },
        [router]
    )

    return {
        activeWorkspace,
        workspaces,
        switchWorkspace,
        /** The raw profile returned by useProfile — exposed so callers avoid a
         *  second useProfile call for sidebar / other UI needs. */
        profile,
    }
}
