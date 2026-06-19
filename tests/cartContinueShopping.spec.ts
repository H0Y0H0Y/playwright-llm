// Plan: tests/_plan/cartContinueShopping.md

import { test, expect } from '@playwright/test';
import InventoryPage from 'pages/inventory';
import CartPage from 'pages/cart';

test.describe('Cart - Continue Shopping flow', () => {
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        await inventoryPage.navigate('/inventory.html');
    });

    test('Add first item to cart and verify badge updates to 1', async () => {
        // 1. Add "Sauce Labs Backpack" to the cart from the inventory page.
        await inventoryPage.addToCart('Sauce Labs Backpack');

        // 2. Assert the cart badge becomes visible and displays "1".
        await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
        expect(await inventoryPage.getCartItemCount()).toBe(1);

        // 3. Assert the product's Add button is replaced by a Remove button.
        await expect(inventoryPage.getProductRemoveButton('Sauce Labs Backpack')).toBeVisible();
    });

    test('Open cart with 1 item, verify it, then Continue Shopping back to inventory', async () => {
        // Precondition: add the first item so the cart holds 1 item.
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

        // 1. Open the cart by clicking the shopping cart link.
        await inventoryPage.shoppingCartLink.click();

        // 2. Assert the URL matches /cart.html.
        await expect(cartPage.page).toHaveURL(/.*cart\.html/);

        // 3. Assert the cart page title is "Your Cart".
        await expect(cartPage.pageTitle).toBeVisible();

        // 4. Assert exactly one cart item is present.
        await expect(cartPage.cartItems).toHaveCount(1);

        // 5. Assert the cart item name equals "Sauce Labs Backpack".
        await expect(cartPage.getCartItemName('Sauce Labs Backpack')).toHaveText('Sauce Labs Backpack');
        expect(await cartPage.getCartItemNames()).toContain('Sauce Labs Backpack');

        // 6. Click the "Continue Shopping" button.
        await cartPage.continueShoppingButton.click();

        // 7. Assert the URL returns to /inventory.html and the badge still shows 1.
        await expect(cartPage.page).toHaveURL(/.*inventory\.html/);
        await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
    });

    test('Add second item, verify badge = 2, open cart, verify 2 items, Continue Shopping', async () => {
        // Precondition: first item already in cart (badge = 1).
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

        // 1. Add the second product "Sauce Labs Bike Light".
        await inventoryPage.addToCart('Sauce Labs Bike Light');

        // 2. Assert the badge displays "2" and getCartItemCount() returns 2.
        await expect(inventoryPage.shoppingCartBadge).toHaveText('2');
        expect(await inventoryPage.getCartItemCount()).toBe(2);

        // 3. Open the cart.
        await inventoryPage.shoppingCartLink.click();

        // 4. Assert URL matches /cart.html.
        await expect(cartPage.page).toHaveURL(/.*cart\.html/);

        // 5. Assert the cart has 2 items.
        await expect(cartPage.cartItems).toHaveCount(2);

        // 6. Assert the cart item names contain both expected products.
        const names = await cartPage.getCartItemNames();

        expect(names).toContain('Sauce Labs Backpack');
        expect(names).toContain('Sauce Labs Bike Light');

        // 7. Click "Continue Shopping".
        await cartPage.continueShoppingButton.click();

        // 8. Assert the URL returns to /inventory.html and the badge remains 2.
        await expect(cartPage.page).toHaveURL(/.*inventory\.html/);
        await expect(inventoryPage.shoppingCartBadge).toHaveText('2');
    });

    test('Add third item, verify badge = 3, open cart, verify all 3 items present with correct names', async () => {
        // Precondition: first two items already in cart (badge = 2).
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.addToCart('Sauce Labs Bike Light');
        await expect(inventoryPage.shoppingCartBadge).toHaveText('2');

        // 1. Add the third product "Sauce Labs Bolt T-Shirt".
        await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');

        // 2. Assert the badge displays "3" and getCartItemCount() returns 3.
        await expect(inventoryPage.shoppingCartBadge).toHaveText('3');
        expect(await inventoryPage.getCartItemCount()).toBe(3);

        // 3. Open the cart.
        await inventoryPage.shoppingCartLink.click();

        // 4. Assert URL matches /cart.html.
        await expect(cartPage.page).toHaveURL(/.*cart\.html/);

        // 5. Assert the cart has 3 items.
        await expect(cartPage.cartItems).toHaveCount(3);

        // 6. Assert the cart item names include all three expected products.
        const names = await cartPage.getCartItemNames();

        expect(names).toContain('Sauce Labs Backpack');
        expect(names).toContain('Sauce Labs Bike Light');
        expect(names).toContain('Sauce Labs Bolt T-Shirt');

        // 7. Assert the "Checkout" button is present and visible (do NOT click it).
        await expect(cartPage.checkoutButton).toBeVisible();
    });
});
