import { Container } from "@/components/ui/Container";
import { profile } from "@/content/profile";
import type { ReactNode } from "react";

export function Footer(): ReactNode {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border py-10">
            <Container>
                <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
                    <p>
                        &copy; {currentYear} {profile.name}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {profile.contactLinks.map((link) => (
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
                        ))}
                    </div>
                </div>
            </Container>
        </footer>
    );
}
