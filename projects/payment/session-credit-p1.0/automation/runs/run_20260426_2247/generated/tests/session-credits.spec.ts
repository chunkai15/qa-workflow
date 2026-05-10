import { test, expect } from '../fixtures';
import { testData } from '../data/test-data';

// feature: features/session-credit-p1.0/automation/input/session-credit-p1.0.feature
// context: features/session-credit-p1.0/automation/runs/run_20260426_2247/context-bundle.md

test.describe.configure({ mode: 'serial' });

test.describe('Session Credits P1.0', () => {
    // Cấu hình viewport 1440x900
    test.use({ viewport: { width: 1440, height: 900 } });
    
    let sessionTypeName: string;
    const clientName = testData.client.name;

    test.beforeEach(async ({ loginPage }) => {
        // Given user starts at "/"
        // And user has valid runtime credentials for role "coach"
        await loginPage.goto('https://everfit:everfit@AQAJ1tuGK@staging.everfit.io/login');
        await loginPage.login(testData.auth.email, testData.auth.password);
    });

    test('Coach creates a Session Type that requires credit', async ({ page, sessionTypesPage }) => {
        sessionTypeName = `CreditReq_${Math.floor(Math.random() * 10000)}`;
        
        // Given user is on "/session-types"
        await sessionTypesPage.goto('https://everfit:everfit@AQAJ1tuGK@staging.everfit.io/home/booking/session-types');
        
        // When user clicks the "Add New Session Type" action
        // And user enters a random "session_type_name" value
        // And user sets the "Require session credit" toggle to "ON"
        // And user clicks the "Create" button
        await sessionTypesPage.createCreditRequiredSessionType(sessionTypeName);
        
        // Then the new session type should be visible in the list
        await sessionTypesPage.searchSessionType(sessionTypeName);
        
        // Xác nhận tên Session Type hiển thị trên màn hình
        await expect(page.getByText(sessionTypeName)).toBeVisible({ timeout: 10000 });
    });

    test('Coach issues session credits to a connected client', async ({ clientsPage, clientProfilePage }) => {
        // Buộc phải dùng sessionTypeName từ Scenario 1
        const targetSessionType = sessionTypeName;
        if (!targetSessionType) throw new Error('sessionTypeName was not captured from Scenario 1');
        
        // Given user is on "/clients"
        await clientsPage.goto('https://everfit:everfit@AQAJ1tuGK@staging.everfit.io/home/client');
        
        // And user opens a connected client profile
        await clientsPage.openClientProfile(clientName);
        
        // When user clicks the "Sessions" tab
        // And user clicks the "Credits" tab
        await clientProfilePage.navigateToCredits();
        
        const initialBalance = await clientProfilePage.getAvailableBalance(targetSessionType);
        
        // And user clicks the "+ Issue Credits" button
        // Then the "Issue Session Credits" modal should be visible
        // When user selects the newly created session type from the "Session type" dropdown
        // And user enters a random "credit_quantity" value
        // And user clicks the "Issue" button
        await clientProfilePage.issueCredits(targetSessionType, testData.amounts.issue);
        
        // Then the "available credits" balance should increase by the issued quantity
        const finalBalance = await clientProfilePage.getAvailableBalance(targetSessionType);
        expect(finalBalance).toBe(initialBalance + testData.amounts.issue);
        
        // And the "Balance History" should show a new "Issued" event
        await clientProfilePage.verifyHistoryEvent(targetSessionType, 'ISSUED');
    });

    test('Coach deletes available session credits', async ({ clientsPage, clientProfilePage }) => {
        const targetSessionType = sessionTypeName;
        if (!targetSessionType) throw new Error('sessionTypeName was not captured from Scenario 1');
        await clientsPage.goto('https://everfit:everfit@AQAJ1tuGK@staging.everfit.io/home/client');
        await clientsPage.openClientProfile(clientName);
        await clientProfilePage.navigateToCredits();
        
        // QUAN TRỌNG: Truyền targetSessionType để lấy balance chính xác
        const initialBalance = await clientProfilePage.getAvailableBalance(targetSessionType);
        
        // Thực hiện xóa credit
        await clientProfilePage.deleteCredits(targetSessionType, testData.amounts.delete);
        
        // Kiểm tra balance giảm xuống
        const finalBalance = await clientProfilePage.getAvailableBalance(targetSessionType);
        expect(finalBalance).toBe(initialBalance - testData.amounts.delete);

        // Xác thực event Deleted trong History
        await clientProfilePage.verifyHistoryEvent(targetSessionType, 'Deleted');
    });

    test('Coach archives a session type with outstanding credits and sees a warning', async ({ page, sessionTypesPage }) => {
        const targetSessionType = sessionTypeName;
        if (!targetSessionType) throw new Error('sessionTypeName was not captured from Scenario 1');
        
        // Given user is on "/session-types"
        await sessionTypesPage.goto('https://everfit:everfit@AQAJ1tuGK@staging.everfit.io/home/booking/session-types');
        
        // When user clicks the "Archive" action for that session type
        await sessionTypesPage.searchSessionType(targetSessionType);
        await sessionTypesPage.archiveSessionType(targetSessionType);
        
        // Then the "Archive Session Type?" modal should be visible
        // And the modal should display a warning: "Some clients have unused session credits for this session type"
        await expect(page.locator('div.modal:has-text("Archive Session Type?")')).toBeVisible();
        await expect(page.locator('text=Some clients have unused session credits')).toBeVisible();
        
        // When user clicks the "Archive" button in the modal
        await page.getByRole('button', { name: 'Archive', exact: true }).click();
        
        // Then the session type should be moved to the "Archived" list
        await page.waitForTimeout(2000); // Chờ đồng bộ
        await sessionTypesPage.archivedTab.click();
        await expect(page.getByText(targetSessionType).first()).toBeVisible({ timeout: 10000 });
    });
});
