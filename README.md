# Playwright E2E Testing with LLM

A Playwright-based end-to-end testing project for [Sauce Demo](https://www.saucedemo.com), configured with TypeScript, Page Object Model (POM) pattern, and OpenCode agent integration.

## Tech Stack

- **Playwright** - Cross-browser E2E testing framework
- **TypeScript** - Type-safe JavaScript
- **ESLint** - Code linting with TypeScript and Prettier support
- **Pre-commit hooks** - Automated linting and validation

## Project Structure

```
├── pages/                  # Page Object Model classes
│   ├── BasePage.ts        # Base class with common locators and helper methods
│   ├── login.ts           # Login page object
│   └── inventory.ts       # Inventory page object
├── tests/                  # Playwright test specs
│   ├── login.spec.ts      # Login feature tests
│   └── seed.spec.ts       # Placeholder test
├── .opencode/             # OpenCode agents and skills
│   └── skills/            # Agent skill definitions
├── playwright.config.ts   # Playwright configuration
├── eslint.config.mjs     # ESLint configuration
├── tsconfig.json         # TypeScript configuration
└── .pre-commit-config.yaml # Pre-commit hooks
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
npx playwright install --with-deps chromium
```

### Running Tests

```bash
npm test                 # Run all tests
npm run test:ui          # Run tests in UI mode
npm run test:headed      # Run tests in headed mode
```

### Linting

```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
```

## Test Coverage

### Login Tests

- [x] Display login form with all elements
- [x] Successful login with valid credentials
- [x] Error with invalid credentials
- [x] Error with empty username
- [x] Error with empty password
- [x] Error for locked out user
- [x] Clear error on retry login
- [x] Logout and return to login page

## Page Object Model

This project follows the POM design pattern with a `BasePage` class containing common locators and helper methods.

### BasePage Methods

- `getTextBoxLocatorByName(name)` - Get textbox by role
- `getButtonLocatorByName(name, exact?)` - Get button by role
- `getLinkLocatorByName(name)` - Get link by role
- `navigate(path)` - Navigate to a path
- `getErrorMessage()` - Get error message text
- `isErrorVisible()` - Check if error is visible

### Example Usage

```typescript
import { LoginPage } from 'pages/login';

test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate('/');
  await loginPage.login('standard_user', 'secret_sauce');
});
```

## Locator Priority

Locators follow this priority order:

1. `getByRole()` - Buttons, links, headings, textboxes
2. `getByLabel()` - Form inputs with labels
3. `getByPlaceholder()` - Inputs with placeholder text
4. `getByText()` - Visible text elements
5. `locator()` - Fallback when accessibility locators unavailable

## OpenCode Integration

This project is configured for use with OpenCode AI coding agent:

- **playwright skill** - General Playwright automation guidance
- **playwright-cli skill** - Playwright CLI commands reference
- **Rules** - POM pattern and locator priority enforcement

## License

ISC
