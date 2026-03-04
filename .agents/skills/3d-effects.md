# 3D Effects

> Use Three.js / React Three Fiber for subtle WebGL effects that add depth and polish without overwhelming content. Used correctly, 3D separates a site from typical portfolios. Used excessively, it becomes a distraction.

## When to apply
- Portfolio hero sections needing a distinctive signature
- Landing pages where you want to establish a premium, technical aesthetic
- When the project explicitly supports WebGL (check `three` or `@react-three/fiber` in `package.json`)
- Only when the effect supports the content — never for its own sake

## Concrete values

### Performance Budgets
| Metric | Target | Hard limit |
|---|---|---|
| Triangle count (background scene) | < 50k | < 100k |
| Draw calls | < 20 | < 50 |
| Texture size | 512×512 each | 1024×1024 |
| Target frame rate | 60fps | > 30fps minimum |
| Canvas overlay opacity | 0.3-0.7 | Max 0.9 (content must be readable) |
| Fallback on low-end GPU | Static image | No WebGL crash |

### GPU Mercy Defaults
| Setting | Default | Notes |
|---|---|---|
| `dpr` | `[1, 1.5]` | Raise to 2 only if needed |
| `powerPreference` | `"low-power"` | For background/ambient scenes |
| Animated meshes | ≤ 3 | Keep motion subtle and slow |
| Post-processing | 0 by default | Add at most 1 effect if required |

### Camera Setup
```
Field of View: 60-75° (75° default for depth, 60° for flatter look)
Near clip: 0.1
Far clip: 1000
Position z: 5 (start here, adjust per scene)
```

### Subtle Effect Types (pick one per page)
| Effect | Use case | Complexity |
|---|---|---|
| Floating geometry | Portfolio hero, ambient depth | Low |
| Shader gradient background | Landing page, tech aesthetic | Medium |
| Particle system | Dark themes, interactive atmosphere | Medium |
| Post-processing (bloom, DOF) | Photography portfolios, premium brands | High |
| Interactive cursor mesh | Portfolio signature interaction | High |

## Decision framework
- **If** first time using R3F → start with floating geometry, not shaders
- **If** content-heavy page → use as background (z-index behind content), not foreground
- **If** mobile device → detect and render static image fallback
- **If** user prefers reduced motion → stop all animation (`useFrame` should check this)
- **If** scene doesn't run at 60fps → reduce geometry, merge geometries, or cut the effect
- **If** scene is mostly static → use `frameloop="demand"` and avoid continuous `useFrame`
- **If** the effect takes > 2 days to implement well → use Spline embed instead (simpler, performant)

## Code examples

### R3F — Project Setup
```tsx
// app/providers.tsx or layout.tsx
import { Canvas } from '@react-three/fiber';

export function Scene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ fov: 75, position: [0, 0, 5] }}
        dpr={[1, 1.5]}                  // limit pixel ratio for GPU mercy
        gl={{ antialias: false, powerPreference: 'low-power' }}
        performance={{ min: 0.5 }}      // allow adaptive quality
      >
        <FloatingGeometry />
      </Canvas>
    </div>
  );
}
```

### R3F — Floating Geometry (Simple, Performant)
```tsx
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

function FloatingMesh({ position, scale }) {
  const meshRef = useRef();
  const shouldReduce = useReducedMotion();

  useFrame((state) => {
    if (shouldReduce || !meshRef.current) return;
    // Mutations in useFrame, NEVER React state
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#6366f1" wireframe opacity={0.4} transparent />
    </mesh>
  );
}

export function FloatingGeometry() {
  // useMemo to avoid recreating positions on every render
  const positions = useMemo(() => [
    [2, 1, -2], [-2, -1, -3], [1, -2, -1]
  ], []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {positions.map((pos, i) => (
        <FloatingMesh key={i} position={pos} scale={0.8 - i * 0.1} />
      ))}
    </>
  );
}
```

