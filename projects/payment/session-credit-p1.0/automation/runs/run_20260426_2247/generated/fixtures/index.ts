import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SessionTypesPage } from '../pages/SessionTypesPage';
import { ClientsPage } from '../pages/ClientsPage';
import { ClientProfilePage } from '../pages/ClientProfilePage';
import { CalendarPage } from '../pages/CalendarPage';

type MyFixtures = {
    loginPage: LoginPage;
    sessionTypesPage: SessionTypesPage;
    clientsPage: ClientsPage;
    clientProfilePage: ClientProfilePage;
    calendarPage: CalendarPage;
};

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    sessionTypesPage: async ({ page }, use) => {
        await use(new SessionTypesPage(page));
    },
    clientsPage: async ({ page }, use) => {
        await use(new ClientsPage(page));
    },
    clientProfilePage: async ({ page }, use) => {
        await use(new ClientProfilePage(page));
    },
    calendarPage: async ({ page }, use) => {
        await use(new CalendarPage(page));
    },
});

export { expect } from '@playwright/test';
