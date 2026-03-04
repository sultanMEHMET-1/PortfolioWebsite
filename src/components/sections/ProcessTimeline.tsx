"use client";

import { useRef, useLayoutEffect, useEffect } from "react";
import { useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/components/ui/Section";
import type { ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

export function ProcessTimeline(): ReactNode {
    const sectionRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const lenis = useLenis();
    // Keep a ref so GSAP callbacks always see the current Lenis instance
    // without needing to re-create the ScrollTrigger when it changes.
    const lenisRef = useRef(lenis);

    useEffect(() => {
        lenisRef.current = lenis;
    }, [lenis]);

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
                    snap: {
                        // one snap point per step; midpoint between steps determines direction
                        snapTo: 1 / (steps.length - 1),
                        delay: 0.05,
                        duration: { min: 0.15, max: 0.25 },
                        ease: "power1.inOut",
                    },
                    // Shorten Lenis duration while pinned so inertia doesn't
                    // carry scroll past the snap midpoint.
                    onEnter: () => { if (lenisRef.current) lenisRef.current.options.duration = 1.4; },
                    onLeave: () => { if (lenisRef.current) lenisRef.current.options.duration = 1.5; },
                    onEnterBack: () => { if (lenisRef.current) lenisRef.current.options.duration = 1.4; },
                    onLeaveBack: () => { if (lenisRef.current) lenisRef.current.options.duration = 1.5; },
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

        return () => {
            ctx.revert();
            // Restore default duration if component unmounts mid-section.
            if (lenisRef.current) lenisRef.current.options.duration = 1.5;
        };
    }, []);

    const processes = [
        { id: "01", title: "Discovery",    desc: "Understanding constraints, user goals, and hardware limitations.", position: "top-20 left-8" },
        { id: "02", title: "Architecture", desc: "Mapping out data structures, APIs, and critical safety routines.",  position: "top-20 left-[33%]" },
        { id: "03", title: "Execution",    desc: "Writing clean, optimized code—from C++ to Next.js.",              position: "top-20 left-[66%]" },
        { id: "04", title: "Validation",   desc: "Rigorous testing across devices, sensors, and environments.",      position: "top-20 right-8" },
    ];

    return (
        <Section id="process" ref={sectionRef} className="h-screen flex items-center bg-neutral-950 overflow-hidden !py-0">
            <div ref={wrapperRef} className="flex h-full w-[400vw]">
                {processes.map((p) => (
                    <div key={p.id} className="process-step w-screen h-full shrink-0 relative overflow-hidden">
                        <div className={`step-inner absolute max-w-sm flex flex-col items-start gap-4 p-8 border border-white/5 bg-white/[0.01] backdrop-blur-md rounded-3xl ${p.position}`}>
                            <span className="text-accent font-mono text-xl">{p.id}.</span>
                            <h3 className="text-3xl md:text-5xl font-bold text-white">{p.title}</h3>
                            <p className="text-lg text-neutral-400">{p.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}
