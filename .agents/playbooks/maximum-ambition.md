# Maximum Ambition Mode

**Goal**: Build a website that looks like it took a team of designers and engineers weeks to ship. Not just clean — genuinely impressive. The kind of site someone screenshots and sends to a group chat.

**This playbook overrides the defaults in `frontend-remake.md` toward maximum visual effort.**

---

## Minimum Requirements to Ship (Hard Floor)

Before calling this done, count what you have built:

| Category | Minimum | Good | Elite |
|---|---|---|---|
| 3D scenes | 2 sections | 3-4 sections | 5+ distinct scenes |
| Scroll-driven animations | 3 elements | 6+ elements | Every section has one |
| Micro-interactions | Buttons + cards | + links + inputs | + cursor + magnetic |
| Animation systems used | 1 (CSS) | 2 (Framer + GSAP) | 3 (Framer + GSAP + R3F) |
| Distinct section layouts | 2 | 4 | Every section different |

**If you are below "Good" in any category, do not stop. Keep building.**

---

## 3D — One Per Section, Not One Per Site

The mistake is using 3D once (hero wireframe) and considering it done. That is the minimum. This is the full requirement:

### Required 3D placements

**1. Hero background** — not a single floating shape.
Build a particle field, shader gradient, or geometric constellation. Examples:
- 200-500 small floating particles that respond to cursor position
- Animated shader with noise-based distortion cycling through 2-3 colors
- Constellation of interconnected nodes that breathe

```tsx
// Example: Particle field — NOT a single icosahedron
function ParticleField({ count = 300 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const positions = useMemo(() =>
    Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10,
    ]), [count]);

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    positions.forEach(([x, y, z], i) => {
      dummy.position.set(
        x + Math.sin(t * 0.3 + i) * 0.05,
        y + Math.cos(t * 0.2 + i) * 0.05 + pointer.y * 0.5,
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
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.6} />
    </instancedMesh>
  );
}
```

**2. About section** — ambient floating geometry behind the content.
2-4 slow-rotating abstract shapes, very low opacity (0.08-0.15), large scale. They should feel like depth, not decoration.

**3. Skills or features section** — interactive 3D element.
Options:
- Skill icons rendered as 3D objects that spin on hover
- A rotating sphere with skill names mapped to its surface (using `<Html>` from drei)
- Abstract shape that morphs between states on interaction

**4. Projects section** (optional but encouraged) — subtle per-card depth.
Each project card could have a tiny canvas showing a simple 3D scene related to the project's stack (a React logo in 3D space, etc.) — or a shared ambient canvas behind the grid.

**5. Footer / bottom** — terminal scene or ambient loop.
A dark canvas with slow-moving abstract lines, shader noise, or aurora-effect gradients.

---

## Scroll Animation — Every Section Must Respond

Install and configure GSAP ScrollTrigger + Lenis. Then:

### Required scroll behaviors

| Section | Required animation |
|---|---|
| Hero | Text stagger reveal (eyebrow → heading → body → CTA), 0.1s between |
| Features/Skills | Cards enter from below (y: 60 → 0) with stagger, `scrub: false`, `once: true` |
| About | Text and image split — text slides from left, image slides from right |
| Projects | Large project images use subtle parallax (`yPercent: -10` scrub) |
| Contact | Heading has a slow character-by-character reveal using GSAP `SplitText` or manual split |
| Between sections | Full page section — pin it while scroll progress drives an animation |

### Pinned scroll section (minimum one required)
```js
// One section must be pinned and scroll-driven
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.process-section',
    pin: true,
    start: 'top top',
    end: '+=200%',
    scrub: 1,
  }
});
tl.from('.step-1', { opacity: 0, y: 50 })
  .from('.step-2', { opacity: 0, y: 50 }, '+=0.3')
  .from('.step-3', { opacity: 0, y: 50 }, '+=0.3');
```

---

