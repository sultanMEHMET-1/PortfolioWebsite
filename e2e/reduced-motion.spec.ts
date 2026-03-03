import { test, expect } from "@playwright/test";

test.describe("Reduced Motion", () => {
    test("respects prefers-reduced-motion", async ({ page }) => {
        // Emulate reduced motion
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/");

        // Verify page loads correctly
        await expect(page.locator("h1")).toBeVisible();

        // In reduced motion, scroll reveal elements should be immediately visible
        // (no motion.div wrappers — falls back to plain div)
        // Navigate to projects page to check project grid
        await page.goto("/projects");
        await expect(page.locator("h2")).toContainText("Projects");

        // The page should still be fully functional
        const searchInput = page.locator('input[aria-label="Search projects by name"]');
        if (await searchInput.isVisible()) {
            await searchInput.fill("test");
            await searchInput.clear();
        }
    });

    test("smooth scroll is disabled with reduced motion", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/");

        // CSS should have scroll-behavior: auto with reduced motion
        const scrollBehavior = await page.evaluate(() => {
            return window.getComputedStyle(document.documentElement).scrollBehavior;
        });
        expect(scrollBehavior).toBe("auto");
    });
});
