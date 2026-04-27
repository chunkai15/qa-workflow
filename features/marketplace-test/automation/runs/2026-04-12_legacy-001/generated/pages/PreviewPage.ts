import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PreviewPage extends BasePage {
  readonly pageHeading: Locator;
  readonly packageSidebarLink: Locator;
  readonly publicProfileLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole("heading", { name: "Marketplace" });
    this.packageSidebarLink = page.locator('a[href="/pro/marketplace-packages"]').first();
    this.publicProfileLink = page.locator('a[href="/pro/preview"]').first();
  }

  async gotoPackages(): Promise<this> {
    await this.waitForActionable(this.packageSidebarLink);
    await this.packageSidebarLink.click();
    return this;
  }
}
