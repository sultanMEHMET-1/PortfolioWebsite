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
