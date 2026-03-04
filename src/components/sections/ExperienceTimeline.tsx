"use client";

import { motion } from "framer-motion";
import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SharedCanvas } from "@/components/three/SharedCanvas";
import { AmbientGeometry } from "@/components/three/objects/AmbientGeometry";
import { formatDateRange } from "@/lib/utils";
import type { ExperienceItem } from "@/content/types";
import type { ReactNode } from "react";

interface ExperienceTimelineProps {
    readonly items: readonly ExperienceItem[];
}

export function ExperienceTimeline({ items }: ExperienceTimelineProps): ReactNode {
    if (items.length === 0) return null;

    return (
        <Section id="experience" className="relative overflow-hidden">
            <SharedCanvas className="z-0" bloom={false}>
                <AmbientGeometry />
            </SharedCanvas>
            <Container className="relative z-10">
                <ScrollReveal>
                    <h2 className="mb-12 text-3xl font-bold tracking-tight text-foreground">
                        Experience
                    </h2>
                </ScrollReveal>

                <StaggerChildren className="relative">
                    {/* PCB trace background track */}
                    <div
                        className="absolute top-0 left-0 h-full w-px bg-indigo-900/25 md:left-8"
                        aria-hidden
                    />
                    {/* PCB trace animated reveal */}
                    <motion.div
                        className="absolute top-0 left-0 h-full w-px bg-indigo-500/60 origin-top md:left-8"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, amount: 0 }}
                        transition={{ duration: 2.5, ease: "linear" }}
                        aria-hidden
                    />

                    {items.map((item) => (
                        <StaggerItem key={item.id}>
                            <div className="relative pb-12 pl-8 md:pl-20">
                                {/* Status LED (active = green pulse, past = indigo static) */}
                                <div
                                    className="absolute top-1.5 left-0 h-4 w-4 -translate-x-1/2 md:left-8"
                                    aria-hidden
                                >
                                    <div className={`absolute inset-0 rounded-full border bg-background ${item.endDate === null ? "border-emerald-500/60" : "border-indigo-500/60"}`} />
                                    <div className={`absolute inset-[4px] rounded-full ${item.endDate === null ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-indigo-500/50"}`} />
                                </div>
                                {/* Horizontal branch stub */}
                                <div
                                    className="absolute top-[7px] left-0 h-px w-2 bg-indigo-500/40 md:left-8 translate-x-[2px]"
                                    aria-hidden
                                />

                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm font-medium text-accent">
                                        {item.company}
                                    </p>
                                    <p className="text-sm font-mono text-muted">
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
