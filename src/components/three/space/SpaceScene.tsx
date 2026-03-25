/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { isWebGLAvailable } from "@/utils/webgl";
import { useMotion } from "@/components/motion/MotionProvider";
import { Moon } from "./Moon";
import { Earth } from "./Earth";
import { Sun } from "./Sun";
import { MilkyWay } from "./MilkyWay";
import { Starfield } from "./Starfield";
import { ThreeErrorBoundary } from "@/components/three/ThreeErrorBoundary";
import type { MutableRefObject, ReactNode } from "react";

interface SpaceSceneProps {
    progress: MutableRefObject<number>;
}

function SpaceSceneInner({ progress }: SpaceSceneProps): ReactNode {
    return (
        <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 3, 5]} intensity={1.2} />
            <directionalLight position={[-5, -2, -3]} intensity={0.3} />

            <Moon progress={progress} />
            <Earth progress={progress} />
            <Sun progress={progress} />
            <MilkyWay progress={progress} />
            <Starfield count={300} />

            <EffectComposer>
                <Bloom
                    luminanceThreshold={0.6}
                    luminanceSmoothing={0.9}
                    intensity={1.2}
                    mipmapBlur
                    resolutionScale={0.5}
                />
            </EffectComposer>
        </>
    );
}

export function SpaceScene({ progress }: SpaceSceneProps): ReactNode {
    const [mounted, setMounted] = useState(false);
    const { reducedMotion } = useMotion();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isWebGLAvailable() || reducedMotion) return null;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            <ThreeErrorBoundary>
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    dpr={[1, 1.5]}
                    gl={{ alpha: true, antialias: false, stencil: false, depth: true }}
                    frameloop="always"
                >
                    <Suspense fallback={null}>
                        <SpaceSceneInner progress={progress} />
                    </Suspense>
                </Canvas>
            </ThreeErrorBoundary>
        </div>
    );
}
