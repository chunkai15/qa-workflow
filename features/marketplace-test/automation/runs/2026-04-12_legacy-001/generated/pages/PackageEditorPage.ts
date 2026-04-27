import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PackageEditorPage extends BasePage {
  readonly editorReadyMarker: Locator;
  readonly headlineInput: Locator;
  readonly descriptionEditor: Locator;
  readonly heroImagePlaceholder: Locator;
  readonly editImageButton: Locator;
  readonly heroImageFileInput: Locator;
  readonly uploadedHeroImagePreview: Locator;
  readonly addPricingButton: Locator;
  readonly pricingModalHeading: Locator;
  readonly pricingAmountInput: Locator;
  readonly updatePricingButton: Locator;
  readonly saveButton: Locator;
  readonly publishPackageButton: Locator;
  readonly pricingSummary: Locator;
  readonly publishedSuccessMessage: Locator;
  readonly liveStatusBadge: Locator;
  readonly unpublishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.headlineInput = page.getByRole("textbox", { name: "Package headline goes here" });
    this.editorReadyMarker = this.headlineInput;
    this.descriptionEditor = page.locator(".ql-editor").first();
    this.heroImagePlaceholder = page.locator("button", { hasText: "Edit" }).first().locator("..");
    // Low-confidence locator: captured label is only "Edit", but Stage 1 confirmed this button sits in the hero image area and opens the native file chooser.
    this.editImageButton = page.getByRole("button", { name: "Edit" }).first();
    // Hidden input discovered during Stage 1. Actual UI flow is Edit click -> native chooser window -> file selection -> input receives file.
    this.heroImageFileInput = page.locator('input[type="file"][accept*="image/png"]').nth(0);
    this.uploadedHeroImagePreview = page.locator('img[alt="Image"]').first();
    this.addPricingButton = page.getByRole("button", { name: "Add Pricing" });
    this.pricingModalHeading = page.getByRole("heading", { name: "Package Pricing" });
    this.pricingAmountInput = page.getByRole("textbox", { name: "SET PRICE £" });
    this.updatePricingButton = page.getByRole("button", { name: "Update Pricing" });
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.publishPackageButton = page.getByRole("button", { name: "Publish Package" });
    this.pricingSummary = page.locator("text=One Time").first();
    this.publishedSuccessMessage = page.getByText("Package has been published.");
    this.liveStatusBadge = page.getByText("Live").first();
    this.unpublishButton = page.getByRole("button", { name: "Unpublish" });
  }

  async fillHeadline(value: string): Promise<this> {
    await this.headlineInput.fill(value);
    return this;
  }

  async fillDescription(value: string): Promise<this> {
    await this.descriptionEditor.click();
    await this.descriptionEditor.fill(value);
    return this;
  }

  async uploadHeroImage(filePath: string): Promise<this> {
    await this.expectVisible(this.editImageButton);
    await this.editImageButton.click();
    await this.heroImageFileInput.setInputFiles(filePath);
    await this.assertHeroImageUploaded();
    return this;
  }

  async assertHeroImageUploaded(): Promise<void> {
    await expect(this.uploadedHeroImagePreview).toBeVisible({ timeout: 15000 });
    await expect(this.uploadedHeroImagePreview).toHaveAttribute("src", /https?:\/\/.+/);
  }

  async openPricing(): Promise<this> {
    await this.waitForActionable(this.addPricingButton);
    await this.addPricingButton.click();
    await expect(this.pricingModalHeading).toBeVisible();
    return this;
  }

  async setPrice(value: string): Promise<this> {
    await this.pricingAmountInput.fill(value);
    await this.updatePricingButton.click();
    return this;
  }

  async assertPublishReady(): Promise<void> {
    await expect(this.publishPackageButton).toBeVisible();
    await expect(this.saveButton).toBeVisible();
    await expect(this.saveButton).toBeEnabled({ timeout: 20000 });
    await expect(this.publishPackageButton).toBeEnabled({ timeout: 20000 });
  }

  async assertPublishedSuccessfully(): Promise<void> {
    await this.page.waitForURL(/\/pro\/marketplace-packages\/[^/]+$/, { timeout: 20000 });
    await expect(this.liveStatusBadge).toBeVisible({ timeout: 20000 });
    await expect(this.publishedSuccessMessage).toBeVisible({ timeout: 20000 });
    await expect(this.unpublishButton).toBeVisible({ timeout: 20000 });
  }
}
