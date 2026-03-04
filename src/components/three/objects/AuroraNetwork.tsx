/* eslint-disable react-hooks/purity */
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ReactNode } from "react";

export function AuroraNetwork({ count = 200 }: { count?: number }): ReactNode {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const positions = useMemo(() => {
        return Array.from({ length: count }, () => [
            (Math.random() - 0.5) * 30, // Spread across width
            (Math.random() - 0.5) * 5 - 2,  // Keep near bottom
            (Math.random() - 0.5) * 10 - 5, // Depth
        ]);
    }, [count]);

    const colors = useMemo(() => {
        const temp = new Float32Array(count * 3);
        const color = new THREE.Color();
        for (let i = 0; i < count; i++) {
            const isBright = Math.random() > 0.7;
            color.setHSL(0.7 + Math.random() * 0.15, 0.9, isBright ? 2.5 : 0.4);
            color.toArray(temp, i * 3);
        }
        return temp;
    }, [count]);

    useFrame(({ clock }) => {
        if (!mesh.current) return;
        const t = clock.getElapsedTime() * 0.4;

        positions.forEach(([x, y, z], i) => {
            dummy.position.set(
                x + Math.sin(t + i) * 1.5,
                y + Math.cos(t * 0.8 + i) * 0.8,
                z + Math.sin(t * 1.2 + i) * 1
            );
            dummy.scale.setScalar(0.04 + Math.sin(t + i) * 0.02);
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 6, 6]}>
                <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
            </sphereGeometry>
            <meshBasicMaterial toneMapped={false} vertexColors transparent opacity={0.6} />
        </instancedMesh>
    );
}
