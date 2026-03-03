"use client";

import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { formatDateRange } from "@/lib/utils";
import type { EducationItem } from "@/content/types";
import type { ReactNode } from "react";

interface EducationListProps {
    readonly items: readonly EducationItem[];
}

export function EducationList({ items }: EducationListProps): ReactNode {
    if (items.length === 0) return null;

    return (
        <Section id="education">
            <Container>
                <ScrollReveal>
                    <h2 className="mb-12 text-3xl font-bold tracking-tight text-foreground">
                        Education
                    </h2>
                </ScrollReveal>

                <StaggerChildren className="space-y-8">
                    {items.map((item) => (
                        <StaggerItem key={item.id}>
                            <div className="rounded-xl border border-border bg-surface p-6">
                                <h3 className="text-lg font-semibold text-foreground">
                                    {item.degree}
                                </h3>
                                <p className="mt-1 text-sm font-medium text-accent">
                                    {item.school}
                                </p>
                                {formatDateRange(item.startDate, item.endDate) && (
                                    <p className="mt-1 text-sm text-muted">
                                        {formatDateRange(item.startDate, item.endDate)}
                                    </p>
                                )}
                                {item.highlights.length > 0 && (
                                    <ul className="mt-3 space-y-1">
                                        {item.highlights.map((h, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2 text-sm text-neutral-600"
                                            >
                                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-400" aria-hidden />
                                                {h}
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
