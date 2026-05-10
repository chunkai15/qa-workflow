import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    get emailInput() { return this.page.locator('input[placeholder="Your Email Address"]'); }
    get passwordInput() { return this.page.locator('input[placeholder="Password"]'); }
    get loginBtn() { return this.page.locator('button:has-text("Login")'); }

    async login(email: string, pass: string) {
        if (!email || !pass) {
            throw new Error('LoginPage.login: email or pass is undefined. Please set TEST_EMAIL and TEST_PASSWORD env vars.');
        }
        await this.emailInput.waitFor({ state: 'visible' });
        await this.emailInput.click();
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Backspace');
        await this.emailInput.fill(email);
        await this.passwordInput.fill(pass);
        await this.loginBtn.click();
        await this.page.waitForURL(/.*\/home\/.*/, { timeout: 30000 });
        await this.waitForReady();
    }
}