### R3F — Shader Background Gradient
```tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

const GradientMaterial = shaderMaterial(
  { uTime: 0, uColor1: new THREE.Color('#6366f1'), uColor2: new THREE.Color('#0f0f0f') },
  // vertex shader
  `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  // fragment shader
  `uniform float uTime; uniform vec3 uColor1; uniform vec3 uColor2;
   varying vec2 vUv;
   void main() {
     float dist = length(vUv - 0.5);
     float wave = sin(dist * 8.0 - uTime * 0.5) * 0.05;
     vec3 color = mix(uColor1, uColor2, dist + wave);
     gl_FragColor = vec4(color, 1.0);
   }`
);
extend({ GradientMaterial });

function GradientBackground() {
  const matRef = useRef();
  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uTime = clock.elapsedTime;
  });
  return (
    <mesh scale={[20, 20, 1]}>
      <planeGeometry args={[1, 1]} />
      <gradientMaterial ref={matRef} />
    </mesh>
  );
}
```

### R3F — Mobile Fallback
```tsx
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';

function SceneWrapper() {
  const [supportsWebGL, setSupportsWebGL] = useState(true);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) setSupportsWebGL(false);

    // Also disable on mobile to save battery
    if (window.innerWidth < 768) setSupportsWebGL(false);
  }, []);

  if (!supportsWebGL) {
    return <div className="fixed inset-0 -z-10 bg-neutral-950" />;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <FloatingGeometry />
      </Canvas>
    </div>
  );
}
```

### Spline Embed (Simpler Alternative)
```tsx
// Use @splinetool/react-spline for pre-built 3D scenes
import Spline from '@splinetool/react-spline';

export function SplineScene() {
  return (
    <div className="w-full h-full">
      <Spline scene="https://prod.spline.design/[scene-id]/scene.splinecode" />
    </div>
  );
}
// Spline is much faster to implement for non-technical scenes
// Use when: decorative blobs, animated logos, product mockups
```

## Anti-patterns
| Bad | Why | Fix |
|---|---|---|
| `setState` inside `useFrame` | Re-renders on every frame (60x/sec) | Use `ref.current.property =` direct mutation |
| `new THREE.Vector3()` inside `useFrame` | GC pressure, causes frame drops | `useMemo(() => new THREE.Vector3(), [])` |
| Complex scene on mobile | Battery drain, laggy on low-end | Detect and show static fallback |
| Stacked post-processing (bloom + DOF + aberration) | Heavy GPU cost for little gain | Use at most one effect or none |
| 3D effect with higher z-index than content | Content unreadable | Always use `-z-10`, `pointer-events-none` |
| Full-color saturated 3D scene | Competes with page content | Use low-opacity, wireframe, or monochrome |
| Forgetting to dispose geometries/materials | Memory leaks | Return cleanup in `useEffect` |

## Tool-specific guidance
- **@react-three/drei**: use `<Detailed>` (LOD) for complex models. Use `<Environment>` for IBL lighting. Use `<Html>` to mix DOM elements in 3D.
- **@react-three/postprocessing**: use `<Bloom>`, `<DepthOfField>`, `<ChromaticAberration>` for cinematic effects. Expensive — test FPS.
- **dpr**: cap at `dpr={[1, 1.5]}` for background scenes; never exceed 2.
- **Performance monitoring**: `import { Perf } from 'r3f-perf'` for dev monitoring. Remove before shipping.

## Done checks
- [ ] Scene runs at 60fps on a mid-range device (test in Chrome devtools throttled).
- [ ] Static image or solid color fallback exists for mobile and non-WebGL browsers.
- [ ] 3D canvas is behind content (`-z-10`) with `pointer-events-none`.
- [ ] No `setState` calls inside `useFrame` — only direct ref mutations.
- [ ] `prefers-reduced-motion` stops all animation in `useFrame`.
- [ ] Triangle count below 50k for background scenes.
- [ ] `dpr` capped at `[1, 1.5]` for background scenes (never above 2).
- [ ] Geometries and materials disposed when component unmounts.
