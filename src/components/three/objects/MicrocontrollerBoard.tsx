"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import type { ReactNode } from "react";

type LEDConfig = { pos: [number, number, number]; color: string; freq: number };

function LEDArray({ leds }: { leds: LEDConfig[] }): ReactNode {
    const refs = useRef<(THREE.Mesh | null)[]>([]);
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        leds.forEach((led, i) => {
            const m = refs.current[i];
            if (!m) return;
            const blink = Math.sin(t * led.freq * Math.PI * 2) * 0.5 + 0.5;
            (m.material as THREE.MeshBasicMaterial).opacity = blink * 0.85 + 0.05;
        });
    });
    return (
        <>
            {leds.map((led, i) => (
                <mesh key={i} ref={(el) => { refs.current[i] = el; }} position={led.pos}>
                    <sphereGeometry args={[0.016, 6, 4]} />
                    <meshBasicMaterial color={led.color} transparent opacity={0.5} />
                </mesh>
            ))}
        </>
    );
}

const ESP32_LEDS: LEDConfig[] = [
    { pos: [-0.32, -0.80, 0.05], color: "#22c55e", freq: 0.8 },
    { pos: [-0.20, -0.80, 0.05], color: "#3b82f6", freq: 3.8 },
    { pos: [ 0.46, -0.28, 0.03], color: "#22c55e", freq: 2.1 },
    { pos: [-0.46, -0.28, 0.03], color: "#f59e0b", freq: 1.7 },
];

type BoardVariant = "esp32" | "stm32";

interface MicrocontrollerBoardProps {
    variant: BoardVariant;
    position?: [number, number, number];
    scale?: number;
    opacity?: number;
    color?: string;
    lineWidth?: number;
}

/**
 * Build detailed 3D line-segment position data for a microcontroller board.
 * Returns a flat Float32Array of (x1,y1,z1, x2,y2,z2) pairs suitable for
 * LineSegmentsGeometry.setPositions().
 */
