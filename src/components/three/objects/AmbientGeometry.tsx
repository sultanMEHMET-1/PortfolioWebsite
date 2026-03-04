"use client";

import { Float } from "@react-three/drei";
import { MicrocontrollerBoard } from "./MicrocontrollerBoard";
import type { ReactNode } from "react";

export function AmbientGeometry(): ReactNode {
    return (
        <>
            {/* ESP32 & STM32 line drawings — replace the first wireframe shape */}
            <MicrocontrollerBoard
                variant="esp32"
                position={[-3.5, -0.5, -4.5]}
                scale={1.6}
                opacity={0.14}
                color="#6366f1"
            />
            <MicrocontrollerBoard
                variant="stm32"
                position={[-1.8, -2.8, -6]}
                scale={1.3}
                opacity={0.10}
                color="#818cf8"
            />

            <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
                <mesh position={[4, 2, -10]} scale={3.5}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshBasicMaterial color="#818cf8" wireframe transparent opacity={0.1} />
                </mesh>
            </Float>

            <Float speed={2} rotationIntensity={0.8} floatIntensity={1}>
                <mesh position={[0, -5, -8]} scale={2}>
                    <tetrahedronGeometry args={[1, 0]} />
                    <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.12} />
                </mesh>
            </Float>
        </>
    );
}
