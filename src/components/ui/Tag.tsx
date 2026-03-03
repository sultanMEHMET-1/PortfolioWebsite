import type { ReactNode } from "react";

type TagVariant = "default" | "accent";

interface TagProps {
    readonly children: ReactNode;
    readonly variant?: TagVariant;
    readonly className?: string;
    readonly onClick?: () => void;
    readonly active?: boolean;
}

const variantStyles: Record<TagVariant, { base: string; active: string }> = {
    default: {
        base: "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
        active: "bg-neutral-800 text-white hover:bg-neutral-700",
    },
    accent: {
        base: "bg-accent-muted text-accent-dark hover:bg-accent/20",
        active: "bg-accent text-white hover:bg-accent-dark",
    },
};

export function Tag({
    children,
    variant = "default",
    className = "",
    onClick,
    active = false,
}: TagProps): ReactNode {
    const styles = variantStyles[variant];
    const stateStyle = active ? styles.active : styles.base;

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${stateStyle} ${className}`}
            >
                {children}
            </button>
        );
    }

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${stateStyle} ${className}`}
        >
            {children}
        </span>
    );
}
