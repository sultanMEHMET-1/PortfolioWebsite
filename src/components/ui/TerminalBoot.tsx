"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

const LINES = [
    { text: "> esp32_portfolio init",     delay: 0 },
    { text: "[  OK  ] Bootloader: verified",    delay: 300 },
    { text: "[  OK  ] Flash: 4MB mounted",      delay: 600 },
    { text: "[  OK  ] GPIO: 38 pins ready",     delay: 900 },
    { text: "[  OK  ] WiFi: connecting...",     delay: 1200 },
    { text: "[  OK  ] WiFi: link up",           delay: 1500 },
    { text: "[  OK  ] Portfolio: launching",    delay: 1800 },
];

export function TerminalBoot(): ReactNode {
    const [visible, setVisible] = useState(false);
    const [lines, setLines] = useState<string[]>([]);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (sessionStorage.getItem("portfolio_booted")) return;
        sessionStorage.setItem("portfolio_booted", "1");
        setVisible(true);

        const timers: ReturnType<typeof setTimeout>[] = [];

        LINES.forEach((line, i) => {
            timers.push(
                setTimeout(() => {
                    setLines((prev) => [...prev, line.text]);
                }, line.delay),
            );
        });

        // Last line at 1800ms + fade out after 500ms pause
        timers.push(
            setTimeout(() => {
                setDone(true);
            }, 1800 + 500 + 400),
        );

        return () => timers.forEach(clearTimeout);
    }, []);

    if (!visible) return null;

    return (
        <AnimatePresence>
            {!done && (
                <motion.div
                    key="terminal-boot"
                    className="fixed inset-0 z-[100] bg-background flex items-start justify-center pt-[35vh]"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="font-mono text-sm space-y-1 px-4">
                        {lines.map((line, i) => {
                            const isOk = line.startsWith("[  OK  ]");
                            return (
                                <div key={i} className="flex items-center gap-1">
                                    {isOk ? (
                                        <>
                                            <span className="text-green-400">[  OK  ]</span>
                                            <span className="text-neutral-400">{line.slice(8)}</span>
                                        </>
                                    ) : (
                                        <span className="text-green-400">{line}</span>
                                    )}
                                    {i === lines.length - 1 && (
                                        <span className="animate-pulse inline-block w-2 h-4 bg-green-400 ml-1" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
