"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ReactNode } from "react";

/** Default seed keeps the field visually stable across dev Strict Mode double-mount. */
const DEFAULT_STARFIELD_SEED = 0xc0ffee;

/**
 * Deterministic PRNG (mulberry32) — avoids Math.random() so layout is reproducible per seed.
 */
function createSeededRng(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Background starfield using InstancedMesh — always visible regardless of scroll.
 * Low segment spheres (4×4) per CLAUDE.md GPU rules.
 */
export function Starfield({
    count = 300,
    seed = DEFAULT_STARFIELD_SEED,
}: {
    count?: number;
    seed?: number;
}): ReactNode {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const { positions, colors, scales } = useMemo(() => {
        const rand = createSeededRng(seed);
        const positions = Array.from({ length: count }, () => [
            (rand() - 0.5) * 40,
            (rand() - 0.5) * 25,
            -5 - rand() * 20,
        ] as [number, number, number]);
        const temp = new Float32Array(count * 3);
        const color = new THREE.Color();
        for (let i = 0; i < count; i++) {
            const brightRoll = rand();
            const brightness = brightRoll > 0.85 ? 2.0 : 0.5 + rand() * 0.4;
            color.setHSL(0.6 + rand() * 0.15, 0.3, brightness);
            color.toArray(temp, i * 3);
        }
        const scales = Array.from({ length: count }, () => 0.01 + rand() * 0.03);
        return { positions, colors: temp, scales };
    }, [count, seed]);

    useFrame(({ clock }) => {
        if (!mesh.current) return;
        const t = clock.getElapsedTime();

        for (let i = 0; i < count; i++) {
            const [x, y, z] = positions[i];
            dummy.position.set(x, y, z);
            // Subtle twinkle via scale oscillation
            const twinkle = scales[i] * (0.8 + 0.2 * Math.sin(t * 2 + i * 1.7));
            dummy.scale.setScalar(twinkle);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        }
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 4, 4]}>
                <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
            </sphereGeometry>
            <meshBasicMaterial toneMapped={false} vertexColors transparent opacity={0.9} />
        </instancedMesh>
    );
}
