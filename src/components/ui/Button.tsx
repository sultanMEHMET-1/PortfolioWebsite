"use client";

import { motion } from "framer-motion";
import { useMotion } from "@/components/motion/MotionProvider";
import { duration, ease } from "@/components/motion/tokens";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-accent text-white hover:bg-accent-dark focus-visible:ring-accent/40",
    secondary:
        "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-400/40",
    ghost:
        "bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400/40",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
};

interface ButtonProps {
    readonly variant?: ButtonVariant;
    readonly size?: ButtonSize;
    readonly children: ReactNode;
    readonly className?: string;
    readonly href?: string;
    readonly onClick?: () => void;
    readonly type?: "button" | "submit" | "reset";
    readonly disabled?: boolean;
    readonly target?: string;
    readonly rel?: string;
    readonly "aria-label"?: string;
}

export function Button({
    variant = "primary",
    size = "md",
    children,
    className = "",
    href,
    onClick,
    type = "button",
    disabled,
    target,
    rel,
    "aria-label": ariaLabel,
}: ButtonProps): ReactNode {
    const { reducedMotion } = useMotion();

    const baseClasses = `inline-flex items-center justify-center gap-2 rounded-lg font-medium
    transition-colors focus-visible:outline-none focus-visible:ring-2
    ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    const motionConfig = reducedMotion
        ? {}
        : {
            whileHover: { scale: 1.03 },
            whileTap: { scale: 0.97 },
            transition: { duration: duration.fast, ease: ease.standard },
        };

    if (href) {
        return (
            <motion.a
                href={href}
                className={baseClasses}
                target={target}
                rel={rel}
                aria-label={ariaLabel}
                {...motionConfig}
            >
                {children}
            </motion.a>
        );
    }

    return (
        <motion.button
            type={type}
            className={baseClasses}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            {...motionConfig}
        >
            {children}
        </motion.button>
    );
}
