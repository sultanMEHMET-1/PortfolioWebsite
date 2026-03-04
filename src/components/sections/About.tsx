"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import Image from "next/image";
import { profile } from "@/content/profile";
import type { ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

export function About(): ReactNode {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(textRef.current, { x: -60, opacity: 0 }, {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    once: true,
                }
            });

            gsap.fromTo(imageRef.current, { x: 60, opacity: 0 }, {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    once: true,
                }
            });

            gsap.to(imageRef.current, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <Section id="about" ref={sectionRef} className="py-24 overflow-hidden relative">
            <Container>
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div ref={textRef} className="flex-1 space-y-6 z-10">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            About Me
                        </h2>
                        <div className="space-y-4 text-base leading-relaxed text-muted">
                            <p>{profile.summary}</p>
                            <p>I thrive at the intersection of systems engineering and creative software development. My experience ranges from programming safety-critical microcontrollers for Formula Electric vehicles to creating performant, beautiful web experiences.</p>
                        </div>
                    </div>

                    <div ref={imageRef} className="flex-1 w-full max-w-sm aspect-[4/5] relative rounded-2xl overflow-hidden ml-auto">
                        <div className="absolute inset-0 bg-accent/20 mix-blend-overlay z-10 pointer-events-none" />
                        <div className="absolute inset-0 border border-white/10 z-20 rounded-2xl" />
                        <Image
                            src="https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800&h=1000&fit=crop&q=80"
                            alt={profile.name}
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700 pointer-events-none"
                        />
                    </div>
                </div>
            </Container>
        </Section>
    );
}
