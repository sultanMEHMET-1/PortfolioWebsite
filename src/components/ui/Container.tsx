import type { ReactNode } from "react";

interface ContainerProps {
    readonly children: ReactNode;
    readonly className?: string;
    readonly as?: "div" | "section" | "main" | "article";
}

export function Container({
    children,
    className = "",
    as: Tag = "div",
}: ContainerProps): ReactNode {
    return (
        <Tag
            className={`mx-auto w-full max-w-[var(--max-w-content)] px-[var(--spacing-page)] ${className}`}
        >
            {children}
        </Tag>
    );
}
