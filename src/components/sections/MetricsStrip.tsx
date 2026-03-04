"use client";

import { useRef, useEffect, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useMotion } from "@/components/motion/MotionProvider";
import type { ReactNode } from "react";

interface StatDef {
    readonly value: number;
    readonly decimals: number;
    readonly label: string;
}

const STATS: readonly StatDef[] = [
    { value: 4.0, decimals: 1, label: "GPA" },
    { value: 1, decimals: 0, label: "Hackathons Won" },
];

interface CountUpProps {
    readonly value: number;
    readonly decimals: number;
}

function CountUp({ value, decimals }: CountUpProps): ReactNode {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-40px 0px" });
    const motionValue = useMotionValue(0);
    const [display, setDisplay] = useState((0).toFixed(decimals));
    const { reducedMotion } = useMotion();

    useEffect(() => {
        const unsubscribe = motionValue.on("change", (v) => {
            setDisplay(v.toFixed(decimals));
        });
        return unsubscribe;
    }, [motionValue, decimals]);

    useEffect(() => {
        if (!isInView) return;
        if (reducedMotion) {
            setDisplay(value.toFixed(decimals));
            return;
        }
        const controls = animate(motionValue, value, { duration: 1.5, ease: "easeOut" });
        return controls.stop;
    }, [isInView, motionValue, value, decimals, reducedMotion]);

    return <span ref={ref}>{display}</span>;
}

export function MetricsStrip(): ReactNode {
    return (
        <div className="border-y border-border/50">
            <Container>
                <div className="grid grid-cols-2">
                    {STATS.map((stat, index) => (
                        <div
                            key={stat.label}
                            className={`flex flex-col items-center gap-1 py-6 ${index < STATS.length - 1 ? "border-r border-border/50" : ""}`}
                        >
                            <span className="font-mono text-3xl font-bold text-foreground">
                                <CountUp value={stat.value} decimals={stat.decimals} />
                            </span>
                            <span className="font-mono text-xs uppercase tracking-widest text-muted">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
