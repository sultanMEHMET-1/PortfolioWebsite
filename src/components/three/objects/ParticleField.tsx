/* eslint-disable react-hooks/purity */
"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ReactNode } from "react";

export function ParticleField({ count = 500 }: { count?: number }): ReactNode {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Track mouse globally so it never freezes when DOM overlays block the canvas
    const mouse = useRef({ x: 0, y: 0 });
    const smoothMouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            // Normalize to -1..1 just like R3F's pointer
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    const positions = useMemo(() => {
        return Array.from({ length: count }, () => [
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 15 - 5,
        ]);
    }, [count]);

    const colors = useMemo(() => {
        const temp = new Float32Array(count * 3);
        const color = new THREE.Color();
        for (let i = 0; i < count; i++) {
            const isBright = Math.random() > 0.8;
            color.setHSL(0.65 + Math.random() * 0.1, 0.9, isBright ? 2.5 : 0.4);
            color.toArray(temp, i * 3);
        }
        return temp;
    }, [count]);

    useFrame(({ clock }) => {
        if (!mesh.current) return;
        const t = clock.getElapsedTime();

        // Smooth mouse with lerp so movement is never jarring
        smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.05;
        smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.05;

        const mx = smoothMouse.current.x;
        const my = smoothMouse.current.y;

        positions.forEach(([x, y, z], i) => {
            // Ambient wavy drift (always active) + smooth pointer parallax
            const depthParallax = (z + 10) / 10;
            dummy.position.set(
                x + Math.sin(t * 0.3 + i * 0.7) * 0.3 + mx * depthParallax * 2,
                y + Math.cos(t * 0.2 + i * 0.7) * 0.3 + my * depthParallax * 2,
                z
            );
            dummy.scale.setScalar(0.03 + Math.sin(t + i) * 0.01);
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
            <meshBasicMaterial toneMapped={false} vertexColors transparent opacity={0.8} />
        </instancedMesh>
    );
}
