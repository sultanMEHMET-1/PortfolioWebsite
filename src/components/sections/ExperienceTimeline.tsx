"use client";

import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { formatDateRange } from "@/lib/utils";
import type { ExperienceItem } from "@/content/types";
import type { ReactNode } from "react";

interface ExperienceTimelineProps {
    readonly items: readonly ExperienceItem[];
}

export function ExperienceTimeline({ items }: ExperienceTimelineProps): ReactNode {
    if (items.length === 0) return null;

    return (
        <Section id="experience">
            <Container>
                <ScrollReveal>
                    <h2 className="mb-12 text-3xl font-bold tracking-tight text-foreground">
                        Experience
                    </h2>
                </ScrollReveal>

                <StaggerChildren className="relative">
                    {/* Timeline line */}
                    <div
                        className="absolute top-0 left-0 h-full w-px bg-border md:left-8"
                        aria-hidden
                    />

                    {items.map((item) => (
                        <StaggerItem key={item.id}>
                            <div className="relative pb-12 pl-8 md:pl-20">
                                {/* Timeline dot */}
                                <div
                                    className="absolute top-1.5 left-0 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-background md:left-8"
                                    aria-hidden
                                />

                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm font-medium text-accent">
                                        {item.company}
                                    </p>
                                    <p className="text-sm text-muted">
                                        {formatDateRange(item.startDate, item.endDate)} · {item.location}
                                    </p>
                                </div>

                                {item.highlights.length > 0 && (
                                    <ul className="mt-3 space-y-1.5">
                                        {item.highlights.map((highlight, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2 text-sm leading-relaxed text-neutral-600"
                                            >
                                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-400" aria-hidden />
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerChildren>
            </Container>
        </Section>
    );
}
