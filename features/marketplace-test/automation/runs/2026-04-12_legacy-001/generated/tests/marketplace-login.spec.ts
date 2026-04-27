import { test, expect } from "../fixtures";

test.describe("Marketplace Login and navigate to package", () => {
  test("Marketplace Login success to preview page", async ({ page, loginPage, previewPage }) => {
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
    await previewPage.softExpect(previewPage.packageSidebarLink);
  });
});
