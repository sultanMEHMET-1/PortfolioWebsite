"use client";

import { ScrollReveal } from "@/components/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SharedCanvas } from "@/components/three/SharedCanvas";
import { InteractiveShape } from "@/components/three/objects/InteractiveShape";
import { Tag } from "@/components/ui/Tag";
import type { SkillGroup } from "@/content/types";
import type { ReactNode } from "react";

interface SkillsMatrixProps {
    readonly groups: readonly SkillGroup[];
}

export function SkillsMatrix({ groups }: SkillsMatrixProps): ReactNode {
    const containerRef = useRef<HTMLDivElement>(null);
    gsap.registerPlugin(ScrollTrigger);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>('.skill-card');
            if (cards.length > 0) {
                gsap.from(cards, {
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                        once: true,
                    }
                });
            }
        }, containerRef);
        return () => ctx.revert();
    }, [groups]);

    if (groups.length === 0) return null;

    return (
        <Section id="skills" className="relative overflow-hidden">
            <SharedCanvas className="z-0" bloom={false}>
                <InteractiveShape />
            </SharedCanvas>
            <Container className="relative z-10">
                <ScrollReveal>
                    <h2 className="mb-12 text-3xl font-bold tracking-tight text-foreground">
                        Skills
                    </h2>
                </ScrollReveal>

                <div ref={containerRef} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {groups.map((group) => (
                        <div key={group.groupName} className="skill-card bg-surface/50 p-6 rounded-2xl border border-border/50 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.05)]">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
                                {group.groupName}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {group.skills.map((skill) => (
                                    <Tag key={skill}>{skill}</Tag>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}
