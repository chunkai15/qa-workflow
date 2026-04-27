import { expect, type Locator, type Page } from "@playwright/test";

export class BasePage {
  protected readonly page: Page;
  protected readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = process.env.MARKETPLACE_BASE_URL ?? "https://landing-stg.everfit.io";
  }

  async goto(route: string): Promise<void> {
    const url = new URL(route, this.baseUrl).toString();
    await this.page.goto(url, { waitUntil: "networkidle" });
  }

  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async softExpect(locator: Locator): Promise<void> {
    await expect.soft(locator).toBeVisible();
  }

  async waitForActionable(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
  }

  async debugLog(message: string): Promise<void> {
    await this.page.evaluate((value) => console.info(`[generated-suite] ${value}`), message);
  }
}
