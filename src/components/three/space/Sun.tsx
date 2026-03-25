"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import type { MutableRefObject } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";

interface SunProps {
    progress: MutableRefObject<number>;
}

/** Visible 0.42–0.68: fades in 0.42–0.50, full 0.50–0.60, fades out 0.60–0.68 */
function getOpacity(p: number): number {
    if (p < 0.42 || p > 0.68) return 0;
    if (p < 0.50) return (p - 0.42) / 0.08;
    if (p > 0.60) return 1 - (p - 0.60) / 0.08;
    return 1;
}

export function Sun({ progress }: SunProps): ReactNode {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshBasicMaterial>(null);

    const sunMap = useTexture("/textures/space/sun_2k.jpg");

    const sphereArgs = useMemo<[number, number, number]>(() => [1.4, 48, 48], []);

    useFrame((_, delta) => {
        const opacity = getOpacity(progress.current);

        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.03;
            meshRef.current.visible = opacity > 0.001;
            meshRef.current.scale.setScalar(0.8 + opacity * 0.2);
        }
        if (materialRef.current) {
            materialRef.current.opacity = opacity;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, -0.3, 0]}>
            <sphereGeometry args={sphereArgs} />
            <meshBasicMaterial
                ref={materialRef}
                map={sunMap}
                transparent
                opacity={1}
                toneMapped={false}
            />
        </mesh>
    );
}
