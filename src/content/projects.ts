import type { ProjectItem } from "./types";

export const projects: readonly ProjectItem[] = [
    {
        id: "proj-1",
        name: "TODO: Project Name",
        description:
            "TODO: Brief description of the project, what problem it solves, and your role.",
        tech: ["TypeScript", "React", "Next.js"],
        links: [
            { label: "GitHub", url: "https://github.com/TODO" },
        ],
        highlights: [
            "TODO: Key technical achievement",
            "TODO: Impact or outcome",
        ],
        featured: true,
    },
    {
        id: "proj-2",
        name: "TODO: Another Project",
        description: "TODO: Description of this project.",
        tech: ["Python", "FastAPI"],
        links: [],
        highlights: ["TODO: Highlight"],
        featured: false,
    },
    // TODO: Add your real projects from LinkedIn or GitHub.
];
