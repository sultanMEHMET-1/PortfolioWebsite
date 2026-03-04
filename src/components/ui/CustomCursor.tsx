"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function CustomCursor(): ReactNode {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const pos = useRef({ x: 0, y: 0 });
    const ring = useRef({ x: 0, y: 0 });
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (window.matchMedia("(pointer: coarse)").matches || shouldReduceMotion) {
            return;
        }

        const onMove = (e: MouseEvent) => {
            pos.current = { x: e.clientX, y: e.clientY };
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }
        };
        window.addEventListener("mousemove", onMove);

        let raf: number;
        const animate = () => {
            ring.current.x += (pos.current.x - ring.current.x) * 0.12;
            ring.current.y += (pos.current.y - ring.current.y) * 0.12;
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
            }
            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", onMove);
            cancelAnimationFrame(raf);
        };
    }, [shouldReduceMotion]);

    if (shouldReduceMotion) return null;

    return (
        <>
            <div
                ref={dotRef}
                className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference sm:block"
                style={{ willChange: "transform" }}
            />
            <div
                ref={ringRef}
                className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white mix-blend-difference sm:block"
                style={{ willChange: "transform" }}
            />
        </>
    );
}
