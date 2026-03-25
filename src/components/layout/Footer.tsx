"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { profile } from "@/content/profile";
import { SharedCanvas } from "@/components/three/SharedCanvas";
import { AuroraNetwork } from "@/components/three/objects/AuroraNetwork";
import type { ReactNode } from "react";

export function Footer(): ReactNode {
    const currentYear = new Date().getFullYear();
    const [copied, setCopied] = useState(false);

    const handleEmailClick = (e: React.MouseEvent<HTMLButtonElement>, url: string) => {
        e.preventDefault();
        const address = url.replace("mailto:", "");
        navigator.clipboard.writeText(address).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => { });
    };

    return (
        <footer className="relative border-t border-border py-20 overflow-hidden">
            <SharedCanvas className="z-0 opacity-80" bloom={false}>
                <AuroraNetwork count={150} />
            </SharedCanvas>
            <Container className="relative z-10 w-full h-full">
                <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
                    <p>
                        &copy; {currentYear} {profile.name}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {profile.contactLinks.map((link) => {
                            if (link.platform === "Email") {
                                return (
                                    <button
                                        key={link.platform}
                                        type="button"
                                        onClick={(e) => handleEmailClick(e, link.url)}
                                        className="transition-colors hover:text-foreground cursor-pointer"
                                        aria-label="Copy email"
                                    >
                                        {copied ? "Copied!" : link.platform}
                                    </button>
                                );
                            }
                            return (
                                <a
                                    key={link.platform}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-colors hover:text-foreground"
                                    aria-label={link.label}
                                >
                                    {link.platform}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </footer>
    );
}
