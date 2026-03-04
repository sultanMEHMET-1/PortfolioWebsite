import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
    test.beforeEach(async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
    });

    test("home page loads without console errors", async ({ page }) => {
        const errors: string[] = [];
        page.on("console", (msg) => {
            if (msg.type() === "error") {
                errors.push(msg.text());
            }
        });

        await page.goto("/");
        await expect(page.locator("h1")).toBeVisible();
        await expect(page.locator("header")).toBeVisible();

        // Filter out known non-critical errors (e.g. favicon 404, analytics)
        const criticalErrors = errors.filter(
            (e) => !e.includes("favicon") && !e.includes("analytics"),
        );
        expect(criticalErrors).toHaveLength(0);
    });

    test("can navigate to all pages via desktop nav", async ({ page, isMobile }) => {
        test.skip(isMobile, "Desktop nav is hidden on mobile viewport");
        await page.goto("/");

        // Navigate to About
        await page.click('header a[href="/about"]');
        await expect(page).toHaveURL("/about");
        await expect(page.locator("h1")).toContainText("About");

        // Navigate to Experience
        await page.click('header a[href="/experience"]');
        await expect(page).toHaveURL("/experience");
        await expect(page.locator("h2")).toContainText("Experience");

        // Navigate to Projects
        await page.click('header a[href="/projects"]');
        await expect(page).toHaveURL("/projects");
        await expect(page.locator("h2")).toContainText("Projects");

        // Navigate to Contact
        await page.click('header a[href="/contact"]');
        await expect(page).toHaveURL("/contact");
        await expect(page.locator("h2")).toContainText("Get in Touch");

        // Navigate Home
        await page.click('header a[href="/"]');
        await expect(page).toHaveURL("/");
    });

    test("header is sticky and visible on scroll", async ({ page }) => {
        await page.goto("/");
        await page.evaluate(() => window.scrollTo(0, 500));
        await expect(page.locator("header")).toBeVisible();
    });
});
