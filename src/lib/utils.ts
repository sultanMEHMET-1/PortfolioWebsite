/**
 * Format a date string like "2023-01" into "Jan 2023".
 * Returns "Present" for null/undefined endDate values.
 */
export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "Present";

    const parts = dateStr.split("-");
    const year = parts[0];

    if (parts.length < 2) return year ?? dateStr;

    const monthIndex = parseInt(parts[1] ?? "1", 10) - 1;
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ] as const;

    const monthName = monthNames[monthIndex] ?? parts[1];
    return `${monthName} ${year}`;
}

/**
 * Build a date range string like "Jan 2023 – Present".
 */
export function formatDateRange(start: string | null | undefined, end: string | null | undefined): string {
    if (!start && !end) return "";
    if (!start) return formatDate(end);
    if (!end) return `${formatDate(start)} – Present`;
    if (start === end) return formatDate(start);
    return `${formatDate(start)} – ${formatDate(end)}`;
}
