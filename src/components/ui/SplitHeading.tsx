"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SplitHeadingProps {
    text: string;
    className?: string;
    tag?: "h1" | "h2" | "h3";
}

export function SplitHeading({ text, className = "", tag = "h1" }: SplitHeadingProps): ReactNode {
    const words = text.split(" ");

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
    };

    const wordVariants = {
        hidden: { opacity: 0, y: 40, rotateX: -45 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
        },
    };

    const MotionTag = motion[tag];

    return (
        <MotionTag
            className={className}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{ perspective: 1000 }}
        >
            {words.map((word, i) => (
                <span key={i}>
                    <span className="inline-block overflow-hidden">
                        <motion.span variants={wordVariants} className="inline-block" style={{ transformOrigin: "bottom center" }}>
                            {word}
                        </motion.span>
                    </span>
                    {i < words.length - 1 && " "}
                </span>
            ))}
        </MotionTag>
    );
}
