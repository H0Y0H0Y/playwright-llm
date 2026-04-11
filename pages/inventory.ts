import { Page, Locator } from '@playwright/test';
import BasePage from './basePage';

export default class InventoryPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get pageTitle() {
        return this.page.getByText('Products');
    }

    get productSortDropdown() {
        return this.page.locator('.product_sort_container');
    }

    get shoppingCartLink() {
        return this.page.locator('.shopping_cart_link');
    }

    get shoppingCartBadge() {
        return this.page.locator('.shopping_cart_badge');
    }

    get burgerMenuButton() {
        return this.getButtonLocatorByName('menu');
    }

    get menuSidebar() {
        return this.page.locator('.bm-menu');
    }

    get allItemsLink() {
        return this.page.getByRole('link', { name: 'All Items' });
    }

    get aboutLink() {
        return this.page.getByRole('link', { name: 'About' });
    }

    get logoutLink() {
        return this.page.getByRole('link', { name: 'Logout' });
    }

    get resetAppStateLink() {
        return this.page.getByRole('link', { name: 'Reset App State' });
    }

    get twitterLink() {
        return this.page.locator('.social_twitter a');
    }

    get facebookLink() {
        return this.page.locator('.social_facebook a');
    }

    get linkedinLink() {
        return this.page.locator('.social_linkedin a');
    }

    get products(): Locator {
        return this.page.locator('.inventory_item');
    }

    getProductAddButton(productName: string): Locator {
        const slugMap: Record<string, string> = {
            'Sauce Labs Backpack': 'sauce-labs-backpack',
            'Sauce Labs Bike Light': 'sauce-labs-bike-light',
            'Sauce Labs Bolt T-Shirt': 'sauce-labs-bolt-t-shirt',
            'Sauce Labs Fleece Jacket': 'sauce-labs-fleece-jacket',
            'Sauce Labs Onesie': 'sauce-labs-onesie',
            'Test.allTheThings() T-Shirt (Red)': 'test.allthethings()-t-shirt-(red)'
        };
        const slug = slugMap[productName] ?? productName.toLowerCase().replace(/\s+/g, '-').replace(/[().]/g, '');

        return this.page.locator(`[data-test="add-to-cart-${slug}"]`);
    }

    getProductRemoveButton(productName: string): Locator {
        const slugMap: Record<string, string> = {
            'Sauce Labs Backpack': 'sauce-labs-backpack',
            'Sauce Labs Bike Light': 'sauce-labs-bike-light',
            'Sauce Labs Bolt T-Shirt': 'sauce-labs-bolt-t-shirt',
            'Sauce Labs Fleece Jacket': 'sauce-labs-fleece-jacket',
            'Sauce Labs Onesie': 'sauce-labs-onesie',
            'Test.allTheThings() T-Shirt (Red)': 'test.allthethings()-t-shirt-(red)'
        };
        const slug = slugMap[productName] ?? productName.toLowerCase().replace(/\s+/g, '-').replace(/[().]/g, '');

        return this.page.locator(`[data-test="remove-${slug}"]`);
    }

    getProductLocator(productName: string): Locator {
        return this.page.locator(`.inventory_item:has-text("${productName}")`);
    }

    getProductPrice(productName: string): Locator {
        return this.page.locator(`.inventory_item:has-text("${productName}") .inventory_item_price`);
    }

    async isOnInventoryPage(): Promise<boolean> {
        return (this.page.url()).includes('inventory.html');
    }

    async getPageTitle(): Promise<string> {
        // eslint-disable-next-line playwright/prefer-locator
        return (await this.pageTitle.textContent()) ?? '';
    }

    async selectSortOption(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
        const optionMap = {
            'az': 'Name (A to Z)',
            'za': 'Name (Z to A)',
            'lohi': 'Price (low to high)',
            'hilo': 'Price (high to low)'
        };

        await this.productSortDropdown.selectOption(optionMap[option]);
    }

    async addToCart(productName: string): Promise<void> {
        await this.getProductAddButton(productName).click();
    }

    async removeFromCart(productName: string): Promise<void> {
        await this.getProductRemoveButton(productName).click();
    }

    async getCartItemCount(): Promise<number> {
        const badge = this.shoppingCartBadge;

        if (await badge.isVisible()) {
            const text = await badge.textContent();

            return parseInt(text ?? '0', 10);
        }

        return 0;
    }

    async openMenu(): Promise<void> {
        await this.burgerMenuButton.click();
    }

    async closeMenu(): Promise<void> {
        await this.page.locator('.bm-cross-button').click();
    }

    async getProductNames(): Promise<string[]> {
        const names = await this.page.locator('.inventory_item_name').allTextContents();

        return names;
    }

    async getProductPrices(): Promise<number[]> {
        const priceTexts = await this.page.locator('.inventory_item_price').allTextContents();

        return priceTexts.map(p => parseFloat(p.replace('$', '')));
    }
}
