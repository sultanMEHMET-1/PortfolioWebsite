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
                                I care about building things that work reliably under real
                                constraints — whether that is embedded code on a race car,
                                automated tests that catch regressions early, or systems that
                                have to behave predictably when hardware and software meet.
                                That mindset comes from liking both the big picture and the
                                details: how a design is structured, how failures show up, and
                                how to iterate until the behavior is right.
                            </p>
                            <p>
                                Outside of coursework and projects, volunteering in hospitals
                                and clinics shaped how I think about technology: tools and
                                algorithms are most meaningful when they help people directly.
                                Long term, I want to keep growing at the intersection of
                                intelligent systems, rigorous engineering, and problems that
                                matter in the world.
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
                                        title: "Robotics and Embedded Systems",
                                        description: "Robotics sits at the intersection of software and hardware, which is exactly where I like to work. As an electronics member in Purdue Electric Racing, I build control systems, debugging tools, and manage the low level hardware that has to perform reliably in real competitions. It’s a fast feedback environment that forces careful design.",
                                    },
                                    {
                                        title: "Technology with Real Impact",
                                        description: "The problems that motivate me most are the ones that affect people’s lives directly. Volunteering in hospitals and clinics for two years showed me how powerful the right technology can be for diagnosis and treatment. Long term, I want to develop algorithms and intelligent systems that improve medical care.",
                                    },
                                    {
                                        title: "Algorithms and Systems",
                                        description: "I like solving problems by breaking them into clear, efficient algorithms. Much of my work focuses on how software systems are structured and how decisions are encoded in code. Whether it’s robotics or backend systems, I enjoy turning complex behavior into logic a machine can execute.",
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
