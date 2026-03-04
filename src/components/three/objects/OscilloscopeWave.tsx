"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ReactNode } from "react";

const N = 200;

export function OscilloscopeWave(): ReactNode {
    const posArray = useMemo(() => new Float32Array(N * 3), []);

    const geo = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
        return g;
    }, [posArray]);

    const mat = useMemo(
        () => new THREE.LineBasicMaterial({ color: "#00ff41", transparent: true, opacity: 0.55 }),
        [],
    );

    const lineObj = useMemo(() => new THREE.Line(geo, mat), [geo, mat]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        for (let i = 0; i < N; i++) {
            const x = (i / (N - 1)) * 9 - 4.5;
            posArray[i * 3]     = x;
            posArray[i * 3 + 1] =
                Math.sin(x * 2.2 + t * 2.5) * 0.35
              + Math.sin(x * 0.9 + t * 1.1) * 0.15
              + Math.sin(x * 5.0 + t * 4.0) * 0.04;
            posArray[i * 3 + 2] = 0;
        }
        (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    });

    return <primitive object={lineObj} />;
}
