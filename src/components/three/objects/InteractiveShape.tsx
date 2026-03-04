"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ReactNode } from "react";

export function InteractiveShape(): ReactNode {
    const mesh = useRef<THREE.Mesh>(null);
    const material = useRef<THREE.MeshStandardMaterial>(null);
    const [hovered, setHover] = useState(false);

    // Cache allocations to avoid per-frame GC pressure
    const _targetVec = useMemo(() => new THREE.Vector3(), []);
    const _targetColor = useMemo(() => new THREE.Color(), []);

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += delta * 0.15;
            mesh.current.rotation.y += delta * 0.25;
            const s = hovered ? 1.4 : 1;
            mesh.current.scale.lerp(_targetVec.set(s, s, s), 0.08);
        }
        if (material.current) {
            _targetColor.set(hovered ? "#a5b4fc" : "#4f46e5");
            material.current.color.lerp(_targetColor, 0.1);
        }
    });

    return (
        <group position={[0, -1, -5]}>
            <mesh
                ref={mesh}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <torusKnotGeometry args={[2.5, 0.8, 100, 24]} />
                <meshStandardMaterial ref={material} color="#4f46e5" roughness={0.1} metalness={0.8} />
            </mesh>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={3} />
            <pointLight position={[-10, -10, -5]} intensity={1} color="#818cf8" />
        </group>
    );
}