## Signature Interactions (All Required in Maximum Ambition Mode)

### 1. Custom cursor
Replace the browser cursor with a custom dot + ring. The dot follows instantly; the ring follows with spring lag.

```tsx
// Custom cursor — dot + trailing ring
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener('mousemove', onMove);

    let raf: number;
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-900 rounded-full pointer-events-none z-[9999] mix-blend-difference" />
      <div ref={ringRef} className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-neutral-900 rounded-full pointer-events-none z-[9999] mix-blend-difference" />
    </>
  );
}
// Add cursor-none to <html> so browser cursor hides
```

### 2. Magnetic buttons
Primary CTA buttons attract the cursor. The button moves up to 8px toward the cursor on hover.

```tsx
function MagneticButton({ children, ...props }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) / (rect.width / 2);
    const distY = (e.clientY - centerY) / (rect.height / 2);
    setPosition({ x: distX * 8, y: distY * 8 });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.button>
  );
}
```

### 3. Text that reveals character by character
Hero heading should not simply fade in. Split it and animate each character:

```tsx
function SplitHeading({ text }: { text: string }) {
  const words = text.split(' ');
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } }
  };
  const wordVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -30 },
    visible: { opacity: 1, y: 0, rotateX: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };
  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ perspective: 1000 }}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
```

### 4. Page transitions
Route changes should not be instant. Use Framer Motion `AnimatePresence` on the root layout:

```tsx
// layout.tsx
<AnimatePresence mode="wait">
  <motion.main
    key={pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.main>
</AnimatePresence>
```

---

## Visual Ambition Rules

These override `policies/creative-constraints.md` for maximum ambition mode:

1. **Dark mode as default** — dark backgrounds allow 3D and glow effects to land better. Use `oklch(0.1 0.005 240)` as the base background.
2. **Glow effects are allowed** — box-shadows with color (not just neutral) are permitted for accent elements: `box-shadow: 0 0 40px oklch(0.55 0.15 270 / 0.3)`.
3. **Gradient text is encouraged** — for hero headings: `background: linear-gradient(135deg, #fff 0%, oklch(0.75 0.12 270) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
4. **Noise texture overlay** — add a subtle SVG noise texture at 3-5% opacity over the entire page for premium texture.
5. **At least one full-bleed section with a 3D canvas** as the background (not just in the hero).
6. **Post-processing on at least one canvas** — add `@react-three/postprocessing` with `<Bloom>` (`intensity: 0.5, luminanceThreshold: 0.8`) for glowing elements.

---

## What "Lazy" Looks Like — Do Not Ship These

- A single wireframe icosahedron slowly rotating in the hero
- Only CSS transitions for hover states — no Framer Motion or spring physics
- Every section using the same fade-up scroll reveal
- No cursor customization
- Scroll animations that only affect opacity (add `y` and `scale` transforms)
- 3D only in the hero, everywhere else is static
- A single gradient as the "visual interest" for a section
- Cards that only change shadow on hover

---

## Pre-Ship Checklist for Maximum Ambition Mode

- [ ] 3D canvas exists in at least 3 separate sections
- [ ] At least 2 different 3D effect types (e.g., particles AND geometry AND shader)
- [ ] Custom cursor implemented (unless mobile — disable on touch devices)
- [ ] GSAP ScrollTrigger used on at least 5 elements with varied animations
- [ ] Lenis smooth scroll initialized
- [ ] At least one pinned scroll section
- [ ] Framer Motion spring physics on all interactive elements
- [ ] Magnetic effect on primary CTA(s)
- [ ] Hero heading is split and character/word-animated
- [ ] Page transitions on route changes
- [ ] Post-processing bloom on at least one canvas
- [ ] Dark theme as default
- [ ] Gradient or variable-font effect on hero heading
- [ ] Reduced motion fallback still works correctly
- [ ] Performance: 60fps maintained in Chrome throttled CPU 4x slowdown
