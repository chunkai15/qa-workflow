import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class ClientProfilePage extends BasePage {
    get sessionsTab() { return this.page.locator('a.client-menu-item:has-text("Sessions")'); }
    get creditsSubTab() { return this.page.locator('div').filter({ hasText: /^Credits$/ }).first(); }
    get issueCreditsBtn() { return this.page.locator('button:has-text("Issue Credits")'); }
    get calendarBtn() { return this.page.locator('button:has-text("Go to Calendar")'); }

    // Issue Modal
    get sessionTypeDropdown() { return this.page.locator('.ui.dropdown'); }
    get amountInput() { 
        return this.page.locator('input').filter({ visible: true }).nth(1); 
    }
    get confirmIssueBtn() { return this.page.locator('button:has-text("Issue Credits")').last(); }

    // Balance row getters/methods below

    get availableBalanceText() { 
        // Nhắm vào bất kỳ element nào chứa chữ 'Balance' và có con số hoặc thông báo trống bên cạnh
        return this.page.locator('div, span, generic').filter({ hasText: /^Balance$/ }).locator('xpath=./following-sibling::*').first();
    }

    async getAvailableBalance(sessionTypeName: string): Promise<number> {
        // Đợi UI ổn định một chút
        await this.page.waitForTimeout(1000);
        
        // Dùng locator văn bản thuần túy
        const row = this.page.locator(`text=${sessionTypeName}`).first();
        
        try {
            // Kiểm tra nhanh trong 2s xem dòng này đã tồn tại chưa
            const isVisible = await row.isVisible();
            if (!isVisible) {
                // Thử đợi thêm 1s nữa cho chắc
                await row.waitFor({ state: 'visible', timeout: 1000 }).catch(() => {});
            }

            if (await row.isVisible()) {
                // Leo lên tổ tiên chung duy nhất chứa cả Tên (nhánh trái) và Số dư/Nút bấm (nhánh phải)
                // Dùng điều kiện: div đầu tiên chứa cả text và nút bấm
                const container = row.locator('xpath=./ancestor::div[.//button][1]');
                const text = await (await container.count() > 0 ? container.first() : row).innerText();
                
                // Lấy TẤT CẢ các con số trong dòng
                const matches = text.match(/\d+/g);
                if (!matches) return 0;
                
                // Trích xuất mã số từ tên (ví dụ: 1234 từ CreditReq_1234)
                const nameIdMatch = sessionTypeName.match(/\d+/);
                const nameId = nameIdMatch ? nameIdMatch[0] : null;
                
                // Lọc bỏ mã số định danh, con số còn lại chính là balance
                const balances = matches.filter(m => m !== nameId);
                const balance = balances.length > 0 ? parseInt(balances[0]) : 0;
                
                console.log(`Verified Balance for ${sessionTypeName}: ${balance} (from candidates: ${matches.join(', ')})`);
                return balance;
            }
            return 0; // Không thấy dòng đó => số dư là 0
        } catch (e) {
            return 0;
        }
    }

    async navigateToCredits() {
        await this.sessionsTab.click();
        await this.creditsSubTab.click();
        // Đợi tiêu đề Balance xuất hiện để chắc chắn tab đã load
        await this.page.locator('text=Balance').first().waitFor({ state: 'visible', timeout: 5000 });
        await this.page.waitForTimeout(2000); // Đợi thêm 2s để dữ liệu kịp render
        await this.waitForReady();
    }

    async verifyHistoryEvent(sessionTypeName: string, event: string) {
        // Hỗ trợ cả Deleted/Removed và ISSUED/Issued bằng Regex
        const eventRegex = new RegExp(event, 'i');
        const historyRow = this.page.locator('div, generic, span, tr').filter({ hasText: eventRegex }).filter({ hasText: sessionTypeName }).first();
        await expect(historyRow).toBeVisible({ timeout: 10000 });
        console.log(`Verified History Event: ${event} for ${sessionTypeName}`);
    }

    async issueCredits(sessionTypeName: string, amount: number) {
        await this.issueCreditsBtn.click({ force: true });
        
        const modalTitle = this.page.locator('text=Issue Session Credits').first();
        await modalTitle.waitFor({ state: 'visible', timeout: 5000 });
        // 1. Khoanh vùng Modal
        const modal = this.page.locator('[role="dialog"], .ui.modal, .modal').filter({ visible: true }).first();
        await modal.waitFor({ state: 'visible', timeout: 5000 });

        // 2. Chọn Session Type (Search & Click)
        const dropdownTrigger = modal.locator('[data-testid="session-type-trigger"], .ui.dropdown, [placeholder*="Select session type"]').first();
        await dropdownTrigger.click({ force: true });
        await this.page.waitForTimeout(500);
        await this.page.keyboard.type(sessionTypeName, { delay: 100 });
        await this.page.waitForTimeout(1000);
        
        const item = this.page.getByText(sessionTypeName, { exact: false }).first();
        await item.click({ force: true });
        await this.page.waitForTimeout(1000);
        
        // 3. Nhập Amount: Quy trình 'Subagent-Certified'
        const amountInput = modal.locator('input[data-ai-autofill-context-target="true"], input[value="1"], input').filter({ visible: true }).first();
        await amountInput.click();
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Backspace');
        await amountInput.type(amount.toString(), { delay: 100 });
        await this.page.keyboard.press('Tab'); // QUAN TRỌNG: Trigger Blur/State Commit
        await this.page.waitForTimeout(1000);
        
        // 4. Click nút Issue Credits xác nhận
        const submitBtn = modal.locator('button:has-text("Issue Credits")').filter({ visible: true }).last();
        await submitBtn.click({ force: true });
        
        // 5. Đợi modal đóng và UI cập nhật (Không cần reload theo báo cáo của Subagent)
        await modal.waitFor({ state: 'hidden', timeout: 5000 });
        await this.page.waitForTimeout(2000);
        await this.waitForReady();
    }

    // Balance row
    sessionTypeBalanceRow(name: string) {
        // Tìm text -> Leo lên div chứa nút bấm để bao quát toàn hàng
        return this.page.locator(`text=${name}`).first().locator('xpath=./ancestor::div[.//button][1]');
    }

    async deleteCredits(sessionTypeName: string, amount: number) {
        const row = this.sessionTypeBalanceRow(sessionTypeName);
        await row.waitFor({ state: 'visible', timeout: 10000 });
        
        // Nút đầu tiên là (+), nút thứ hai (cuối cùng) là (-)
        const minusBtn = row.locator('button').last();
        await expect(minusBtn).toBeVisible({ timeout: 5000 });
        
        try {
            await minusBtn.click({ force: true });
        } catch (e) {
            // Chụp ảnh nếu click fail để thám tử DOM
            await this.page.screenshot({ path: `c:/Users/Admin/AI-Vibecode/qa-automation-pipeline/features/session-credit-p1.0/automation/runs/run_20260426_2247/scratch/fail_click_minus_${sessionTypeName}.png` });
            throw e;
        }
        
        // Chờ modal xóa xuất hiện
        const modal = this.page.locator('div.modal, .ui.modal').filter({ hasText: 'Delete Session Credits' }).last();
        await modal.waitFor({ state: 'visible', timeout: 5000 });
        
        // Nhập Amount: Quy trình 'React-Safe'
        const amountInput = modal.locator('input[data-ai-autofill-context-target="true"], input[value="1"], input').filter({ visible: true }).first();
        await amountInput.click();
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Backspace');
        await amountInput.type(amount.toString(), { delay: 100 });
        await this.page.keyboard.press('Tab'); 
        await this.page.waitForTimeout(1000);
        
        // Click nút Delete xác nhận
        const deleteBtn = modal.locator('button:has-text("Delete")').filter({ visible: true }).last();
        await deleteBtn.click({ force: true });
        
        await modal.waitFor({ state: 'hidden', timeout: 5000 });
        await this.waitForReady();
    }
}
