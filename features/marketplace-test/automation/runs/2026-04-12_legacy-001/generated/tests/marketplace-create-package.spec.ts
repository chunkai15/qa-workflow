import { test, expect } from "../fixtures";
import { buildDescription, buildHeadline, buildPackageName, resolveUploadFixtureFromEnv } from "../support/runtime";

test.describe("Marketplace package creation", () => {
  test("Create and publish a new package from marketplace packages page", async ({
    page,
    loginPage,
    previewPage,
    marketplacePackagesPage,
    packageEditorPage
  }) => {
    const packageName = buildPackageName();
    const headline = buildHeadline();
    const description = buildDescription();
    const uploadPath = process.env.MARKETPLACE_UPLOAD_DIR;

    // Given user is on Web platform https://landing-stg.everfit.io/pro/login
    // And the web application is accessible with browser basic authentication
    await loginPage.gotoLogin();

    // When user opens the web application with basic auth credentials
    // And user logs in successfully with valid "coach" credentials
    await loginPage.loginAsCoach();

    // Then user should be redirected to the dashboard at "/pro/preview"
    await expect(page).toHaveURL(/\/pro\/preview$/);

    // And page should be fully loaded with navigation sidebar visible
    await previewPage.expectVisible(previewPage.publicProfileLink);

    // When user clicks on "Package" menu item in sidebar navigation
    await previewPage.gotoPackages();

    // Then user should navigate to "/pro/marketplace-packages"
    await expect(page).toHaveURL(/\/pro\/marketplace-packages$/);

    // And packages table should be displayed with package data
    await marketplacePackagesPage.expectVisible(marketplacePackagesPage.packagesTable);

    // When user clicks the "Create package" button
    await marketplacePackagesPage.openCreatePackageModal();

    // Then the "Create New Package" popup should be displayed
    await marketplacePackagesPage.expectVisible(marketplacePackagesPage.createNewPackageHeading);

    // When user enters a random package name with 90 characters
    // And user clicks the "Create New" button
    await marketplacePackagesPage.createNewPackage(packageName);

    // Then user should navigate to "/pro/marketplace-packages/create"
    await expect(page).toHaveURL(/\/pro\/marketplace-packages\/create$/);
    await packageEditorPage.expectVisible(packageEditorPage.editorReadyMarker);

    // When user enters a random headline
    await packageEditorPage.fillHeadline(headline);

    // And user enters a random description
    await packageEditorPage.fillDescription(description);

    // And user clicks the "Edit image" button
    await packageEditorPage.expectVisible(packageEditorPage.editImageButton);

    // And user uploads any image from "D:\Local Disk (E)\Tester\Images Fitness"
    // Context: Edit button in the hero image area opens the native file chooser window; the chosen file is then applied through the hidden file input.
    if (uploadPath) {
      await packageEditorPage.uploadHeroImage(resolveUploadFixtureFromEnv());
      await packageEditorPage.assertHeroImageUploaded();
    } else {
      test.info().annotations.push({
        type: "NEEDS_HUMAN_REVIEW",
        description: "MARKETPLACE_UPLOAD_DIR is required to execute the upload flow."
      });
    }

    // And user clicks the package pricing section
    // Then the "Package Pricing" popup should be displayed
    await packageEditorPage.openPricing();

    // When user sets a random package price
    // And user clicks the "Update Pricing" button
    await packageEditorPage.setPrice("49");
    await packageEditorPage.expectVisible(packageEditorPage.pricingSummary);

    // And user clicks the "Publish Package" button
    // Image upload is treated as a publish prerequisite in the reviewed context.
    await packageEditorPage.assertPublishReady();
    await packageEditorPage.publishPackageButton.click();

    // Then the package should be published successfully
    await packageEditorPage.assertPublishedSuccessfully();
  });
});
