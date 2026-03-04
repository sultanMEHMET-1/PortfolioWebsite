/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { isWebGLAvailable } from "@/utils/webgl";
import { useMotion } from "@/components/motion/MotionProvider";
import type { ReactNode } from "react";

interface SharedCanvasProps {
    children: ReactNode;
    className?: string;
    bloom?: boolean;
    camera?: { position: [number, number, number]; fov: number };
}

export function SharedCanvas({ children, className = "", bloom = true, camera = { position: [0, 0, 8], fov: 45 } }: SharedCanvasProps): ReactNode {
    const [mounted, setMounted] = useState(false);
    const { reducedMotion } = useMotion();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isWebGLAvailable() || reducedMotion) return null;

    return (
        <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
            <Canvas
                camera={camera}
                dpr={[1, 1.5]}
                gl={{ alpha: true, antialias: false, stencil: false, depth: false }}
            >
                <Suspense fallback={null}>
                    {children}
                    {bloom && (
                        <EffectComposer>
                            <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={1.5} mipmapBlur resolutionScale={0.5} />
                        </EffectComposer>
                    )}
                </Suspense>
            </Canvas>
        </div>
    );
}
