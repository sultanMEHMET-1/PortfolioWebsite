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

// Vertex shader: per-vertex size via attribute, perspective-correct point size
const VERT = /* glsl */`
attribute float size;
attribute vec3 color;
varying vec3 vColor;

void main() {
  vColor = color;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  // 250.0 tuned to the camera distance used in SpaceScene
  gl_PointSize = size * (250.0 / -mvPos.z);
  gl_Position = projectionMatrix * mvPos;
}
`;

// Fragment shader: gaussian glow falloff → soft circular star
const FRAG = /* glsl */`
varying vec3 vColor;
uniform float uOpacity;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv) * 2.0;   // 0 at center, 1 at edge
  if (r > 1.0) discard;          // circular clip
  float alpha = exp(-r * r * 3.5); // gaussian glow falloff
  gl_FragColor = vec4(vColor, alpha * uOpacity);
}
`;

const STAR_COUNT      = 30000;
const NEBULA_COUNT    = 600;
const ARM_COUNT       = 4;
const GALAXY_RADIUS   = 4.5;
const GALAXY_THICKNESS = 0.4;
const CORE_DENSITY    = 0.30;   // fraction of stars in bright core

/** Build spiral galaxy point geometry. */
function buildGalaxyGeometry(count: number, forNebula: boolean): THREE.BufferGeometry {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const sizes     = new Float32Array(count);
    const color     = new THREE.Color();

    for (let i = 0; i < count; i++) {
        const isCore = i < count * CORE_DENSITY;

        let x: number, y: number, z: number;

        if (isCore) {
            // Dense bright core — gaussian-like distribution
            const r     = Math.pow(Math.random(), 2) * GALAXY_RADIUS * 0.3;
            const theta = Math.random() * Math.PI * 2;
            x = Math.cos(theta) * r;
            z = Math.sin(theta) * r;
            y = (Math.random() - 0.5) * GALAXY_THICKNESS * (1 - r / (GALAXY_RADIUS * 0.3));
        } else {
            // Spiral arms — logarithmic spiral
            const arm           = Math.floor(Math.random() * ARM_COUNT);
            const armAngleOffset = (arm / ARM_COUNT) * Math.PI * 2;
            const t             = Math.pow(Math.random(), 0.6);
            const r             = t * GALAXY_RADIUS;
            const spiralAngle   = armAngleOffset + t * Math.PI * 2.5;

            // Tighter spread at inner radii → more defined arms
            const spread        = (0.08 + t * 0.25) * (Math.random() - 0.5);
            const armSpreadAngle = spiralAngle + spread;

            x = Math.cos(armSpreadAngle) * r;
            z = Math.sin(armSpreadAngle) * r;
            y = (Math.random() - 0.5) * GALAXY_THICKNESS * (1 - t * 0.7);
        }

        positions[i * 3]     = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        if (forNebula) {
            // Nebula layer: warm amber glow, very faint
            color.setHSL(0.08 + Math.random() * 0.06, 0.5, 0.6 + Math.random() * 0.4);
            sizes[i] = 0.4 + Math.random() * 0.8;
        } else if (isCore) {
            // Core: amber-orange, bright
            const brightness = 2.0 + Math.random() * 2.5;
            color.setHSL(0.07 + Math.random() * 0.05, 0.7, brightness);
            sizes[i] = 0.018 + Math.random() * 0.022;
        } else {
            // Arm stars: realistic stellar color distribution
            const rand = Math.random();
            if (rand > 0.95) {
                // Rare pink/magenta — nebula emission regions
                color.setHSL(0.82 + Math.random() * 0.08, 0.5, 1.5 + Math.random());
                sizes[i] = 0.012 + Math.random() * 0.013;
            } else if (rand > 0.80) {
                // Bright blue-white hot young stars
                color.setHSL(0.58 + Math.random() * 0.12, 0.6, 2.0 + Math.random());
                sizes[i] = 0.012 + Math.random() * 0.013;
            } else if (rand > 0.50) {
                // Mid blue — cooler arm stars
                color.setHSL(0.60 + Math.random() * 0.12, 0.4, 0.5 + Math.random() * 0.6);
                sizes[i] = 0.006 + Math.random() * 0.008;
            } else {
                // Dim warm halo stars — faint amber/yellow at outer edges
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
    const groupRef       = useRef<THREE.Group>(null);
    const starMatRef     = useRef<THREE.ShaderMaterial>(null);
    const nebulaMatRef   = useRef<THREE.ShaderMaterial>(null);

    const starGeometry   = useMemo(() => buildGalaxyGeometry(STAR_COUNT,   false), []);
    const nebulaGeometry = useMemo(() => buildGalaxyGeometry(NEBULA_COUNT, true),  []);

    // Shader uniforms — mutated in useFrame, never recreated
    const starUniforms   = useMemo(() => ({ uOpacity: { value: 0 } }), []);
    const nebulaUniforms = useMemo(() => ({ uOpacity: { value: 0 } }), []);

    useFrame((_, delta) => {
        const opacity = getOpacity(progress.current);

        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.04;
            groupRef.current.visible = opacity > 0.001;
        }
        if (starMatRef.current)   starMatRef.current.uniforms.uOpacity.value   = opacity;
        // Nebula glow is extra faint — cap at 0.4 of main opacity
        if (nebulaMatRef.current) nebulaMatRef.current.uniforms.uOpacity.value = opacity * 0.4;
    });

    const sharedMatProps = {
        vertexShader:   VERT,
        fragmentShader: FRAG,
        transparent:    true,
        blending:       THREE.AdditiveBlending,
        depthWrite:     false,
    } as const;

    return (
        <group
            ref={groupRef}
            position={[0, 0, -1]}
            rotation={[0.5, 0, 0.15]}
        >
            {/* Diffuse nebula glow — unresolved star haze */}
            <points geometry={nebulaGeometry}>
                <shaderMaterial
                    ref={nebulaMatRef}
                    uniforms={nebulaUniforms}
                    {...sharedMatProps}
                />
            </points>

            {/* 30k star points with per-vertex size and circular glow */}
            <points geometry={starGeometry}>
                <shaderMaterial
                    ref={starMatRef}
                    uniforms={starUniforms}
                    {...sharedMatProps}
                />
            </points>
        </group>
    );
}
