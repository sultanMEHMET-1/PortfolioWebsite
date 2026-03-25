"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/components/ui/Section";
import { SpaceScene } from "@/components/three/space/SpaceScene";
import { useScrollProgress } from "@/components/three/space/useScrollProgress";
import type { ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

export function ProcessTimeline(): ReactNode {
    const sectionRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { progress, setProgress } = useScrollProgress();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const steps = gsap.utils.toArray<HTMLElement>('.process-step');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    start: "top top",
                    end: "+=350%", // Increased scroll distance for more room at the end
                    scrub: 1.5,
                },
                onUpdate: function () {
                    setProgress(this.progress());
                }
            });

            // Add a buffer at the beginning before it starts scrolling horizontally
            tl.to({}, { duration: 0.1 });

            // Smoothly move the container left across the 4 steps
            tl.to(wrapperRef.current, {
                xPercent: -100 * ((steps.length - 1) / steps.length),
                ease: "none",
                duration: 0.65
            });

            // Add an empty space to the timeline so the background SpaceScene finishes playing while pinned
            tl.to({}, { duration: 0.25 });

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
    }, [setProgress]);

    const processes = [
        { id: "01", title: "Discovery", desc: "Understanding constraints, user goals, and hardware limitations.", position: "top-20 left-8" },
        { id: "02", title: "Architecture", desc: "Mapping out data structures, APIs, and critical safety routines.", position: "top-20 left-[33%]" },
        { id: "03", title: "Execution", desc: "Writing clean, optimized code—from C++ to Next.js.", position: "top-20 left-[66%]" },
        { id: "04", title: "Validation", desc: "Rigorous testing across devices, sensors, and environments.", position: "top-20 right-8" },
    ];

    return (
        <Section id="process" ref={sectionRef} className="h-screen flex items-center bg-neutral-950 overflow-hidden !py-0">
            {/* Space background — behind everything */}
            <SpaceScene progress={progress} />

            {/* Existing scroll panels — on top */}
            <div ref={wrapperRef} className="flex h-full w-[360vw] lg:w-[300vw] relative z-10">
                {processes.map((p) => (
                    // Reduced width means the boxes are closer horizontally, resulting in less buffer between zones
                    // And the 4th item will stop 10vw-25vw from the right edge, giving it an earlier entrance
                    <div key={p.id} className="process-step w-[90vw] lg:w-[75vw] h-full shrink-0 relative overflow-hidden">
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
