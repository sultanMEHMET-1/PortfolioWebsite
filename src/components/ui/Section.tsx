import { forwardRef } from "react";
import type { ReactNode } from "react";

interface SectionProps {
    readonly children: ReactNode;
    readonly className?: string;
    readonly id?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(({
    children,
    className = "",
    id,
}, ref) => {
    return (
        <section ref={ref} id={id} className={`py-20 md:py-28 ${className}`}>
            {children}
        </section>
    );
});
Section.displayName = "Section";
