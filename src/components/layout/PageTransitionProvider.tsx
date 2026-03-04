"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface PageTransitionProviderProps {
    children: ReactNode;
}

export function PageTransitionProvider({ children }: PageTransitionProviderProps): ReactNode {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
