"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { ReactNode } from "react";

interface MilkyWayProps {
    progress: MutableRefObject<number>;
}

/** Visible from 0.86 onward: fades in 0.86–1.00 */
function getOpacity(p: number): number {
    if (p < 0.86) return 0;
    return (p - 0.86) / 0.14;
}

// Per-vertex size drives gl_PointSize; camera at z=5, galaxy at z=-1.
const VERT = /* glsl */`
attribute float size;
attribute vec3 color;
varying vec3 vColor;

void main() {
  vColor = color;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (250.0 / -mvPos.z);
  gl_Position = projectionMatrix * mvPos;
}
`;

// Soft circular glow: gaussian falloff on gl_PointCoord.
// Factor 2.5 (was 3.5) gives slightly wider glow so the dense core
// accumulates naturally via additive blending.
const FRAG = /* glsl */`
varying vec3 vColor;
uniform float uOpacity;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv) * 2.0;
  if (r > 1.0) discard;
  float alpha = exp(-r * r * 2.5);
  gl_FragColor = vec4(vColor, alpha * uOpacity);
}
`;

const STAR_COUNT       = 30000;
const ARM_COUNT        = 4;
const GALAXY_RADIUS    = 4.5;
const GALAXY_THICKNESS = 0.4;
const CORE_FRACTION    = 0.25;  // 25% core
const DISK_FRACTION    = 0.20;  // 20% faint background disk (fills inter-arm gaps)
// remaining 55% are spiral arm stars

function buildStarGeometry(): THREE.BufferGeometry {
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors    = new Float32Array(STAR_COUNT * 3);
    const sizes     = new Float32Array(STAR_COUNT);
    const color     = new THREE.Color();

    const coreEnd = Math.floor(STAR_COUNT * CORE_FRACTION);
    const diskEnd = Math.floor(STAR_COUNT * (CORE_FRACTION + DISK_FRACTION));

    for (let i = 0; i < STAR_COUNT; i++) {
        const isCore = i < coreEnd;
        const isDisk = i >= coreEnd && i < diskEnd;

        let x: number, y: number, z: number;

        if (isCore) {
            const r     = Math.pow(Math.random(), 2) * GALAXY_RADIUS * 0.3;
            const theta = Math.random() * Math.PI * 2;
            x = Math.cos(theta) * r;
            z = Math.sin(theta) * r;
            y = (Math.random() - 0.5) * GALAXY_THICKNESS * (1 - r / (GALAXY_RADIUS * 0.3));
        } else if (isDisk) {
            // Uniform area distribution fills the inter-arm gaps
            const r     = Math.sqrt(Math.random()) * GALAXY_RADIUS;
            const theta = Math.random() * Math.PI * 2;
            x = Math.cos(theta) * r;
            z = Math.sin(theta) * r;
            y = (Math.random() - 0.5) * GALAXY_THICKNESS * 0.6;
        } else {
            const arm            = Math.floor(Math.random() * ARM_COUNT);
            const armAngleOffset = (arm / ARM_COUNT) * Math.PI * 2;
            const t              = Math.pow(Math.random(), 0.6);
            const r              = t * GALAXY_RADIUS;
            const spiralAngle    = armAngleOffset + t * Math.PI * 2.5;
            // Wider spread than before so arms bleed into inter-arm space
            const spread         = (0.12 + t * 0.35) * (Math.random() - 0.5);
            x = Math.cos(spiralAngle + spread) * r;
            z = Math.sin(spiralAngle + spread) * r;
            y = (Math.random() - 0.5) * GALAXY_THICKNESS * (1 - t * 0.7);
        }

        positions[i * 3]     = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        if (isCore) {
            color.setHSL(0.07 + Math.random() * 0.05, 0.7, 2.0 + Math.random() * 2.5);
            sizes[i] = 0.022 + Math.random() * 0.028;
        } else if (isDisk) {
            // Very faint warm stars — subtle fill, not competing with arms
            color.setHSL(0.06 + Math.random() * 0.08, 0.2, 0.15 + Math.random() * 0.2);
            sizes[i] = 0.004 + Math.random() * 0.004;
        } else {
            const rand = Math.random();
            if (rand > 0.95) {
                color.setHSL(0.82 + Math.random() * 0.08, 0.5, 1.5 + Math.random());
                sizes[i] = 0.012 + Math.random() * 0.013;
            } else if (rand > 0.80) {
                color.setHSL(0.58 + Math.random() * 0.12, 0.6, 2.0 + Math.random());
                sizes[i] = 0.012 + Math.random() * 0.013;
            } else if (rand > 0.50) {
                color.setHSL(0.60 + Math.random() * 0.12, 0.4, 0.5 + Math.random() * 0.6);
                sizes[i] = 0.006 + Math.random() * 0.008;
            } else {
                color.setHSL(0.05 + Math.random() * 0.10, 0.3, 0.3 + Math.random() * 0.4);
                sizes[i] = 0.006 + Math.random() * 0.006;
            }
        }

        colors[i * 3]     = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(colors,    3));
    geo.setAttribute("size",     new THREE.BufferAttribute(sizes,     1));
    return geo;
}

export function MilkyWay({ progress }: MilkyWayProps): ReactNode {
    const groupRef  = useRef<THREE.Group>(null);
    const matRef    = useRef<THREE.ShaderMaterial>(null);
    const geometry  = useMemo(() => buildStarGeometry(), []);
    const uniforms  = useMemo(() => ({ uOpacity: { value: 0 } }), []);

    useFrame((_, delta) => {
        const opacity = getOpacity(progress.current);
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.04;
            groupRef.current.visible = opacity > 0.001;
        }
        if (matRef.current) matRef.current.uniforms.uOpacity.value = opacity;
    });

    return (
        <group
            ref={groupRef}
            position={[0, 0, -1]}
            rotation={[0.5, 0, 0.15]}
        >
            <points geometry={geometry}>
                <shaderMaterial
                    ref={matRef}
                    uniforms={uniforms}
                    vertexShader={VERT}
                    fragmentShader={FRAG}
                    transparent
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </group>
    );
}
