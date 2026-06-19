# Test Plan — Cart: Continue Shopping Flow

## Header

| Field | Value |
| --- | --- |
| Feature | Cart — Continue Shopping flow (add one item at a time, verify cart, return to inventory) |
| Base URL | https://www.saucedemo.com |
| Spec file | `tests/cartContinueShopping.spec.ts` |
| POM files involved | `pages/inventory.ts` (existing), `pages/cart.ts` (new — to be created) |
| Auth | Provided by `setup` project via `.auth/standard_user.json`; tests run already logged in as `standard_user` |
| Starting state | Fresh/blank state for each test (no items in cart, on `inventory.html`) |

### Source test case (free text)
> "user should be able to add one item at a time. Add up to 3 items to the cart and from the cart click continue shopping then add another item continue the same steps until 3 items are added to the cart"

### Products used (default first 3 in inventory sort order)
1. "Sauce Labs Backpack"
2. "Sauce Labs Bike Light"
3. "Sauce Labs Bolt T-Shirt"

### Conventions honoured (from `AGENTS.md`)
- **Page Object Model (POM)**: A new `CartPage extends BasePage` will be created in `pages/cart.ts`. All cart-specific locators live there. `InventoryPage` (`pages/inventory.ts`) is reused as-is.
- **Accessibility-first locators**: Prefer `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText` over CSS selectors. Use `locator()` only when accessibility-based locators are unavailable or cause strict-mode violations. The "Continue Shopping" and "Checkout" buttons MUST use `getByRole('button', { name: ... })`.
- **Checkout is out of scope**: `CartPage` covers only the cart list, "Continue Shopping" button, and "Checkout" button. Checkout form fields belong to a future, separate `CheckoutPage` — do NOT add them to `CartPage`.
- **Prefer playwright-cli** for running/debugging these tests (`npx playwright test --ui`, `npx playwright test --headed`).

---

## Test Scenarios

Each scenario assumes a **fresh cart (empty)** and the user starting on `inventory.html` (achieved via `test.beforeEach` navigating to `/inventory.html`). Tests do NOT log in — the `setup` project injects the `standard_user` storage state.

### Scenario 1 — Add first item to cart and verify badge updates to 1

**Preconditions**
- Fresh state, no items in cart.
- User is on the inventory page (`/inventory.html`).

**Steps**
1. Instantiate `InventoryPage` (and `CartPage`, to be used later).
2. From the inventory page, add the first product ("Sauce Labs Backpack") to the cart via `inventoryPage.addToCart('Sauce Labs Backpack')`.
3. Read the cart badge count via `inventoryPage.getCartItemCount()` (and assert `shoppingCartBadge` text).

**Expected results**
- The cart badge becomes visible and displays `"1"`.
- `inventoryPage.getCartItemCount()` returns `1`.
- The product's Add button is replaced by a Remove button: `inventoryPage.getProductRemoveButton('Sauce Labs Backpack')` is visible.

**POM elements/methods used**
- `InventoryPage.addToCart(productName)`
- `InventoryPage.shoppingCartBadge`
- `InventoryPage.getCartItemCount()`
- `InventoryPage.getProductRemoveButton(productName)`

---

### Scenario 2 — Open cart with 1 item, verify it, then Continue Shopping back to inventory

**Preconditions**
- Scenario 1 has completed: "Sauce Labs Backpack" is in the cart, badge shows `1`.
- User is on the inventory page.

**Steps**
1. Open the cart by clicking `inventoryPage.shoppingCartLink`.
2. Assert the page URL matches `/cart.html` (use `cartPage.page` / `expect(page).toHaveURL(/.*cart\.html/)`).
3. Assert the cart page title is "Your Cart" via `cartPage.pageTitle`.
4. Assert exactly one cart item is present using `cartPage.cartItems` (count = 1).
5. Assert the cart item name equals "Sauce Labs Backpack" using `cartPage.getCartItemName('Sauce Labs Backpack')` / `cartPage.getCartItemNames()`.
6. Click the "Continue Shopping" button via `cartPage.continueShoppingButton`.
7. Wait for / assert the URL matches `/inventory.html`.

**Expected results**
- Cart page displays exactly one item named "Sauce Labs Backpack".
- After clicking "Continue Shopping", the user is returned to the inventory page (`/inventory.html`).
- Cart badge still shows `1` (item is retained, not removed).