function buildBoardPositions(variant: BoardVariant): Float32Array {
    const lines: number[] = [];

    // 2D helpers (z=0)
    const addLine = (x1: number, y1: number, x2: number, y2: number) => {
        lines.push(x1, y1, 0, x2, y2, 0);
    };

    const addRect = (cx: number, cy: number, w: number, h: number) => {
        const l = cx - w / 2, r = cx + w / 2, b = cy - h / 2, t = cy + h / 2;
        addLine(l, b, r, b);
        addLine(r, b, r, t);
        addLine(r, t, l, t);
        addLine(l, t, l, b);
    };

    // 3D helpers
    const addLine3D = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
        lines.push(x1, y1, z1, x2, y2, z2);
    };

    // 3D box: top face + 4 vertical corner edges (no bottom face — rests on PCB)
    const addBox = (cx: number, cy: number, w: number, h: number, z0: number, zTop: number) => {
        const l = cx - w / 2, r = cx + w / 2, b = cy - h / 2, t = cy + h / 2;
        addLine3D(l, b, zTop, r, b, zTop); addLine3D(r, b, zTop, r, t, zTop);
        addLine3D(r, t, zTop, l, t, zTop); addLine3D(l, t, zTop, l, b, zTop);
        addLine3D(l, b, z0, l, b, zTop);   addLine3D(r, b, z0, r, b, zTop);
        addLine3D(r, t, z0, r, t, zTop);   addLine3D(l, t, z0, l, t, zTop);
    };

    // Circle in XY plane at fixed Z
    const addCircleXY = (cx: number, cy: number, r: number, segs: number, z: number) => {
        for (let s = 0; s < segs; s++) {
            const a1 = (s / segs) * Math.PI * 2, a2 = ((s + 1) / segs) * Math.PI * 2;
            addLine3D(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r, z,
                      cx + Math.cos(a2) * r, cy + Math.sin(a2) * r, z);
        }
    };

    // Cylinder: two circles + vertical edge lines
    const addCylinder = (cx: number, cy: number, r: number, z0: number, zTop: number, sides: number) => {
        addCircleXY(cx, cy, r, sides, z0);
        addCircleXY(cx, cy, r, sides, zTop);
        for (let s = 0; s < sides; s++) {
            const a = (s / sides) * Math.PI * 2;
            addLine3D(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z0,
                      cx + Math.cos(a) * r, cy + Math.sin(a) * r, zTop);
        }
    };

    const bw = 1.0;
    const bh = variant === "esp32" ? 2.0 : 1.8;

    // === PCB BODY ===
    addRect(0, 0, bw, bh);
    // PCB thickness: 4 corner vertical edges
    addLine3D(-bw / 2, -bh / 2, 0, -bw / 2, -bh / 2, -0.03);
    addLine3D( bw / 2, -bh / 2, 0,  bw / 2, -bh / 2, -0.03);
    addLine3D( bw / 2,  bh / 2, 0,  bw / 2,  bh / 2, -0.03);
    addLine3D(-bw / 2,  bh / 2, 0, -bw / 2,  bh / 2, -0.03);

    if (variant === "esp32") {
        // === PIN HEADERS (19 per side, ESP32-DevKitC standard) ===
        const pinCount = 19;
        const pinYStart = -0.85;
        const pinSpacing = 1.70 / 18;   // ≈ 0.0944
        const pinX = 0.46;
        const pinSize = 0.04;

        for (let i = 0; i < pinCount; i++) {
            const py = pinYStart + i * pinSpacing;
            addRect(-pinX, py, pinSize, pinSize);           // left pad at z=0
            addRect( pinX, py, pinSize, pinSize);           // right pad at z=0
            addLine3D(-pinX, py, 0, -pinX, py, -0.25);     // left through-hole pin
            addLine3D( pinX, py, 0,  pinX, py, -0.25);     // right through-hole pin
        }
        // Header housing blocks (one per side)
        addBox(-pinX, 0, 0.08, 1.78, 0, 0.06);
        addBox( pinX, 0, 0.08, 1.78, 0, 0.06);

        // === ESP32 MODULE (sub-board with shield) ===
        addBox(0, 0.32, 0.70, 0.70, 0, 0.08);
        // Inner chip rect on top surface of module (at z=0.08)
        addLine3D(-0.09, 0.23, 0.08,  0.09, 0.23, 0.08);
        addLine3D( 0.09, 0.23, 0.08,  0.09, 0.41, 0.08);
        addLine3D( 0.09, 0.41, 0.08, -0.09, 0.41, 0.08);
        addLine3D(-0.09, 0.41, 0.08, -0.09, 0.23, 0.08);
        // Pin-1 marker (diamond)
        const dotCx = -0.06, dotCy = 0.38, dotS = 0.015;
        addLine3D(dotCx - dotS, dotCy, 0.08, dotCx, dotCy + dotS, 0.08);
        addLine3D(dotCx, dotCy + dotS, 0.08, dotCx + dotS, dotCy, 0.08);
        addLine3D(dotCx + dotS, dotCy, 0.08, dotCx, dotCy - dotS, 0.08);
        addLine3D(dotCx, dotCy - dotS, 0.08, dotCx - dotS, dotCy, 0.08);
        // Module corner mounting pads
        addCircleXY(-0.31,  0.63, 0.025, 8, 0.08);
        addCircleXY( 0.31,  0.63, 0.025, 8, 0.08);
        addCircleXY(-0.31,  0.01, 0.025, 8, 0.08);
        addCircleXY( 0.31,  0.01, 0.025, 8, 0.08);

        // === ANTENNA MEANDER TRACE (PCB trace above module, z=0.08) ===
        // Notch walls at z=0 (board cutout outline, 3 sides)
        addLine3D(-0.11, 0.67, 0, -0.11, 0.97, 0);
        addLine3D(-0.11, 0.97, 0,  0.11, 0.97, 0);
        addLine3D( 0.11, 0.97, 0,  0.11, 0.67, 0);
        // Feed line from center of module top up to first track
        addLine3D(0, 0.67, 0.08, 0, 0.693, 0.08);
        // 5 horizontal tracks + 4 vertical connectors (serpentine meander)
        const antLeft = -0.11, antRight = 0.11;
        const antYs = [0.670, 0.740, 0.810, 0.880, 0.950];
        for (let i = 0; i < 5; i++) {
            const ty = antYs[i];
            const goLeft = i % 2 === 0;
            addLine3D(goLeft ? antLeft : antRight, ty, 0.08,
                      goLeft ? antRight : antLeft, ty, 0.08);
            if (i < 4) {
                const connX = goLeft ? antRight : antLeft;
                addLine3D(connX, ty, 0.08, connX, antYs[i + 1], 0.08);
            }
        }

        // === USB MICRO-B CONNECTOR (at bottom edge) ===
        addBox(0, -0.945, 0.22, 0.11, -0.03, 0.07);
        for (let p = 0; p < 5; p++) {
            const px = -0.07 + p * 0.035;
            addLine3D(px, -0.90, -0.01, px, -0.90, 0.05);  // 5 pin contacts
        }
        addLine3D(-0.05, -0.89, 0.07, 0.05, -0.89, 0.07);  // retention notch

        // === TACTILE BUTTONS (EN Reset + Boot/Flash) ===
        for (const [bx, by] of [[0.32, 0.62], [0.32, -0.62]] as [number, number][]) {
            addBox(bx, by, 0.09, 0.09, 0, 0.06);
            addCircleXY(bx, by, 0.028, 10, 0.068);   // domed button cap
        }

        // === USB BRIDGE CHIP (CP2102-like, SSOP package) ===
        addBox(-0.08, -0.58, 0.20, 0.14, 0, 0.04);
        const chipLeadPitch = 0.14 / 7;
        for (let l = 0; l < 8; l++) {
            const ly = -0.58 - 0.07 + l * chipLeadPitch;
            addLine3D(-0.10, ly, 0.02, -0.14, ly, 0.02);   // left leads
            addLine3D( 0.02, ly, 0.02,  0.06, ly, 0.02);   // right leads
        }

        // === LDO VOLTAGE REGULATOR (SOT-89) ===
        addBox(0.30, -0.42, 0.06, 0.10, 0, 0.04);
        for (let p = 0; p < 3; p++) {
            const px = 0.27 + p * 0.03;
            addLine3D(px, -0.47, 0, px, -0.51, 0);         // 3 leads
        }

        // === STATUS LEDs (0402 SMD) ===
        addBox(-0.32, -0.80, 0.04, 0.025, 0, 0.025);       // power LED
        addBox(-0.20, -0.80, 0.04, 0.025, 0, 0.025);       // user LED

        // === DECOUPLING CAPS (8 × 0402, distributed around module) ===
        const decCaps: [number, number][] = [
            [-0.41, 0.52], [-0.41, 0.22], [-0.41, 0.07],
            [ 0.41, 0.52], [ 0.41, 0.22],
            [-0.20, -0.09], [0.10, -0.09], [0.25, -0.09],
        ];
        for (const [cx, cy] of decCaps) addBox(cx, cy, 0.05, 0.025, 0, 0.025);

        // === BULK FILTER CAPACITOR (electrolytic, cylindrical) ===
        addCylinder(0.18, -0.78, 0.05, 0, 0.09, 8);
        addLine3D(0.18, -0.73, 0.09, 0.21, -0.73, 0.09);  // polarity mark

        // === MOUNTING HOLES (12-seg inner + outer courtyard) ===
        for (const [hx, hy] of [[-0.42, -0.92], [0.42, -0.92], [-0.42, 0.92], [0.42, 0.92]] as [number, number][]) {
            addCircleXY(hx, hy, 0.04, 12, 0);              // drill hole
            addCircleXY(hx, hy, 0.07, 12, 0);              // courtyard ring
        }

    } else {
        // === STM32 VARIANT ===

        // Pin headers with through-hole pins
        const pinCount = 12;
        const pinSpacing = (bh - 0.4) / pinCount;
        const pinSize = 0.04;
        const pinX = bw / 2 - 0.06;
        const startY = -bh / 2 + 0.25;

        for (let i = 0; i < pinCount; i++) {
            const py = startY + i * pinSpacing;
            addRect(-pinX, py, pinSize, pinSize);
            addRect( pinX, py, pinSize, pinSize);
            addLine3D(-pinX, py, 0, -pinX, py, -0.20);
            addLine3D( pinX, py, 0,  pinX, py, -0.20);
        }

        // LQFP chip with visible leads on all 4 sides
        addBox(0, 0.1, 0.35, 0.35, 0, 0.04);
        const lqfpLeads = 10;
        const lqfpPitch = 0.35 / (lqfpLeads - 1);
        for (let l = 0; l < lqfpLeads; l++) {
            const offset = -0.175 + l * lqfpPitch;
            addLine3D( offset,  0.275, 0.02,  offset,  0.315, 0.02);   // top
            addLine3D( offset, -0.075, 0.02,  offset, -0.115, 0.02);   // bottom
            addLine3D(-0.275, 0.1 + offset, 0.02, -0.315, 0.1 + offset, 0.02);  // left
            addLine3D( 0.275, 0.1 + offset, 0.02,  0.315, 0.1 + offset, 0.02);  // right
        }
        // Pin-1 dot (diamond)
        const stmDotCx = -0.14, stmDotCy = 0.22, stmDotS = 0.025;
        addLine(stmDotCx - stmDotS, stmDotCy, stmDotCx, stmDotCy + stmDotS);
        addLine(stmDotCx, stmDotCy + stmDotS, stmDotCx + stmDotS, stmDotCy);
        addLine(stmDotCx + stmDotS, stmDotCy, stmDotCx, stmDotCy - stmDotS);
        addLine(stmDotCx, stmDotCy - stmDotS, stmDotCx - stmDotS, stmDotCy);

        // Crystal oscillator (HC-49 package)
        addBox(0.2, -0.35, 0.12, 0.06, 0, 0.05);
        addLine3D(0.16, -0.38, 0, 0.16, -0.42, 0);
        addLine3D(0.24, -0.38, 0, 0.24, -0.42, 0);

        // Reset button (3D)
        addBox(-0.3, -0.55, 0.09, 0.09, 0, 0.06);
        addCircleXY(-0.3, -0.55, 0.028, 10, 0.068);

        // Boot0 jumper
        addRect(0.3, -0.55, 0.06, 0.1);
        addBox(0.3, -0.52, 0.05, 0.05, 0, 0.04);

        // Passive components
        addRect(-0.2, -0.3, 0.06, 0.03);
        addRect(-0.2, -0.4, 0.06, 0.03);
        addRect( 0.2,  0.4, 0.06, 0.03);
        addRect(-0.15, 0.5, 0.08, 0.04);

        // Mounting holes with courtyard rings
        for (const [hx, hy] of [
            [-bw / 2 + 0.08, -bh / 2 + 0.08],
            [ bw / 2 - 0.08, -bh / 2 + 0.08],
            [-bw / 2 + 0.08,  bh / 2 - 0.08],
            [ bw / 2 - 0.08,  bh / 2 - 0.08],
        ] as [number, number][]) {
            addCircleXY(hx, hy, 0.04, 12, 0);
            addCircleXY(hx, hy, 0.07, 12, 0);
        }
    }

    return new Float32Array(lines);
}

