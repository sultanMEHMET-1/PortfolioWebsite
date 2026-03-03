import { describe, it, expect } from "vitest";
import {
    getAllTags,
    filterByTags,
    searchProjects,
    filterAndSearchProjects,
} from "@/lib/filters";
import type { ProjectItem } from "@/content/types";

const mockProjects: readonly ProjectItem[] = [
    {
        id: "1",
        name: "Portfolio Site",
        description: "A personal portfolio built with Next.js",
        tech: ["TypeScript", "React", "Next.js"],
        links: [],
        highlights: [],
        featured: true,
    },
    {
        id: "2",
        name: "API Server",
        description: "A REST API built with Python",
        tech: ["Python", "FastAPI"],
        links: [],
        highlights: [],
        featured: false,
    },
    {
        id: "3",
        name: "Dashboard",
        description: "Analytics dashboard",
        tech: ["TypeScript", "React", "D3.js"],
        links: [],
        highlights: [],
        featured: false,
    },
] as const;

describe("getAllTags", () => {
    it("returns sorted unique tags from all projects", () => {
        const tags = getAllTags(mockProjects);
        expect(tags).toEqual([
            "D3.js",
            "FastAPI",
            "Next.js",
            "Python",
            "React",
            "TypeScript",
        ]);
    });

    it("returns empty array for no projects", () => {
        expect(getAllTags([])).toEqual([]);
    });
});

describe("filterByTags", () => {
    it("returns all projects when no tags are active", () => {
        const result = filterByTags(mockProjects, []);
        expect(result).toHaveLength(3);
    });

    it("filters by single tag", () => {
        const result = filterByTags(mockProjects, ["Python"]);
        expect(result).toHaveLength(1);
        expect(result[0]?.name).toBe("API Server");
    });

    it("filters by multiple tags (intersection)", () => {
        const result = filterByTags(mockProjects, ["TypeScript", "React"]);
        expect(result).toHaveLength(2);
        expect(result.map((p) => p.name)).toEqual(["Portfolio Site", "Dashboard"]);
    });

    it("returns empty when no projects match all tags", () => {
        const result = filterByTags(mockProjects, ["TypeScript", "Python"]);
        expect(result).toHaveLength(0);
    });
});

describe("searchProjects", () => {
    it("returns all projects for empty query", () => {
        expect(searchProjects(mockProjects, "")).toHaveLength(3);
        expect(searchProjects(mockProjects, "  ")).toHaveLength(3);
    });

    it("searches by name case-insensitively", () => {
        const result = searchProjects(mockProjects, "portfolio");
        expect(result).toHaveLength(1);
        expect(result[0]?.name).toBe("Portfolio Site");
    });

    it("returns empty for no matches", () => {
        expect(searchProjects(mockProjects, "nonexistent")).toHaveLength(0);
    });

    it("matches partial names", () => {
        const result = searchProjects(mockProjects, "dash");
        expect(result).toHaveLength(1);
    });
});

describe("filterAndSearchProjects", () => {
    it("applies both tag filter and search", () => {
        const result = filterAndSearchProjects(
            mockProjects,
            ["TypeScript"],
            "portfolio",
        );
        expect(result).toHaveLength(1);
        expect(result[0]?.name).toBe("Portfolio Site");
    });

    it("returns empty when filters exclude everything", () => {
        const result = filterAndSearchProjects(
            mockProjects,
            ["Python"],
            "portfolio",
        );
        expect(result).toHaveLength(0);
    });
});
