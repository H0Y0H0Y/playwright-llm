import { test, expect } from '@playwright/test';
import InventoryPage from 'pages/inventory';

test.describe('Inventory Page', () => {
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page);
        await inventoryPage.navigate('/inventory.html');
    });

    test.describe('Product Display', () => {
        test('All six products are displayed', async () => {
            await expect(inventoryPage.products).toHaveCount(6);
            await expect(inventoryPage.pageTitle).toHaveText('Products');

            const productNames = await inventoryPage.getProductNames();

            expect(productNames).toContain('Sauce Labs Backpack');
            expect(productNames).toContain('Sauce Labs Bike Light');
            expect(productNames).toContain('Sauce Labs Bolt T-Shirt');
            expect(productNames).toContain('Sauce Labs Fleece Jacket');
            expect(productNames).toContain('Sauce Labs Onesie');
            expect(productNames).toContain('Test.allTheThings() T-Shirt (Red)');

            const prices = await inventoryPage.getProductPrices();

            expect(prices).toContain(29.99);
            expect(prices).toContain(9.99);
            expect(prices).toContain(15.99);
            expect(prices).toContain(49.99);
            expect(prices).toContain(7.99);
        });

        test('Product images and descriptions are rendered', async () => {
            const firstProduct = inventoryPage.products.first();

            await expect(firstProduct.locator('img.inventory_item_img')).toBeVisible();
            await expect(firstProduct.locator('.inventory_item_name')).toBeVisible();
            await expect(firstProduct.locator('.inventory_item_desc')).toBeVisible();
            await expect(firstProduct.locator('.inventory_item_price')).toBeVisible();
        });
    });

    test.describe('Product Sorting', () => {
        test('Sort by Name (A to Z)', async () => {
            await inventoryPage.selectSortOption('az');
            const names = await inventoryPage.getProductNames();

            expect(names[0]).toBe('Sauce Labs Backpack');
            expect(names[5]).toBe('Test.allTheThings() T-Shirt (Red)');
        });

        test('Sort by Name (Z to A)', async () => {
            await inventoryPage.selectSortOption('za');
            const names = await inventoryPage.getProductNames();

            expect(names[0]).toBe('Test.allTheThings() T-Shirt (Red)');
            expect(names[5]).toBe('Sauce Labs Backpack');
        });

        test('Sort by Price (low to high)', async () => {
            await inventoryPage.selectSortOption('lohi');
            const prices = await inventoryPage.getProductPrices();

            for (let i = 0; i < prices.length - 1; i++) {
                expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
            }
        });

        test('Sort by Price (high to low)', async () => {
            await inventoryPage.selectSortOption('hilo');
            const prices = await inventoryPage.getProductPrices();

            for (let i = 0; i < prices.length - 1; i++) {
                expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
            }
        });

        test('Sort preference does not persist after reload', async () => {
            await inventoryPage.selectSortOption('hilo');
            await inventoryPage.page.reload();
            await inventoryPage.selectSortOption('az');
            const names = await inventoryPage.getProductNames();

            expect(names[0]).toBe('Sauce Labs Backpack');
        });
    });

    test.describe('Add to Cart', () => {
        test('Add single product to cart', async () => {
            await inventoryPage.addToCart('Sauce Labs Backpack');
            await expect(inventoryPage.getProductRemoveButton('Sauce Labs Backpack')).toBeVisible();
            await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
        });

        test('Add multiple different products to cart', async () => {
            await inventoryPage.addToCart('Sauce Labs Backpack');
            await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

            await inventoryPage.addToCart('Sauce Labs Bike Light');
            await expect(inventoryPage.shoppingCartBadge).toHaveText('2');

            await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');
            await expect(inventoryPage.shoppingCartBadge).toHaveText('3');
        });

        test('Remove product from cart', async () => {
            await inventoryPage.addToCart('Sauce Labs Backpack');
            await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

            await inventoryPage.removeFromCart('Sauce Labs Backpack');
            await expect(inventoryPage.getProductAddButton('Sauce Labs Backpack')).toBeVisible();
            await expect(inventoryPage.shoppingCartBadge).toBeHidden();
        });

        test('Cart badge updates correctly', async () => {
            await inventoryPage.addToCart('Sauce Labs Backpack');
            await inventoryPage.addToCart('Sauce Labs Bike Light');
            await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');
            await inventoryPage.addToCart('Sauce Labs Fleece Jacket');
            await inventoryPage.addToCart('Sauce Labs Onesie');
            await inventoryPage.addToCart('Test.allTheThings() T-Shirt (Red)');
            expect(await inventoryPage.getCartItemCount()).toBe(6);

            await inventoryPage.removeFromCart('Sauce Labs Backpack');
            await inventoryPage.removeFromCart('Sauce Labs Bike Light');
            expect(await inventoryPage.getCartItemCount()).toBe(4);

            await inventoryPage.addToCart('Sauce Labs Backpack');
            expect(await inventoryPage.getCartItemCount()).toBe(5);

            await inventoryPage.addToCart('Sauce Labs Bike Light');
            expect(await inventoryPage.getCartItemCount()).toBe(6);
        });

        test('Add to cart state persists after sorting', async () => {
            await inventoryPage.addToCart('Sauce Labs Backpack');
            expect(await inventoryPage.getCartItemCount()).toBe(1);

            await inventoryPage.selectSortOption('hilo');
            await expect(inventoryPage.getProductRemoveButton('Sauce Labs Backpack')).toBeVisible();
            expect(await inventoryPage.getCartItemCount()).toBe(1);
        });

        test('Empty cart shows no badge', async () => {
            await expect(inventoryPage.shoppingCartBadge).toBeHidden();
        });
    });

    test.describe('Navigation', () => {
        test('Hamburger menu opens and closes', async () => {
            await inventoryPage.openMenu();
            await expect(inventoryPage.menuSidebar).toBeVisible();
            await expect(inventoryPage.allItemsLink).toBeVisible();
            await expect(inventoryPage.aboutLink).toBeVisible();
            await expect(inventoryPage.logoutLink).toBeVisible();
            await expect(inventoryPage.resetAppStateLink).toBeVisible();

            await inventoryPage.closeMenu();
            await expect(inventoryPage.menuSidebar).toBeHidden();
        });

        test('All Items navigation', async () => {
            await inventoryPage.openMenu();
            await inventoryPage.allItemsLink.click();
            await expect(inventoryPage.page).toHaveURL(/.*inventory\.html/);
        });

        test('Logout redirects to login', async () => {
            await inventoryPage.openMenu();
            await inventoryPage.logoutLink.click();
            await expect(inventoryPage.page).toHaveURL('/');
        });

        test('Reset App State clears cart', async () => {
            await inventoryPage.addToCart('Sauce Labs Backpack');
            await inventoryPage.addToCart('Sauce Labs Bike Light');
            expect(await inventoryPage.getCartItemCount()).toBe(2);

            await inventoryPage.openMenu();
            await inventoryPage.resetAppStateLink.click();
            expect(await inventoryPage.getCartItemCount()).toBe(0);
        });

        test('Shopping cart link navigates to cart', async () => {
            await inventoryPage.shoppingCartLink.click();
            await expect(inventoryPage.page).toHaveURL(/.*cart\.html/);
        });
    });

    test.describe('Product Links', () => {
        test('Product name is clickable and navigates to item detail page', async () => {
            const productName = inventoryPage.page.locator('.inventory_item_name').first();

            await expect(productName).toHaveText('Sauce Labs Backpack');
            await productName.click();
            await expect(inventoryPage.page).toHaveURL(/.*inventory-item\.html\?id=\d+/);
        });
    });

    test.describe('Footer', () => {
        test('Footer social links are visible', async () => {
            await expect(inventoryPage.twitterLink).toBeVisible();
            await expect(inventoryPage.facebookLink).toBeVisible();
            await expect(inventoryPage.linkedinLink).toBeVisible();
        });

        test('Footer copyright is displayed', async () => {
            await expect(inventoryPage.page.locator('.footer_copy')).toContainText('© 2026 Sauce Labs');
        });
    });

    test.describe('Edge Cases', () => {
        test('Rapidly add and remove items', async () => {
            await inventoryPage.addToCart('Sauce Labs Backpack');
            await inventoryPage.removeFromCart('Sauce Labs Backpack');
            await inventoryPage.addToCart('Sauce Labs Backpack');
            await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
        });

        test('Sort while items in cart', async () => {
            await inventoryPage.addToCart('Sauce Labs Backpack');
            await inventoryPage.addToCart('Sauce Labs Bike Light');
            await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');
            expect(await inventoryPage.getCartItemCount()).toBe(3);

            await inventoryPage.selectSortOption('za');
            expect(await inventoryPage.getCartItemCount()).toBe(3);

            await inventoryPage.selectSortOption('lohi');
            expect(await inventoryPage.getCartItemCount()).toBe(3);

            await inventoryPage.selectSortOption('hilo');
            expect(await inventoryPage.getCartItemCount()).toBe(3);
        });
    });
});
