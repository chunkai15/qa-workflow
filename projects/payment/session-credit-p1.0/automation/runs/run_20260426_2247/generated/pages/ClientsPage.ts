import { BasePage } from './BasePage';

export class ClientsPage extends BasePage {
    get searchInput() { return this.page.locator('input[placeholder*="Search"]'); }
    
    clientLink(name: string) {
        return this.page.locator('a[href*="/home/client/"]').filter({ hasText: name });
    }

    async openClientProfile(name: string) {
        await this.searchInput.fill(name);
        await this.clientLink(name).first().click();
        await this.waitForReady();
    }
}
