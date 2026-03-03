"use client";

import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import type { SkillGroup } from "@/content/types";
import type { ReactNode } from "react";

interface SkillsMatrixProps {
    readonly groups: readonly SkillGroup[];
}

export function SkillsMatrix({ groups }: SkillsMatrixProps): ReactNode {
    if (groups.length === 0) return null;

    return (
        <Section id="skills">
            <Container>
                <ScrollReveal>
                    <h2 className="mb-12 text-3xl font-bold tracking-tight text-foreground">
                        Skills
                    </h2>
                </ScrollReveal>

                <StaggerChildren className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {groups.map((group) => (
                        <StaggerItem key={group.groupName}>
                            <div>
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
                                    {group.groupName}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {group.skills.map((skill) => (
                                        <Tag key={skill}>{skill}</Tag>
                                    ))}
                                </div>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerChildren>
            </Container>
        </Section>
    );
}
