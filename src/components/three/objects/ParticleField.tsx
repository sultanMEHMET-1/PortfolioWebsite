/* eslint-disable react-hooks/purity */
"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ReactNode } from "react";

// World-space point size (sizeAttenuation makes this perspective-correct)
const POINT_SIZE = 0.1275;

// Soft circular sprite: white center fading to transparent edge
function createCircleTexture(): THREE.Texture {
    const size = 32;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.8)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
}

export function ParticleField({ count = 500 }: { count?: number }): ReactNode {
    const geometryRef = useRef<THREE.BufferGeometry>(null);

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

    // Static base positions — each particle's resting position
    const basePositions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3]     = (Math.random() - 0.5) * 25;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 25;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
        }
        return arr;
    }, [count]);

    // Live positions buffer mutated in-place every frame
    const positions = useMemo(() => new Float32Array(basePositions), [basePositions]);

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

    const texture = useMemo(() => createCircleTexture(), []);

    useEffect(() => {
        return () => texture.dispose();
    }, [texture]);

    useFrame(({ clock }) => {
        if (!geometryRef.current) return;
        const t = clock.getElapsedTime();

        // Smooth mouse with lerp so movement is never jarring
        smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.05;
        smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.05;

        const mx = smoothMouse.current.x;
        const my = smoothMouse.current.y;

        // Write animated positions directly into the flat buffer — no matrix math
        for (let i = 0; i < count; i++) {
            const bx = basePositions[i * 3];
            const by = basePositions[i * 3 + 1];
            const bz = basePositions[i * 3 + 2];
            // Ambient wavy drift + smooth pointer parallax
            const depthParallax = (bz + 10) / 10;
            positions[i * 3]     = bx + Math.sin(t * 0.3 + i * 0.7) * 0.3 + mx * depthParallax * 2;
            positions[i * 3 + 1] = by + Math.cos(t * 0.2 + i * 0.7) * 0.3 + my * depthParallax * 2;
            positions[i * 3 + 2] = bz;
        }

        geometryRef.current.attributes.position.needsUpdate = true;
    });

    return (
        <points>
            <bufferGeometry ref={geometryRef}>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={POINT_SIZE}
                sizeAttenuation
                vertexColors
                transparent
                opacity={0.85}
                alphaMap={texture}
                alphaTest={0.01}
                toneMapped={false}
                depthWrite={false}
            />
        </points>
    );
}
