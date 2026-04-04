import { Page } from '@playwright/test';
import BasePage from 'pages/basePage';

export default class InventoryPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async isOnInventoryPage(): Promise<boolean> {
        return this.page.url().includes('inventory.html');
    }

    async getPageTitle(): Promise<string> {
        return (await this.page.locator('.title').textContent()) ?? '';
    }
}
