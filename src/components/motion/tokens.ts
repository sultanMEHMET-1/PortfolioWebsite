/* ── Motion Design Tokens ──
 * Centralized animation constants for consistent motion throughout the site.
 * All Framer Motion animations should reference these tokens.
 */

export const duration = {
    fast: 0.15,
    base: 0.3,
    slow: 0.6,
    xslow: 0.9,
} as const;

export const ease = {
    /** Standard ease for most transitions */
    standard: [0.25, 0.1, 0.25, 1.0] as const,
    /** Emphasized ease for entrances — slower start, snappier end */
    emphasized: [0.0, 0.0, 0.2, 1.0] as const,
    /** Bouncy ease for playful micro-interactions */
    bounce: [0.34, 1.56, 0.64, 1.0] as const,
} as const;

export const stagger = {
    fast: 0.04,
    base: 0.08,
    slow: 0.12,
} as const;

/** Reusable Framer Motion variant presets */
export const variants = {
    fadeUp: {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: duration.base, ease: ease.emphasized },
        },
    },
    fadeIn: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: duration.base, ease: ease.standard },
        },
    },
    slideInLeft: {
        hidden: { opacity: 0, x: -32 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: duration.base, ease: ease.emphasized },
        },
    },
    slideInRight: {
        hidden: { opacity: 0, x: 32 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: duration.base, ease: ease.emphasized },
        },
    },
    scaleIn: {
        hidden: { opacity: 0, scale: 0.92 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: duration.base, ease: ease.emphasized },
        },
    },
    staggerContainer: {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: stagger.base,
                delayChildren: 0.1,
            },
        },
    },
} as const;
