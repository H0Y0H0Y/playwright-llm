import { Page, Locator } from '@playwright/test';
import BasePage from './basePage';

export default class CartPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * The "Your Cart" page title.
     * The title is rendered as `<span data-test="title">Your Cart</span>` and is not
     * a heading element, so `getByText` is the most idiomatic accessible locator.
     */
    get pageTitle() {
        return this.page.getByText('Your Cart');
    }

    /**
     * All cart item rows on the page. saucedemo renders these as
     * `<div data-test="inventory-item" class="cart_item">`. There is no accessibility
     * role/label for the row container, so we fall back to the stable `data-test`
     * attribute (preferred over the `.cart_item` class per AGENTS.md).
     */
    get cartItems(): Locator {
        return this.page.locator('[data-test="inventory-item"]');
    }

    /**
     * The "Continue Shopping" button — accessibility-first locator.
     * Underlying markup: `<button data-test="continue-shopping">Continue Shopping</button>`.
     */
    get continueShoppingButton(): Locator {
        return this.page.getByRole('button', { name: 'Continue Shopping' });
    }

    /**
     * The "Checkout" button — accessibility-first locator.
     * Underlying markup: `<button data-test="checkout">Checkout</button>`.
     * Exposed for visibility assertions only; clicking it (and the checkout flow)
     * belongs to a future `CheckoutPage`.
     */
    get checkoutButton(): Locator {
        return this.page.getByRole('button', { name: 'Checkout' });
    }

    /**
     * Locator resolving to the cart item row matching `productName`.
     * The item name itself lives in `<div data-test="inventory-item-name">`.
     */
    getCartItemName(productName: string): Locator {
        return this.page
            .locator('[data-test="inventory-item"]')
            .filter({ hasText: productName })
            .locator('[data-test="inventory-item-name"]');
    }

    /**
     * Locator for the quantity cell of a named cart item
     * (`<div data-test="item-quantity">`).
     */
    getCartItemQuantity(productName: string): Locator {
        return this.page
            .locator('[data-test="inventory-item"]')
            .filter({ hasText: productName })
            .locator('[data-test="item-quantity"]');
    }

    /**
     * Locator for the price cell of a named cart item
     * (`<div data-test="inventory-item-price">`).
     */
    getCartItemPrice(productName: string): Locator {
        return this.page
            .locator('[data-test="inventory-item"]')
            .filter({ hasText: productName })
            .locator('[data-test="inventory-item-price"]');
    }

    /**
     * Returns the names of every cart item, in display order.
     */
    async getCartItemNames(): Promise<string[]> {
        return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
    }

    /**
     * Returns `true` when the browser is on the cart page (`cart.html`).
     * Mirrors `InventoryPage.isOnInventoryPage()`.
     */
    async isOnCartPage(): Promise<boolean> {
        return this.page.url().includes('cart.html');
    }
}
