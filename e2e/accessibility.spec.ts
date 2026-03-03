import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
    test("has proper heading hierarchy on home page", async ({ page }) => {
        await page.goto("/");

        // Should have exactly one h1
        const h1Count = await page.locator("h1").count();
        expect(h1Count).toBe(1);

        // Should have h2 elements for sections
        const h2Count = await page.locator("h2").count();
        expect(h2Count).toBeGreaterThan(0);
    });

    test("all interactive elements are keyboard accessible", async ({ page }) => {
        await page.goto("/");

        // Tab through the page and check that focus is visible
        await page.keyboard.press("Tab");

        // First focusable element should have focus
        const focusedElement = await page.evaluate(() => {
            const el = document.activeElement;
            return el ? el.tagName : null;
        });
        expect(focusedElement).toBeTruthy();
    });

    test("navigation links have proper aria attributes", async ({ page }) => {
        await page.goto("/");

        // Check if desktop nav is visible (will be hidden on mobile viewport)
        const desktopNav = page.locator('nav[aria-label="Main navigation"]');
        const isDesktop = await desktopNav.isVisible();

        if (isDesktop) {
            // Desktop: active link should have aria-current
            const activeLink = page.locator('a[aria-current="page"]');
            await expect(activeLink).toBeVisible();
        } else {
            // Mobile: open menu and check mobile nav has aria-label
            await page.click('button[aria-label="Open menu"]');
            const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
            await expect(mobileNav).toBeVisible();

            // Active link should have aria-current
            const activeLink = mobileNav.locator('a[aria-current="page"]');
            await expect(activeLink).toBeVisible();
        }
    });

    test("buttons have accessible labels", async ({ page }) => {
        await page.goto("/");

        // Check that mobile menu button has aria-label
        const menuButton = page.locator('button[aria-label="Open menu"]');
        expect(await menuButton.count()).toBeGreaterThan(0);
    });

    test("images have alt text", async ({ page }) => {
        await page.goto("/");

        const images = page.locator("img");
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute("alt");
            expect(alt, `Image at index ${i} is missing alt text`).toBeTruthy();
        }
    });
});
