/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

interface MotionContextValue {
    readonly reducedMotion: boolean;
}

const MotionContext = createContext<MotionContextValue>({
    reducedMotion: false,
});

export function useMotion(): MotionContextValue {
    return useContext(MotionContext);
}

interface MotionProviderProps {
    readonly children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps): ReactNode {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);

        const handler = (e: MediaQueryListEvent): void => {
            setReducedMotion(e.matches);
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return (
        <MotionContext.Provider value={{ reducedMotion }}>
            {children}
        </MotionContext.Provider>
    );
}
