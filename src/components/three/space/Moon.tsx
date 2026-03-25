"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { ReactNode } from "react";

interface MoonProps {
    progress: MutableRefObject<number>;
}

/** Visibility: fully visible 0.00–0.20, fades out 0.20–0.33 */
function getOpacity(p: number): number {
    if (p <= 0.20) return 1;
    if (p >= 0.33) return 0;
    return 1 - (p - 0.20) / 0.13;
}

export function Moon({ progress }: MoonProps): ReactNode {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);

    const [diffuse, bump] = useTexture([
        "/textures/space/moon_2k.jpg",
        "/textures/space/moon_2k.jpg", // re-use diffuse as bump (craters are already in the albedo)
    ]);

    // Cache geometry args
    const sphereArgs = useMemo<[number, number, number]>(() => [1.5, 48, 48], []);

    useFrame((_, delta) => {
        const opacity = getOpacity(progress.current);

        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.04;
            meshRef.current.visible = opacity > 0.001;
            meshRef.current.scale.setScalar(0.8 + opacity * 0.2);
        }
        if (materialRef.current) {
            materialRef.current.opacity = opacity;
        }
    });

    return (
        <group>
            {/* Moon surface */}
            <mesh ref={meshRef}>
                <sphereGeometry args={sphereArgs} />
                <meshStandardMaterial
                    ref={materialRef}
                    map={diffuse}
                    bumpMap={bump}
                    bumpScale={0.04}
                    roughness={0.9}
                    metalness={0}
                    transparent
                    opacity={1}
                />
            </mesh>

        </group>
    );
}
