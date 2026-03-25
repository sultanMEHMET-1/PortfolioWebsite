"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { ReactNode } from "react";

interface EarthProps {
    progress: MutableRefObject<number>;
}

/** Visible 0.20–0.50: fades in 0.20–0.28, full 0.28–0.42, fades out 0.42–0.50 */
function getOpacity(p: number): number {
    if (p < 0.20 || p > 0.50) return 0;
    if (p < 0.28) return (p - 0.20) / 0.08;
    if (p > 0.42) return 1 - (p - 0.42) / 0.08;
    return 1;
}

export function Earth({ progress }: EarthProps): ReactNode {
    const meshRef = useRef<THREE.Mesh>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    const cloudMatRef = useRef<THREE.MeshStandardMaterial>(null);

    const [dayMap, cloudMap] = useTexture([
        "/textures/space/earth_day_2k.jpg",
        "/textures/space/earth_clouds_2k.jpg",
    ]);

    const sphereArgs = useMemo<[number, number, number]>(() => [1.5, 48, 48], []);
    const cloudArgs = useMemo<[number, number, number]>(() => [1.52, 48, 48], []);


    useFrame((_, delta) => {
        const opacity = getOpacity(progress.current);
        const visible = opacity > 0.001;

        // Main sphere
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.05;
            meshRef.current.visible = visible;
            meshRef.current.scale.setScalar(0.8 + opacity * 0.2);
        }
        if (materialRef.current) {
            materialRef.current.opacity = opacity;
        }

        // Clouds — counter-rotate slightly faster
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y -= delta * 0.02;
            cloudsRef.current.visible = visible;
            cloudsRef.current.scale.setScalar(0.8 + opacity * 0.2);
        }
        if (cloudMatRef.current) {
            cloudMatRef.current.opacity = opacity * 0.45;
        }


    });

    return (
        <group>
            {/* Earth surface */}
            <mesh ref={meshRef}>
                <sphereGeometry args={sphereArgs} />
                <meshStandardMaterial
                    ref={materialRef}
                    map={dayMap}
                    roughness={0.7}
                    metalness={0.1}
                    transparent
                    opacity={1}
                />
            </mesh>

            {/* Cloud layer */}
            <mesh ref={cloudsRef}>
                <sphereGeometry args={cloudArgs} />
                <meshStandardMaterial
                    ref={cloudMatRef}
                    map={cloudMap}
                    transparent
                    opacity={0.45}
                    depthWrite={false}
                />
            </mesh>


        </group>
    );
}
