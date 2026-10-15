export function formatArchiveDate(dateStr?: string): string {
    if (!dateStr) return "—"
    try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return "—"
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }).format(date)
    } catch {
        return "—"
    }
}

export function formatFileSize(bytes?: number): string {
    if (!bytes || bytes <= 0) return "—"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
