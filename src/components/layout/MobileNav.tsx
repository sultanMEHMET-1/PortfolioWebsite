"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMotion } from "@/components/motion/MotionProvider";
import { duration, ease } from "@/components/motion/tokens";
import { useEffect } from "react";
import type { ReactNode } from "react";

interface MobileNavProps {
    readonly links: readonly { readonly href: string; readonly label: string }[];
    readonly pathname: string;
    readonly open: boolean;
    readonly onClose: () => void;
}

export function MobileNav({
    links,
    pathname,
    open,
    onClose,
}: MobileNavProps): ReactNode {
    const { reducedMotion } = useMotion();

    // Lock body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // Close on escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent): void => {
            if (e.key === "Escape") onClose();
        };
        if (open) {
            window.addEventListener("keydown", handleKey);
        }
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    if (reducedMotion) {
        if (!open) return null;
        return (
            <div className="fixed inset-0 z-50 md:hidden">
                <div
                    className="absolute inset-0 bg-neutral-950/40"
                    onClick={onClose}
                    aria-hidden
                />
                <nav
                    className="absolute top-0 right-0 h-full w-72 bg-surface p-6 shadow-xl"
                    aria-label="Mobile navigation"
                >
                    <div className="mb-8 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-10 w-10 items-center justify-center rounded-md"
                            aria-label="Close menu"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            >
                                <line x1="4" y1="4" x2="16" y2="16" />
                                <line x1="16" y1="4" x2="4" y2="16" />
                            </svg>
                        </button>
                    </div>
                    <ul className="flex flex-col gap-2">
                        {links.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className={`block rounded-md px-4 py-3 text-base font-medium ${pathname === link.href
                                            ? "bg-accent-muted text-accent"
                                            : "text-foreground hover:bg-neutral-100"
                                        }`}
                                    aria-current={pathname === link.href ? "page" : undefined}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        );
    }

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-neutral-950/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: duration.fast }}
                        onClick={onClose}
                        aria-hidden
                    />

                    {/* Drawer */}
                    <motion.nav
                        className="absolute top-0 right-0 h-full w-72 bg-surface p-6 shadow-xl"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: duration.base, ease: ease.emphasized }}
                        aria-label="Mobile navigation"
                    >
                        <div className="mb-8 flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-10 w-10 items-center justify-center rounded-md"
                                aria-label="Close menu"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                >
                                    <line x1="4" y1="4" x2="16" y2="16" />
                                    <line x1="16" y1="4" x2="4" y2="16" />
                                </svg>
                            </button>
                        </div>
                        <ul className="flex flex-col gap-2">
                            {links.map((link, i) => (
                                <motion.li
                                    key={link.href}
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: 0.1 + i * 0.05,
                                        duration: duration.base,
                                        ease: ease.emphasized,
                                    }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={onClose}
                                        className={`block rounded-md px-4 py-3 text-base font-medium ${pathname === link.href
                                                ? "bg-accent-muted text-accent"
                                                : "text-foreground hover:bg-neutral-100"
                                            }`}
                                        aria-current={pathname === link.href ? "page" : undefined}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.nav>
                </div>
            )}
        </AnimatePresence>
    );
}
