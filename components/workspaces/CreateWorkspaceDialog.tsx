"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import CreateWorkspaceCard, {
    type CreateWorkspacePayload,
} from "@/components/workspaces/CreateWorkspaceCard"
import { createWorkspace, type Workspace } from "@/services/workspaces.service"

export type CreateWorkspaceDialogProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: (workspace: { id: string | number; name: string; role?: string }) => void
}

export default function CreateWorkspaceDialog({
    isOpen,
    onOpenChange,
    onSuccess,
}: CreateWorkspaceDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleCreate(payload: CreateWorkspacePayload) {
        setIsSubmitting(true)
        setError(null)

        try {
            const created = await createWorkspace({
                name: payload.name,
            })

            setIsSubmitting(false)
            onOpenChange(false)

            if (onSuccess && created) {
                onSuccess({
                    id: created.id,
                    name: created.name,
                    role: "ADMIN",
                })
            }
        } catch (err) {
            setIsSubmitting(false)
            setError(err instanceof Error ? err.message : "Failed to create workspace.")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-xl border-none bg-transparent p-0 text-[#E2E8F0] shadow-none outline-none"
                showCloseButton={false}
            >
                {/* Accessible DialogHeader for screen readers and Base UI */}
                <DialogHeader className="sr-only">
                    <DialogTitle>Create Workspace</DialogTitle>
                    <DialogDescription>
                        Create a new workspace to organize your projects and collaborate with your team.
                    </DialogDescription>
                </DialogHeader>

                <CreateWorkspaceCard
                    onSubmit={handleCreate}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={isSubmitting}
                    error={error}
                />
            </DialogContent>
        </Dialog>
    )
}
