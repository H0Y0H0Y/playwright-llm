import { Page, Locator } from '@playwright/test';

export class BasePage {
    protected readonly _page: Page;

    constructor(page: Page) {
        this._page = page;
    }

    get page(): Page {
        return this._page;
    }

    getTextBoxLocatorByName(name: string): Locator {
        return this._page.getByRole('textbox', { name });
    }

    getButtonLocatorByName(name: string, exact: boolean = false): Locator {
        return this._page.getByRole('button', { name, exact });
    }

    getLinkLocatorByName(name: string | RegExp): Locator {
        return this._page.getByRole('link', { name });
    }

    async navigate(path: string = '/'): Promise<void> {
        await this._page.goto(path);
    }

    async getCurrentUrl(): Promise<string> {
        return this._page.url();
    }

    async waitForUrl(pattern: RegExp | string): Promise<void> {
        await this._page.waitForURL(pattern);
    }

    async getErrorMessage(): Promise<string> {
        return (await this._page.locator('[data-test="error"]').textContent()) ?? '';
    }

    async isErrorVisible(): Promise<boolean> {
        return this._page.locator('[data-test="error"]').isVisible();
    }
}
