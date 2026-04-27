import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly googleButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole("textbox", { name: "Your email..." });
    this.passwordInput = page.getByRole("textbox", { name: "Your password..." });
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.googleButton = page.getByRole("button", { name: "Continue with Google" });
  }

  private buildAuthenticatedUrl(route: string): string {
    const basicUser = process.env.BASIC_AUTH_USER;
    const basicPass = process.env.BASIC_AUTH_PASS;
    const url = new URL(route, this.baseUrl);

    if (basicUser && basicPass) {
      url.username = basicUser;
      url.password = basicPass;
    }

    return url.toString();
  }

  async gotoLogin(): Promise<void> {
    await this.page.goto(this.buildAuthenticatedUrl("/pro/login"), { waitUntil: "networkidle" });
  }

  async fillCredentials(email: string, password: string): Promise<this> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeEnabled();
    return this;
  }

  async submit(expectedUrl: RegExp = /\/pro\/preview$/): Promise<this> {
    await this.waitForActionable(this.loginButton);
    await Promise.all([
      this.page.waitForURL(expectedUrl, { timeout: 15000 }),
      this.loginButton.click()
    ]);
    return this;
  }

  async loginAsCoach(): Promise<this> {
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;

    if (!email || !password) {
      throw new Error("TEST_EMAIL and TEST_PASSWORD must be set for runtime execution.");
    }

    await this.gotoLogin();
    await this.fillCredentials(email, password);
    await this.submit();
    return this;
  }
}
