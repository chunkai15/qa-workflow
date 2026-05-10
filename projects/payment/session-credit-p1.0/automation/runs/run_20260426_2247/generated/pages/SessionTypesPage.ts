import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class SessionTypesPage extends BasePage {
    get addBtn() { return this.page.locator('button:has-text("Add New Session Type")'); }
    get nameInput() { return this.page.locator('input[placeholder="e.g. Personal training session"]'); }
    get creditToggle() { return this.page.locator('div:has-text("Require session credit")').locator('input[type="checkbox"]'); }
    get createBtn() { return this.page.locator('button:has-text("Create")'); }
    get archivedTab() { return this.page.locator('button:text("Archived")'); }
    get activeTab() { return this.page.locator('button:text("Active")'); }

    get searchInput() { return this.page.locator('input[placeholder="Search session type name"]'); }

    // kebab menu is tricky, sử dụng lọc theo nội dung đặc thù của hàng (Tên + Thời lượng)
    sessionTypeRow(name: string) {
        // Một hàng Session Type luôn có Tên và Thời lượng (min/hour), ô Search thì không.
        return this.page.locator('div, generic, [cursor="pointer"]').filter({ hasText: name }).filter({ hasText: /min|hour/i }).first();
    }

    async searchSessionType(name: string) {
        const performSearch = async (retryCount = 0) => {
            await this.searchInput.clear();
            await this.searchInput.fill(name);
            // Click vào icon kính lúp để search chắc chắn hơn
            const searchIcon = this.page.locator('i.search.icon, .search-icon').first();
            if (await searchIcon.isVisible()) {
                await searchIcon.click();
            } else {
                await this.page.keyboard.press('Enter');
            }
            await this.page.keyboard.press('Escape'); 
            await this.page.waitForTimeout(3000); // Đợi list render kết quả
            await this.waitForReady();

            const noResult = this.page.locator('text=No session types found');
            if (await noResult.isVisible() && retryCount < 2) {
                console.log(`Search failed for ${name}, retrying... (Attempt ${retryCount + 1})`);
                await this.page.reload();
                await this.waitForReady();
                await this.page.waitForTimeout(2000);
                await performSearch(retryCount + 1);
            }
        };

        await performSearch();
    }

    async createCreditRequiredSessionType(name: string) {
        // Đảm bảo loading overlay của hệ thống đã ẩn
        await this.waitForReady();
        
        await this.addBtn.click({ force: true });
        
        // Modal này thực tế là một sub-route, chờ URL thay đổi hoặc modal xuất hiện
        await this.page.waitForURL(/\/new$/, { timeout: 10000 });
        const modal = this.page.locator('div.modal, [role="dialog"]').filter({ hasText: 'Create Session Type' }).last();
        await modal.waitFor({ state: 'visible', timeout: 10000 });
        
        // Sử dụng getByPlaceholder trực tiếp
        const nameField = modal.getByPlaceholder(/e\.g\. Personal training session/i);
        await nameField.waitFor({ state: 'visible' });
        
        await nameField.click();
        await nameField.clear();
        // Gõ chậm để React kịp nhận event
        await nameField.pressSequentially(name, { delay: 100 });
        await nameField.press('Tab');
        
        // Defensive: Kiểm tra giá trị
        let currentVal = await nameField.inputValue();
        if (currentVal !== name) {
            await nameField.click();
            await this.page.keyboard.press('Control+A');
            await this.page.keyboard.press('Backspace');
            await this.page.keyboard.type(name, { delay: 100 });
            await this.page.keyboard.press('Tab');
        }

        // Chờ lỗi biến mất
        const errorLabel = modal.locator('text=Please add a session name');
        await expect(errorLabel).toBeHidden({ timeout: 5000 });
        
        // Toggle credit
        // Tìm vùng chứa có text 'Require session credit' và lấy checkbox bên trong
        const toggleContainer = modal.locator('div, generic').filter({ hasText: /^Require session credit$/ }).locator('..');
        const toggle = toggleContainer.getByRole('checkbox');
        
        await toggle.waitFor({ state: 'visible', timeout: 5000 });
        if (!(await toggle.isChecked())) {
            await toggle.click({ force: true });
            await this.page.waitForTimeout(500);
        }
        
        // Click Create button
        const createBtn = modal.locator('button:has-text("Create")').last();
        await createBtn.click();
        
        // Chờ modal đóng (URL quay lại danh sách)
        await this.page.waitForURL(/.*\/session-types$/, { timeout: 10000 });
        await this.page.waitForTimeout(2000); // Chờ Backend đồng bộ sau khi Create
        await this.waitForReady();
    }

    async archiveSessionType(name: string) {
        const row = this.sessionTypeRow(name);
        await row.waitFor({ state: 'visible', timeout: 15000 });
        
        // Chỉ nhắm vào element trigger của menu ba chấm, lọc theo hiển thị và lấy cái đầu tiên
        const kebabMenu = row.locator('.evf-dropdown__trigger-container, [data-for*="more-options"], i.ellipsis').filter({ visible: true }).first();
        await kebabMenu.click({ force: true });
        await this.page.waitForTimeout(1000); // Đợi menu render
        
        // Chọn Archive từ menu popover
        const archiveOption = this.page.locator('.item, [role="menuitem"], button, span').filter({ hasText: /^Archive$/ }).filter({ visible: true }).first();
        await archiveOption.click({ force: true });
    }

    async unarchiveSessionType(name: string) {
        await this.archivedTab.click();
        const row = this.sessionTypeRow(name);
        await row.waitFor({ state: 'visible', timeout: 15000 });
        
        const kebabMenu = row.locator('.evf-dropdown__trigger-container, [data-for*="more-options"], i.ellipsis').filter({ visible: true }).first();
        await kebabMenu.click({ force: true });
        await this.page.waitForTimeout(1000);
        
        const unarchiveOption = this.page.locator('.item, [role="menuitem"], button, span').filter({ hasText: /^Unarchive$/ }).filter({ visible: true }).first();
        await unarchiveOption.click({ force: true });
    }
}