// Default line width in pixels
const DEFAULT_LINE_WIDTH = 1.6;

export function MicrocontrollerBoard({
    variant,
    position = [0, 0, 0],
    scale = 1,
    opacity = 0.12,
    color = "#ffffff",
    lineWidth = DEFAULT_LINE_WIDTH,
}: MicrocontrollerBoardProps): ReactNode {
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<LineMaterial | null>(null);
    const { size } = useThree();

    // Track mouse globally (never freezes behind DOM overlays)
    const mouse = useRef({ x: 0, y: 0 });
    // Start at isometric diagonal (steep X tilt, moderate Y yaw)
    const smoothRot = useRef({ x: -0.85, y: 0.45 });

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    // LineMaterial needs viewport resolution for correct pixel-space line width
    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.resolution.set(size.width, size.height);
        }
    }, [size]);

    const lineSegmentsObject = useMemo(() => {
        const positions = buildBoardPositions(variant);
        const geo = new LineSegmentsGeometry();
        geo.setPositions(positions);

        const mat = new LineMaterial({
            color: new THREE.Color(color),
            linewidth: lineWidth,
            transparent: true,
            opacity,
            // Resolution is updated via the effect above; provide initial value
            resolution: new THREE.Vector2(
                typeof window !== "undefined" ? window.innerWidth : 1920,
                typeof window !== "undefined" ? window.innerHeight : 1080,
            ),
        });
        materialRef.current = mat;

        return new LineSegments2(geo, mat);
    }, [variant, color, lineWidth, opacity]);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const t = clock.getElapsedTime();

        // Base rest angle (isometric diagonal) + mouse offset; 30% more sensitive
        const targetRotX = -0.85 + (-mouse.current.y * 0.975);
        const targetRotY =  0.45 + (-mouse.current.x * 1.3);
        smoothRot.current.x += (targetRotX - smoothRot.current.x) * 0.03;
        smoothRot.current.y += (targetRotY - smoothRot.current.y) * 0.03;

        // Ambient gentle auto-rotation + drift
        groupRef.current.rotation.x = smoothRot.current.x + Math.sin(t * 0.15) * 0.08;
        groupRef.current.rotation.y = smoothRot.current.y + Math.cos(t * 0.12) * 0.08;
        groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.03;

        // Subtle float drift
        groupRef.current.position.x = position[0] + Math.sin(t * 0.2) * 0.15;
        groupRef.current.position.y = position[1] + Math.cos(t * 0.18) * 0.1;
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            <primitive object={lineSegmentsObject} />
            {variant === "esp32" && <LEDArray leds={ESP32_LEDS} />}
        </group>
    );
}
