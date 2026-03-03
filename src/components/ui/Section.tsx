import type { ReactNode } from "react";

interface SectionProps {
    readonly children: ReactNode;
    readonly className?: string;
    readonly id?: string;
}

export function Section({
    children,
    className = "",
    id,
}: SectionProps): ReactNode {
    return (
        <section id={id} className={`py-20 md:py-28 ${className}`}>
            {children}
        </section>
    );
}
