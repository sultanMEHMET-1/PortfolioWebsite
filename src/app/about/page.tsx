import { buildMetadata } from "@/lib/seo";
import { PageTransition } from "@/components/motion";
import { ScrollReveal } from "@/components/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = buildMetadata({
    title: "About",
    description: `Learn more about ${profile.name}`,
    path: "/about",
});

export default function AboutPage(): ReactNode {
    return (
        <PageTransition>
            <Section>
                <Container>
                    <ScrollReveal>
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
                            About Me
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal delay={0.1}>
                        <div className="max-w-2xl space-y-6 text-base leading-relaxed text-neutral-600">
                            <p>{profile.summary}</p>

                            <p>
                                TODO: Add a more detailed narrative about your background,
                                values, and what drives you. This should be a personal,
                                authentic story — not a resume summary.
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2}>
                        <div className="mt-16">
                            <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
                                Focus Areas
                            </h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        title: "TODO: Area 1",
                                        description: "Describe a focus area or value.",
                                    },
                                    {
                                        title: "TODO: Area 2",
                                        description: "Describe another focus area.",
                                    },
                                    {
                                        title: "TODO: Area 3",
                                        description: "Describe a third focus area.",
                                    },
                                ].map((area) => (
                                    <div
                                        key={area.title}
                                        className="rounded-xl border border-border bg-surface p-6"
                                    >
                                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
                                            {area.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-muted">
                                            {area.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                </Container>
            </Section>
        </PageTransition>
    );
}
