import { Page } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get usernameInput() {
        return this.getTextBoxLocatorByName('Username');
    }

    get passwordInput() {
        return this.getTextBoxLocatorByName('Password');
    }

    get loginButton() {
        return this.getButtonLocatorByName('login');
    }

    get errorMessage() {
        return this.page.locator('[data-test="error"]');
    }

    get appLogo() {
        return this.page.locator('.app_logo');
    }

    get burgerMenuButton() {
        return this.getButtonLocatorByName('menu');
    }

    get logoutLink() {
        return this.getLinkLocatorByName('Logout');
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getLoginCredentialsText(): Promise<string> {
        return (await this.page.locator('.login_credentials').textContent()) ?? '';
    }

    async getLoginPasswordText(): Promise<string> {
        return (await this.page.locator('.login_password').textContent()) ?? '';
    }
}
