import { BasePage } from './BasePage';

export class CalendarPage extends BasePage {
    get calendarGrid() { return this.page.locator('.rbc-calendar'); }
    
    async scheduleSession(sessionTypeName: string) {
        // This is complex, will need specific time slot
        // For now, clicking a generic slot
        await this.calendarGrid.click({ position: { x: 200, y: 200 } });
        // Fill session type and confirm
        await this.page.locator('.ui.dropdown').click();
        await this.page.locator(`div.item:has-text("${sessionTypeName}")`).click();
        await this.page.locator('button:has-text("Confirm")').click();
        await this.waitForReady();
    }

    async cancelSession(mode: 'Early' | 'Late') {
        await this.page.locator('.rbc-event').last().click();
        await this.page.locator('button:has-text("Cancel")').click();
        await this.page.locator(`label:has-text("${mode} Cancel")`).click();
        await this.page.locator('button:has-text("Confirm")').click();
        await this.waitForReady();
    }
}
