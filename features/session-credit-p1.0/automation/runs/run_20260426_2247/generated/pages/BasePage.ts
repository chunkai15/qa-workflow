import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(route: string) {
        await this.page.goto(route);
        await this.waitForReady();
    }

    async waitForReady() {
        // Wait for skeleton loaders and common loading overlays to clear
        // We first try to wait for the overlay to appear (if it's going to)
        const loadingOverlay = this.page.locator('div:has-text("Getting your data ready")');
        const skeleton = this.page.locator('.ant-skeleton');
        
        // Wait for potential overlay to show up briefly
        await this.page.waitForTimeout(1000); 

        // Now wait for them to disappear
        await loadingOverlay.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
        await skeleton.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
        
        await this.page.waitForLoadState('load');
    }

    async expectVisible(locator: Locator) {
        await expect(locator).toBeVisible();
    }

    async softExpect(locator: Locator) {
        await expect.soft(locator).toBeVisible();
    }
}
