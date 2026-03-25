"use client";

import { useRef, useCallback } from "react";
import type { MutableRefObject } from "react";

export interface ScrollProgress {
    /** Ref read by R3F useFrame — never triggers re-renders */
    progress: MutableRefObject<number>;
    /** Stable setter for GSAP onUpdate callback */
    setProgress: (value: number) => void;
}

export function useScrollProgress(): ScrollProgress {
    const progress = useRef(0);
    const setProgress = useCallback((v: number) => {
        progress.current = v;
    }, []);
    return { progress, setProgress };
}
