/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { HeroObject } from "./objects/HeroObject";
import { isWebGLAvailable } from "@/utils/webgl";
import { useMotion } from "@/components/motion/MotionProvider";

export function Scene() {
    const [mounted, setMounted] = useState(false);
    const { reducedMotion } = useMotion();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Only render on client to avoid hydration mismatch
    if (!mounted) return null;

    // Fallback if WebGL isn't available or user prefers reduced motion
    if (!isWebGLAvailable() || reducedMotion) {
        return (
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none aria-hidden">
                {/* Simple elegant CSS fallback (e.g. static abstract shape) */}
                <div className="w-64 h-64 border-[1px] border-foreground rounded-full rotate-45 transform skew-x-12 skew-y-12" />
            </div>
        );
    }

    return (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                dpr={[1, 1.5]} // Cap pixel ratio for performance
                frameloop="always" // "demand" is tricky with continuous rotation, but we pause inside useFrame via reducedMotion
                gl={{ alpha: true, antialias: true }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                    <HeroObject />
                </Suspense>
            </Canvas>
        </div>
    );
}
