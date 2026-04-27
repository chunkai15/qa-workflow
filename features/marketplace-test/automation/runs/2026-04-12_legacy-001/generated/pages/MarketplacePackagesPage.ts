import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MarketplacePackagesPage extends BasePage {
  readonly heading: Locator;
  readonly createPackageButton: Locator;
  readonly packagesTable: Locator;
  readonly createNewPackageHeading: Locator;
  readonly packageNameInput: Locator;
  readonly createNewButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: "Marketplace Packages" });
    this.createPackageButton = page.getByRole("button", { name: "Create Package" });
    this.packagesTable = page.locator("table").first();
    this.createNewPackageHeading = page.getByText("Create New Package");
    this.packageNameInput = page.getByRole("textbox", { name: "Enter package name" });
    this.createNewButton = page.getByRole("button", { name: "Create New" });
  }

  async openCreatePackageModal(): Promise<this> {
    await this.waitForActionable(this.createPackageButton);
    await this.createPackageButton.click();
    return this;
  }

  async createNewPackage(name: string): Promise<this> {
    await this.packageNameInput.fill(name);
    await this.createNewButton.click();
    return this;
  }
}
