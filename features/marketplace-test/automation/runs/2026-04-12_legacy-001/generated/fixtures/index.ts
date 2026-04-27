import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MarketplacePackagesPage } from "../pages/MarketplacePackagesPage";
import { PackageEditorPage } from "../pages/PackageEditorPage";
import { PreviewPage } from "../pages/PreviewPage";

type Fixtures = {
  loginPage: LoginPage;
  previewPage: PreviewPage;
  marketplacePackagesPage: MarketplacePackagesPage;
  packageEditorPage: PackageEditorPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  previewPage: async ({ page }, use) => {
    await use(new PreviewPage(page));
  },
  marketplacePackagesPage: async ({ page }, use) => {
    await use(new MarketplacePackagesPage(page));
  },
  packageEditorPage: async ({ page }, use) => {
    await use(new PackageEditorPage(page));
  }
});

export { expect };
