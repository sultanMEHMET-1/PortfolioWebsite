# Agent Instructions

These instructions must be followed by any AI agent working on this repository.

## Mandatory Testing Requirements

After **every single functional change or feature addition**, you MUST verify the project before committing or notifying the user.

1. **Run Unit and Component Tests**: 
   - Command: `npm run test`
   - Purpose: Ensure no regressions in data structures, date utilities, filtering logic, and base component rendering.

2. **Run Interactive E2E Playwright Tests**: 
   - You MUST run Playwright to actually interact with the GUI and verify the site's functionality.
   - Run Background Server: `npm run dev`
   - Test Command: `npm run test:e2e`
   - Purpose: Ensure navigation, mobile responsiveness, project tag filtering, search logic, and accessibility rules (including `prefers-reduced-motion`) remain intact on the live DOM.

3. **Verify Build**:
   - Command: `npm run build`
   - Purpose: Ensure Next.js statically compiles all routes without TypeScript compilation errors.

If any test or build step fails, you must debug and resolve the issue before proceeding to commit your changes. Do not ask for permission to fix broken tests related to your changes.

4. **Always Run the Full Test Suite**:
   - After **any** change — no matter how small — run `npm run test`, `npm run test:e2e`, and `npm run build` in that order.
   - Never skip a step. Never assume a "safe" change doesn't need testing.

## Graphics & GPU Performance

This site uses Three.js / React Three Fiber with multiple WebGL canvases. Keep these rules in mind:

- **Minimize per-frame allocations**: Never use `new THREE.Vector3()`, `new THREE.Color()`, or similar inside `useFrame`. Cache them with `useMemo` or `useRef`.
- **Keep geometry segments low**: Particles at small scale don't need high segment counts (6×6 spheres are fine). Torus knots and complex shapes should use the minimum segments that look smooth at their rendered size.
- **Bloom resolution**: Use `resolutionScale={0.5}` on `<Bloom>` passes — half-res bloom is visually identical for soft glows and saves significant fill-rate.
- **Pointer tracking**: Use `window.addEventListener('mousemove')` instead of R3F's built-in `pointer` when DOM elements overlay the canvas (z-index layers). R3F's pointer freezes when events don't reach the canvas.
- **Always test at 60fps**: After any 3D change, visually verify in the browser that animations run smoothly and never freeze or stutter.
