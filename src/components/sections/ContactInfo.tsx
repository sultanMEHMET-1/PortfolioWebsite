"use client";

import { useState, useCallback } from "react";
import { ScrollReveal } from "@/components/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { SharedCanvas } from "@/components/three/SharedCanvas";
import { OscilloscopeWave } from "@/components/three/objects/OscilloscopeWave";
import { profile } from "@/content/profile";
import type { ReactNode } from "react";

export function ContactInfo(): ReactNode {
    const [copied, setCopied] = useState(false);

    const emailLink = profile.contactLinks.find(
        (l) => l.platform === "Email",
    );
    const emailAddress = emailLink?.url.replace("mailto:", "") ?? "";

    const copyEmail = useCallback((): void => {
        if (!emailAddress) return;
        navigator.clipboard.writeText(emailAddress).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            // Fallback: do nothing, link still works
        });
    }, [emailAddress]);

    return (
        <Section id="contact" className="relative overflow-hidden">
            <SharedCanvas bloom={true} camera={{ position: [0, 0, 5], fov: 75 }}>
                <OscilloscopeWave />
            </SharedCanvas>
            <Container className="relative z-10">
                <ScrollReveal>
                    <div className="mx-auto max-w-lg text-center">
                        <SplitHeading
                            text="Get in Touch"
                            tag="h2"
                            className="mb-4 text-3xl font-bold tracking-tight text-foreground"
                        />
                        <p className="mb-8 text-base leading-relaxed text-muted">
                            I&apos;m always open to discussing new opportunities, interesting
                            projects, or just having a conversation.
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            {emailAddress && (
                                <div className="flex items-center gap-2">
                                    <Button href={emailLink?.url} variant="primary" size="lg">
                                        Say Hello
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={copyEmail}
                                        className="rounded-lg border border-border px-3 py-2.5 text-sm text-muted transition-colors hover:bg-neutral-100 hover:text-foreground"
                                        aria-label="Copy email address"
                                    >
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-4">
                                {profile.contactLinks
                                    .filter((l) => l.platform !== "Email")
                                    .map((link) => (
                                        <a
                                            key={link.platform}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-muted underline underline-offset-4 transition-colors hover:text-accent"
                                            aria-label={`Visit ${link.label}`}
                                        >
                                            {link.platform}
                                        </a>
                                    ))}
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </Container>
        </Section>
    );
}
