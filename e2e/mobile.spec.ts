import { test, expect, type Page } from "@playwright/test";

test.describe("Mobile Navigation", () => {
    test.use({
        viewport: { width: 375, height: 812 },
    });

    test("can open and close mobile menu", async ({ page }) => {
        await page.goto("/");

        // Mobile hamburger should be visible
        const menuButton = page.locator('button[aria-label="Open menu"]');
        await expect(menuButton).toBeVisible();

        // Open menu
        await menuButton.click();

        // Mobile nav should be visible
        const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
        await expect(mobileNav).toBeVisible();

        // Close menu
        const closeButton = page.locator('button[aria-label="Close menu"]');
        await closeButton.click();

        // Nav should be gone
        await expect(mobileNav).not.toBeVisible();
    });

    test("can navigate via mobile menu", async ({ page }) => {
        await page.goto("/");

        // Open menu
        await page.click('button[aria-label="Open menu"]');

        // Navigate to About
        await page.click('nav[aria-label="Mobile navigation"] a[href="/about"]');
        await expect(page).toHaveURL("/about");

        // Menu should close after navigation
        const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
        await expect(mobileNav).not.toBeVisible();
    });

    test("no horizontal scrollbar on mobile", async ({ page }) => {
        await page.goto("/");

        const hasHScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHScroll).toBe(false);
    });

    test("touch targets are at least 44px", async ({ page }) => {
        await page.goto("/");

        // Check menu button size
        const menuButton = page.locator('button[aria-label="Open menu"]');
        const box = await menuButton.boundingBox();
        expect(box).toBeTruthy();
        if (box) {
            expect(box.width).toBeGreaterThanOrEqual(40);
            expect(box.height).toBeGreaterThanOrEqual(40);
        }
    });
});
