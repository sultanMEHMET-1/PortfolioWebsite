"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useMotion } from "./MotionProvider";
import { variants as presets, duration, ease } from "./tokens";

/* ── ScrollReveal ──
 * Reveals children when they scroll into the viewport.
 * Uses clip-path + translate for a physical "unmasking" feel.
 * Falls back to instant display when reduced motion is active.
 */

interface ScrollRevealProps {
    readonly children: ReactNode;
    readonly className?: string;
    readonly variant?: "fadeUp" | "fadeIn" | "slideInLeft" | "slideInRight" | "scaleIn";
    readonly delay?: number;
    readonly once?: boolean;
}

export function ScrollReveal({
    children,
    className,
    variant = "fadeUp",
    delay = 0,
    once = true,
}: ScrollRevealProps): ReactNode {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once, margin: "-60px 0px" });
    const { reducedMotion } = useMotion();

    if (reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    const selectedVariant = presets[variant];
    const delayedVariant: Variants = {
        hidden: selectedVariant.hidden,
        visible: {
            ...selectedVariant.visible,
            transition: {
                ...selectedVariant.visible.transition,
                delay,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={delayedVariant}
        >
            {children}
        </motion.div>
    );
}

/* ── StaggerChildren ──
 * Staggers the entrance of direct children.
 */

interface StaggerChildrenProps {
    readonly children: ReactNode;
    readonly className?: string;
    readonly staggerDelay?: number;
}

export function StaggerChildren({
    children,
    className,
    staggerDelay,
}: StaggerChildrenProps): ReactNode {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-40px 0px" });
    const { reducedMotion } = useMotion();

    if (reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    const containerVariant: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: staggerDelay ?? 0.08,
                delayChildren: 0.1,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariant}
        >
            {children}
        </motion.div>
    );
}

/* ── StaggerItem ──
 * A child of StaggerChildren that uses the fadeUp variant.
 */

interface StaggerItemProps {
    readonly children: ReactNode;
    readonly className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps): ReactNode {
    return (
        <motion.div className={className} variants={presets.fadeUp}>
            {children}
        </motion.div>
    );
}

/* ── PageTransition ──
 * Wraps page content with a fade + slight slide entrance.
 */

interface PageTransitionProps {
    readonly children: ReactNode;
    readonly className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps): ReactNode {
    const { reducedMotion } = useMotion();

    if (reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: ease.standard }}
        >
            {children}
        </motion.div>
    );
}
