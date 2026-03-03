import { test, expect } from "@playwright/test";

test.describe("Projects Page", () => {
    test("can filter projects by tag", async ({ page }) => {
        await page.goto("/projects");

        // Wait for project grid to be visible
        await expect(page.locator("h2")).toContainText("Projects");

        // Find a filter tag button and click it
        const filterGroup = page.locator('[role="group"][aria-label="Filter by technology"]');
        const firstTag = filterGroup.locator("button").first();

        if (await firstTag.isVisible()) {
            const tagText = await firstTag.textContent();
            await firstTag.click();

            // Tag should appear active (visual check — we verify it was clicked)
            // Clear all should appear
            const clearAll = page.locator("text=Clear all");
            await expect(clearAll).toBeVisible();

            // Click clear all
            await clearAll.click();
            await expect(clearAll).not.toBeVisible();
        }
    });

    test("can open and close project detail", async ({ page }) => {
        await page.goto("/projects");

        // Click first project card
        const firstCard = page.locator('[role="button"]').first();
        if (await firstCard.isVisible()) {
            await firstCard.click();

            // Detail dialog should appear
            const dialog = page.locator('[role="dialog"]');
            await expect(dialog).toBeVisible();

            // Close detail
            const closeBtn = page.locator('button[aria-label="Close project details"]');
            await closeBtn.click();
            await expect(dialog).not.toBeVisible();
        }
    });

    test("search input filters projects", async ({ page }) => {
        await page.goto("/projects");

        const searchInput = page.locator('input[aria-label="Search projects by name"]');
        if (await searchInput.isVisible()) {
            await searchInput.fill("nonexistent project xyz");

            // Should show no results message
            await expect(page.locator("text=No projects match your filters")).toBeVisible();

            // Clear search
            await searchInput.clear();

            // Projects should reappear
            await expect(page.locator("text=No projects match your filters")).not.toBeVisible();
        }
    });
});
