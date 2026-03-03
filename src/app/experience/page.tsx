import { buildMetadata } from "@/lib/seo";
import { PageTransition } from "@/components/motion";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { experience } from "@/content/experience";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = buildMetadata({
    title: "Experience",
    description: "Professional experience and career timeline",
    path: "/experience",
});

export default function ExperiencePage(): ReactNode {
    return (
        <PageTransition>
            <ExperienceTimeline items={experience} />
        </PageTransition>
    );
}
