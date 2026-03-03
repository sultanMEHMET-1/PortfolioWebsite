"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { MobileNav } from "./MobileNav";
import type { ReactNode } from "react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/experience", label: "Experience" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
] as const;

export function Header(): ReactNode {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="fixed top-0 right-0 left-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
            <Container>
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight text-foreground"
                    >
                        MM
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                            ? "text-accent"
                                            : "text-muted hover:text-foreground"
                                        }`}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {link.label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-accent" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile hamburger */}
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                        aria-expanded={mobileOpen}
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
                            <line x1="3" y1="5" x2="17" y2="5" />
                            <line x1="3" y1="10" x2="17" y2="10" />
                            <line x1="3" y1="15" x2="17" y2="15" />
                        </svg>
                    </button>
                </div>
            </Container>

            <MobileNav
                links={navLinks as unknown as readonly { href: string; label: string }[]}
                pathname={pathname}
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />
        </header>
    );
}
