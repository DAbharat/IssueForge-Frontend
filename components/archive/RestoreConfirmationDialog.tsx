"use client"

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"

type RestoreConfirmationDialogProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    itemType: "workspace" | "project" | "issue" | "attachment"
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
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md border-[#27272A] bg-[#0E0E11] text-[#E2E8F0] shadow-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-semibold text-[#E2E8F0]">
                        Restore {typeLabel}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs leading-5 text-[#94A3B8]">
                        Are you sure you want to restore{" "}
                        <span className="font-semibold text-[#E2E8F0]">"{itemName}"</span>?
                        This item will be removed from the Archive and restored to its normal active views.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-4 flex flex-row items-center justify-end gap-2 border-t border-[#27272A] bg-[#09090B] p-3 -mx-4 -mb-4 rounded-b-xl">
                    <AlertDialogCancel
                        disabled={isRestoring}
                        className="rounded-md border border-[#27272A] bg-[#18181B] px-3.5 py-1.5 text-xs font-medium text-[#E2E8F0] transition-colors hover:border-[#3F3F46] hover:bg-[#27272A]"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isRestoring}
                        className="inline-flex items-center justify-center rounded-md border border-[#DDE1E5] bg-[#DDE1E5] px-3.5 py-1.5 text-xs font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {isRestoring ? "Restoring…" : "Yes"}
                    </button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
