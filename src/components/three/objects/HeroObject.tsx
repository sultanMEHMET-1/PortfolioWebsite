"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMotion } from "@/components/motion/MotionProvider";

export function HeroObject() {
    const meshRef = useRef<THREE.Mesh>(null);
    const { reducedMotion } = useMotion();

    useFrame((state) => {
        if (!meshRef.current || reducedMotion) return;

        const time = state.clock.getElapsedTime();

        // Gentle rotation
        meshRef.current.rotation.y = time * 0.1;
        meshRef.current.rotation.z = time * 0.05;

        // Subtle floating
        meshRef.current.position.y = Math.sin(time * 0.5) * 0.1;

        // Parallax on pointer move
        // We dampen the movement for a premium, heavy feel
        const targetX = (state.pointer.x * 2);
        const targetY = (state.pointer.y * 2);

        meshRef.current.rotation.x += (targetY * 0.1 - meshRef.current.rotation.x) * 0.05;
        meshRef.current.rotation.y += (targetX * 0.1 - meshRef.current.rotation.y) * 0.05;
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            {/* Icosahedron provides a nice geometry that catches light well without being too complex */}
            <icosahedronGeometry args={[2, 1]} />
            <meshStandardMaterial
                color="#ffffff"
                roughness={0.2}
                metalness={0.8}
                wireframe={true}
                transparent
                opacity={0.3}
            />
        </mesh>
    );
}
