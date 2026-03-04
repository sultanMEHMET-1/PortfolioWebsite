"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/components/ui/Section";
import type { ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

export function ProcessTimeline(): ReactNode {
    const sectionRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const steps = gsap.utils.toArray<HTMLElement>('.process-step');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    start: "top top",
                    end: "+=300%",
                    scrub: 1,
                }
            });

            // Smoothly move the container left across the 4 steps
            tl.to(wrapperRef.current, {
                xPercent: -100 * ((steps.length - 1) / steps.length),
                ease: "none"
            });

            // Subtle pop effects for each inner container
            steps.forEach((step) => {
                const inner = step.querySelector('.step-inner');
                gsap.from(inner, {
                    scale: 0.8,
                    opacity: 0.2,
                    scrollTrigger: {
                        trigger: step,
                        containerAnimation: tl,
                        start: "left center",
                        end: "right center",
                        scrub: true,
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const processes = [
        { id: "01", title: "Discovery", desc: "Understanding constraints, user goals, and hardware limitations." },
        { id: "02", title: "Architecture", desc: "Mapping out data structures, APIs, and critical safety routines." },
        { id: "03", title: "Execution", desc: "Writing clean, optimized code—from C++ to Next.js." },
        { id: "04", title: "Validation", desc: "Rigorous testing across devices, sensors, and environments." },
    ];

    return (
        <Section id="process" ref={sectionRef} className="h-screen flex items-center bg-neutral-950 overflow-hidden !py-0">
            <div ref={wrapperRef} className="flex h-full w-[400vw]">
                {processes.map((p) => (
                    <div key={p.id} className="process-step w-screen h-full flex items-center justify-center p-8 shrink-0 relative overflow-hidden">
                        <div className="absolute text-[35vw] font-bold text-white/[0.02] -z-10 tracking-tighter pointer-events-none select-none">
                            {p.id}
                        </div>
                        <div className="step-inner max-w-2xl flex flex-col items-start gap-4 p-12 border border-white/5 bg-white/[0.01] backdrop-blur-md rounded-3xl">
                            <span className="text-accent font-mono text-xl">{p.id}.</span>
                            <h3 className="text-4xl md:text-6xl font-bold text-white">{p.title}</h3>
                            <p className="text-xl text-neutral-400">{p.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}
