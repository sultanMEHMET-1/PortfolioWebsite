"use client";

import { motion } from "framer-motion";
import { useMotion } from "@/components/motion/MotionProvider";
import { duration, ease } from "@/components/motion/tokens";
import type { ReactNode } from "react";

interface CardProps {
    readonly children: ReactNode;
    readonly className?: string;
    readonly hover?: boolean;
    readonly onClick?: () => void;
}

export function Card({
    children,
    className = "",
    hover = true,
    onClick,
}: CardProps): ReactNode {
    const { reducedMotion } = useMotion();

    const base = `rounded-xl border border-border bg-surface p-6 ${className}`;

    if (!hover || reducedMotion) {
        return (
            <div
                className={base}
                onClick={onClick}
                role={onClick ? "button" : undefined}
                tabIndex={onClick ? 0 : undefined}
                onKeyDown={
                    onClick
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onClick();
                            }
                        }
                        : undefined
                }
            >
                {children}
            </div>
        );
    }

    return (
        <motion.div
            className={`${base} cursor-pointer`}
            whileHover={{
                y: -4,
                boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
            transition={{ duration: duration.fast, ease: ease.standard }}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onClick();
                        }
                    }
                    : undefined
            }
        >
            {children}
        </motion.div>
    );
}
