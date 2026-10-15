"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type RestoreConfirmationDialogProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    itemType: "workspace" | "project" | "issue"
    itemName: string
    onConfirm: () => void
    isRestoring: boolean
}

export default function RestoreConfirmationDialog({
    isOpen,
    onOpenChange,
    itemType,
    itemName,
    onConfirm,
    isRestoring,
}: RestoreConfirmationDialogProps) {
    const typeLabel = itemType.charAt(0).toUpperCase() + itemType.slice(1)

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md border-[#27272A] bg-[#0E0E11] text-[#E2E8F0]">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold text-[#E2E8F0]">
                        Restore {typeLabel}?
                    </DialogTitle>
                    <DialogDescription className="text-xs leading-5 text-[#94A3B8]">
                        Are you sure you want to restore <span className="font-semibold text-[#E2E8F0]">"{itemName}"</span>?
                        This item will be removed from the Archive and restored to its normal active views.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        disabled={isRestoring}
                        className="rounded-md border border-[#27272A] bg-[#18181B] px-3 py-1.5 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46]"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isRestoring}
                        className="rounded-md border border-[#DDE1E5] bg-[#DDE1E5] px-3 py-1.5 text-xs font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {isRestoring ? "Restoring…" : "Restore"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
