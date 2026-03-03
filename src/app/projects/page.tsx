import { buildMetadata } from "@/lib/seo";
import { PageTransition } from "@/components/motion";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { projects } from "@/content/projects";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = buildMetadata({
    title: "Projects",
    description: "Featured projects and technical work",
    path: "/projects",
});

export default function ProjectsPage(): ReactNode {
    return (
        <PageTransition>
            <ProjectGrid projects={projects} />
        </PageTransition>
    );
}