**POM elements/methods used**
- `InventoryPage.shoppingCartLink`
- `InventoryPage.shoppingCartBadge` (still showing `1`)
- `CartPage.pageTitle` (text "Your Cart")
- `CartPage.cartItems` (locator list of cart rows)
- `CartPage.getCartItemNames()` (helper returning all cart item name strings)
- `CartPage.getCartItemName(productName)` (locator for a named cart item, used for visibility/text assertions)
- `CartPage.continueShoppingButton` (`getByRole('button', { name: 'Continue Shopping' })`)
- `BasePage.waitForUrl(/.*inventory\.html/)` / `expect(page).toHaveURL(/.*inventory\.html/)`

---

### Scenario 3 — Add second item, verify badge = 2, open cart, verify 2 items, Continue Shopping

**Preconditions**
- "Sauce Labs Backpack" already in cart (badge = 1).
- User is back on the inventory page (after Scenario 2's Continue Shopping).

**Steps**
1. From the inventory page, add the second product "Sauce Labs Bike Light" via `inventoryPage.addToCart('Sauce Labs Bike Light')`.
2. Assert `inventoryPage.shoppingCartBadge` displays `"2"` and `inventoryPage.getCartItemCount()` returns `2`.
3. Open the cart via `inventoryPage.shoppingCartLink`.
4. Assert URL matches `/cart.html`.
5. Assert `cartPage.cartItems` has count `2`.
6. Assert the cart item names (via `cartPage.getCartItemNames()`) contain both "Sauce Labs Backpack" and "Sauce Labs Bike Light".
7. Click `cartPage.continueShoppingButton`.
8. Assert the URL matches `/inventory.html`.

**Expected results**
- Cart badge increments to `2`.
- Cart page lists exactly 2 items with the expected names.
- Continue Shopping returns the user to the inventory page.
- Cart badge remains `2` after returning.

**POM elements/methods used**
- `InventoryPage.addToCart(productName)`
- `InventoryPage.shoppingCartBadge`
- `InventoryPage.getCartItemCount()`
- `InventoryPage.shoppingCartLink`
- `CartPage.cartItems`
- `CartPage.getCartItemNames()`
- `CartPage.getCartItemName(productName)`
- `CartPage.continueShoppingButton`
- `BasePage.waitForUrl(...)`

---

### Scenario 4 — Add third item, verify badge = 3, open cart, verify all 3 items present with correct names

**Preconditions**
- Cart contains "Sauce Labs Backpack" and "Sauce Labs Bike Light" (badge = 2).
- User is on the inventory page (after Scenario 3's Continue Shopping).

**Steps**
1. From the inventory page, add the third product "Sauce Labs Bolt T-Shirt" via `inventoryPage.addToCart('Sauce Labs Bolt T-Shirt')`.
2. Assert `inventoryPage.shoppingCartBadge` displays `"3"` and `inventoryPage.getCartItemCount()` returns `3`.
3. Open the cart via `inventoryPage.shoppingCartLink`.
4. Assert URL matches `/cart.html`.
5. Assert `cartPage.cartItems` has count `3`.
6. Assert the cart item names (via `cartPage.getCartItemNames()`) include all three expected products:
   - "Sauce Labs Backpack"
   - "Sauce Labs Bike Light"
   - "Sauce Labs Bolt T-Shirt"
7. Assert the "Checkout" button is present and visible via `cartPage.checkoutButton` (do NOT click it — checkout flow is out of scope).

**Expected results**
- Cart badge increments to `3`.
- Cart page lists exactly 3 items with the expected names.
- The "Checkout" button is visible (confirming the cart is the end state of this flow).
- (Optional) "Continue Shopping" button is also visible, but no further action is taken — the flow ends with all 3 items in the cart.

**POM elements/methods used**
- `InventoryPage.addToCart(productName)`
- `InventoryPage.shoppingCartBadge`
- `InventoryPage.getCartItemCount()`
- `InventoryPage.shoppingCartLink`
- `CartPage.cartItems`
- `CartPage.getCartItemNames()`
- `CartPage.getCartItemName(productName)`
- `CartPage.continueShoppingButton` (visibility only, no click in this final scenario)
- `CartPage.checkoutButton` (visibility assertion only)

---

## POM Coverage

This section enumerates every element/method the above scenarios need, so the POM builder step knows exactly what to capture.

### `InventoryPage` (`pages/inventory.ts`) — existing, reused

| Element / Method | Type | Used by scenarios | Notes |
| --- | --- | --- | --- |
| `addToCart(productName: string)` | method | 1, 3, 4 | Adds a product by name. |
| `removeFromCart(productName: string)` | method | — | Not required by these scenarios (available for future). |
| `getProductAddButton(productName)` | method (locator) | (internal to `addToCart`) | Existing. |
| `getProductRemoveButton(productName)` | method (locator) | 1 | Used to assert Add→Remove swap. |
| `shoppingCartLink` | getter (locator) | 2, 3, 4 | Opens the cart. Existing `.shopping_cart_link`. |
| `shoppingCartBadge` | getter (locator) | 1, 3, 4 | Asserts badge text. Existing `.shopping_cart_badge`. |
| `getCartItemCount()` | method | 1, 3, 4 | Returns parsed badge count. |
| `isOnInventoryPage()` | method | (optional helper) | May be used to assert return-to-inventory. |
| `navigate('/inventory.html')` | inherited from `BasePage` | all | Used in `beforeEach`. |

### `CartPage` (`pages/cart.ts`) — NEW, to be created (extends `BasePage`)

> Note: `CartPage` must NOT include checkout form fields — checkout is a separate page object in the future. Only cart-list + Continue Shopping + Checkout-button (visibility only) belong here.

| Element / Method | Type | Used by scenarios | Suggested locator (accessibility-first) |
| --- | --- | --- | --- |
| `pageTitle` | getter (locator) | 2 | `page.getByText('Your Cart')` (or `getByRole('heading', { name: 'Your Cart' })` if available). |
| `cartItems` | getter (locator list) | 2, 3, 4 | Locator for all cart rows, e.g. `page.locator('.cart_item')`. Count assertions. |
| `getCartItemName(productName: string)` | method (locator) | 2, 3, 4 | Locator resolving to the named cart item row/name, e.g. `page.locator('.cart_item').filter({ hasText: productName })` then scoped to `.inventory_item_name`, or `page.getByText(productName, { exact: true })`. Used for visibility/text assertions. |
| `getCartItemNames()` | method (string[]) | 2, 3, 4 | Returns all cart item name strings, e.g. `page.locator('.inventory_item_name').allTextContents()` (the cart page reuses `.inventory_item_name` for cart item names). |
| `getCartItemQuantity(productName: string)` | method (locator) | (optional) | Optional helper for quantity (cart shows qty = 1 for each added item). |
| `getCartItemPrice(productName: string)` | method (locator) | (optional) | Optional helper for price verification. |
| `continueShoppingButton` | getter (locator) | 2, 3, 4 (click in 2 & 3) | **`page.getByRole('button', { name: 'Continue Shopping' })`** (per AGENTS.md accessibility-first rule). Underlying `data-test="continue-shopping"`. |
| `checkoutButton` | getter (locator) | 4 (visibility only — DO NOT click) | **`page.getByRole('button', { name: 'Checkout' })`** (accessibility-first). Underlying `data-test="checkout"`. Clicking/checkout flow belongs to a future `CheckoutPage`. |
| `isOnCartPage()` | method (boolean) | 2, 3, 4 | Optional helper: `(await this.page.url()).includes('cart.html')`. |
| `waitForUrl(pattern)` | inherited from `BasePage` | 2, 3 | Used to assert navigation back to inventory. |

### `BasePage` (`pages/basePage.ts`) — inherited

| Element / Method | Type | Notes |
| --- | --- | --- |
| `navigate(path)` | method | Used in `beforeEach` to reach `/inventory.html`. |
| `page` | getter | Exposes the `Page` for `expect(page).toHaveURL(...)` assertions. |
| `waitForUrl(pattern)` | method | Used to assert return-to-inventory after Continue Shopping. |

---

## Test File Structure (guidance for the spec author — not code, just shape)

- File: `tests/cartContinueShopping.spec.ts`
- Imports: `test, expect` from `@playwright/test`; `InventoryPage` from `pages/inventory`; `CartPage` from `pages/cart`.
- `test.describe('Cart — Continue Shopping Flow', ...)` wrapping a single end-to-end test that walks all four scenarios sequentially, OR four separate tests under the describe. The orchestrator decision implies a single continuous flow (item 1 → cart → continue → item 2 → cart → continue → item 3 → cart), but each numbered scenario above is written so it can be run independently given the stated preconditions.
- `test.beforeEach`: instantiate `InventoryPage` and `CartPage`; `await inventoryPage.navigate('/inventory.html')`.
- Mirror the assertion style used in `tests/inventory.spec.ts` (e.g. `await expect(...).toHaveText(...)`, `expect(await ...).toBe(...)`).

## Out of Scope

- Checkout form filling / checkout page object (`CheckoutPage`) — explicitly deferred.
- Removing items from the cart (covered elsewhere in `inventory.spec.ts`).
- Logging in (handled by the `setup` project / storage state).
- Pricing/quantity deep verification (optional helpers listed but not asserted in core scenarios).
