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

    test.afterEach(async () => {
        // Reset cart via the in-app "Reset App State" menu link.
        // The test may have ended on the cart page, so navigate to inventory first
        // (navigating is safe regardless of the current page). Use inventoryPage.page
        // rather than the { page } fixture to avoid referencing a different page instance.
        try {
            if (!(await inventoryPage.isOnInventoryPage())) {
                await inventoryPage.navigate('/inventory.html');
            }

            await inventoryPage.openMenu();
            await inventoryPage.resetAppStateLink.click();
            // Cart is empty: badge hidden OR count is 0.
            await expect(inventoryPage.shoppingCartBadge).toBeHidden();
            expect(await inventoryPage.getCartItemCount()).toBe(0);
        } catch {
            // Swallow errors inside afterEach so they don't mask the original test failure.
        }
    });

    test('add up to 3 items one at a time with continue shopping between each', async () => {
        // Phase 1: add the first item and verify badge + Remove button.
        await test.step('add first item', async () => {
            // 1. Add "Sauce Labs Backpack" to the cart from the inventory page.
            await inventoryPage.addToCart('Sauce Labs Backpack');

            // 2. Assert the cart badge becomes visible and displays "1".
            await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
            expect(await inventoryPage.getCartItemCount()).toBe(1);

            // 3. Assert the product's Add button is replaced by a Remove button.
            await expect(inventoryPage.getProductRemoveButton('Sauce Labs Backpack')).toBeVisible();
        });

        // Phase 2: open cart with 1 item, verify it, then Continue Shopping.
        await test.step('open cart and continue shopping', async () => {
            // 1. Open the cart by clicking the shopping cart link.
            await inventoryPage.shoppingCartLink.click();

            // 2. Assert the URL matches /cart.html.
            await expect(cartPage.page).toHaveURL(/.*cart\.html/);

            // 3. Assert the cart page title is visible.
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

        // Phase 3: add the second item and verify badge = 2.
        await test.step('add second item', async () => {
            // 1. Add the second product "Sauce Labs Bike Light".
            await inventoryPage.addToCart('Sauce Labs Bike Light');

            // 2. Assert the badge displays "2" and getCartItemCount() returns 2.
            await expect(inventoryPage.shoppingCartBadge).toHaveText('2');
            expect(await inventoryPage.getCartItemCount()).toBe(2);
        });

        // Phase 4: open cart with 2 items, verify them, then Continue Shopping.
        await test.step('open cart and continue shopping', async () => {
            // 1. Open the cart.
            await inventoryPage.shoppingCartLink.click();

            // 2. Assert URL matches /cart.html.
            await expect(cartPage.page).toHaveURL(/.*cart\.html/);

            // 3. Assert the cart has 2 items.
            await expect(cartPage.cartItems).toHaveCount(2);

            // 4. Assert the cart item names contain both expected products.
            const names = await cartPage.getCartItemNames();

            expect(names).toContain('Sauce Labs Backpack');
            expect(names).toContain('Sauce Labs Bike Light');

            // 5. Click "Continue Shopping".
            await cartPage.continueShoppingButton.click();

            // 6. Assert the URL returns to /inventory.html and the badge remains 2.
            await expect(cartPage.page).toHaveURL(/.*inventory\.html/);
            await expect(inventoryPage.shoppingCartBadge).toHaveText('2');
        });

        // Phase 5: add the third item and verify badge = 3.
        await test.step('add third item', async () => {
            // 1. Add the third product "Sauce Labs Bolt T-Shirt".
            await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');

            // 2. Assert the badge displays "3" and getCartItemCount() returns 3.
            await expect(inventoryPage.shoppingCartBadge).toHaveText('3');
            expect(await inventoryPage.getCartItemCount()).toBe(3);
        });

        // Phase 6: open cart with 3 items, verify all three are present and checkout visible.
        await test.step('open cart and verify 3 items', async () => {
            // 1. Open the cart.
            await inventoryPage.shoppingCartLink.click();

            // 2. Assert URL matches /cart.html.
            await expect(cartPage.page).toHaveURL(/.*cart\.html/);

            // 3. Assert the cart has 3 items.
            await expect(cartPage.cartItems).toHaveCount(3);

            // 4. Assert the cart item names include all three expected products.
            const names = await cartPage.getCartItemNames();

            expect(names).toContain('Sauce Labs Backpack');
            expect(names).toContain('Sauce Labs Bike Light');
            expect(names).toContain('Sauce Labs Bolt T-Shirt');

            // 5. Assert the "Checkout" button is present and visible (do NOT click it).
            await expect(cartPage.checkoutButton).toBeVisible();
        });
    });
});
