---
name: playwright
description: Playwright test automation - write, run, and debug E2E tests with Playwright in TypeScript/JavaScript. Covers page objects, selectors, locators, assertions, network interception, and Playwright CLI usage.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: testing
---

## Overview

This project uses [Playwright](https://playwright.dev/) for end-to-end testing. Playwright is a powerful testing framework that supports cross-browser testing, network interception, and automatic waiting.

## Project Structure

- `tests/` - Playwright test files (`.spec.ts`)
- `pages/` - Page Object Model classes
  - `BasePage.ts` - Base class with common locators and methods
  - `LoginPage.ts` - Login page object
  - `InventoryPage.ts` - Inventory page object
- `playwright.config.ts` - Playwright configuration
- `src/` - Application source code

## Running Tests

```bash
npm test                 # Run all tests
npm run test:ui         # Run tests in UI mode
npm run test:headed     # Run tests in headed mode
npx playwright test     # Direct playwright CLI
npx playwright test --grep "pattern"  # Run matching tests
npx playwright show-report  # View HTML report
```

## Writing Tests

```typescript
import { test, expect } from '@playwright/test';

test('description', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toHaveText('Example');
});
```

## Key Patterns

- **Locators**: `page.locator('selector')`, `page.getByRole()`, `page.getByText()`
- **Assertions**: Use `expect(locator).toBeVisible()`, `.toHaveText()`, `.toHaveCount()`
- **Network**: `await page.route()` to intercept/modify requests
- **Helpers**: `test.beforeEach()`, `test.afterEach()` for setup/teardown

## Locator Priority

When creating locators, use this priority order:

1. **`getByRole()`** - For buttons, links, headings, textboxes (e.g., `getByRole('button', { name: 'Login' })`, `getByRole('textbox', { name: 'Username' })`)
2. **`getByLabel()`** - For form inputs with labels (e.g., `getByLabel('Username')`)
3. **`getByPlaceholder()`** - For inputs with placeholder text
4. **`getByText()`** - For visible text elements
5. **`locator()`** - Only when accessibility locators aren't available or cause strict mode violations

```typescript
// Good - prioritizes accessibility
await page.getByRole('button', { name: 'Login' }).click();
await page.getByLabel('Username').fill('user');
await page.getByPlaceholder('Enter email').fill('test@example.com');

// Fallback to locator when needed
await page.locator('#unique-id').click();
await page.locator('[data-testid="submit"]').click();
```

## Page Object Model (POM)

Follow the POM design pattern:

```typescript
// pages/BasePage.ts - Base class with common elements
export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }
}

// pages/LoginPage.ts - Page-specific locators and methods
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.locator('#user-name').fill(username);
    await this.page.locator('#password').fill(password);
    await this.page.locator('#login-button').click();
  }
}
```

- BasePage contains common locators (username, password, login button, error message, etc.)
- Page-specific locators go in their respective Page Class
- Tests should use Page Objects, not raw selectors
