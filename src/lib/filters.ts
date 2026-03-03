import type { ProjectItem } from "@/content/types";

/**
 * Extract all unique tech tags from a list of projects.
 */
export function getAllTags(projects: readonly ProjectItem[]): string[] {
    const tagSet = new Set<string>();
    for (const project of projects) {
        for (const tech of project.tech) {
            tagSet.add(tech);
        }
    }
    return Array.from(tagSet).sort();
}

/**
 * Filter projects by active tags (intersection — project must have ALL active tags).
 * If no tags are active, returns all projects.
 */
export function filterByTags(
    projects: readonly ProjectItem[],
    activeTags: readonly string[],
): ProjectItem[] {
    if (activeTags.length === 0) return [...projects];
    return projects.filter((project) =>
        activeTags.every((tag) => project.tech.includes(tag)),
    );
}

/**
 * Search projects by name (case-insensitive substring match).
 */
export function searchProjects(
    projects: readonly ProjectItem[],
    query: string,
): ProjectItem[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return [...projects];
    return projects.filter((project) =>
        project.name.toLowerCase().includes(normalizedQuery),
    );
}

/**
 * Combined filter + search.
 */
export function filterAndSearchProjects(
    projects: readonly ProjectItem[],
    activeTags: readonly string[],
    query: string,
): ProjectItem[] {
    const filtered = filterByTags(projects, activeTags);
    return searchProjects(filtered, query);
}
