"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
}

export function MagneticButton({ children, className = "" }: MagneticButtonProps): ReactNode {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = (e.clientX - centerX) / (rect.width / 2);
        const distY = (e.clientY - centerY) / (rect.height / 2);
        setPosition({ x: distX * 8, y: distY * 8 });
    };

    const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

    return (
        <motion.div
            ref={ref}
            className={className}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ display: "inline-block" }}
        >
            {children}
        </motion.div>
    );
}
