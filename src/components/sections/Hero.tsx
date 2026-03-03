"use client";

import { ScrollReveal } from "@/components/motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { profile } from "@/content/profile";
import { Scene } from "@/components/three/Scene";
import { ThreeErrorBoundary } from "@/components/three/ThreeErrorBoundary";
import type { ReactNode } from "react";

export function Hero(): ReactNode {
    return (
        <section className="relative flex min-h-[85vh] items-center overflow-hidden pt-16">
            {/* Subtle grid background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
                aria-hidden
            />

            <ThreeErrorBoundary>
                <Scene />
            </ThreeErrorBoundary>

            <Container>
                <div className="max-w-2xl">
                    <ScrollReveal>
                        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
                            Hello, I&apos;m
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={0.1}>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                            {profile.name}
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2}>
                        <p className="mt-4 text-lg leading-relaxed text-muted sm:text-xl">
                            {profile.headline}
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={0.3}>
                        <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-600">
                            {profile.summary}
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={0.4}>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button href="/projects" variant="primary" size="lg">
                                View Work
                            </Button>
                            <Button href="/contact" variant="secondary" size="lg">
                                Get in Touch
                            </Button>
                        </div>
                    </ScrollReveal>
                </div>
            </Container>
        </section>
    );
}
