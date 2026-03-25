# Rules

- **Always prioritize playwright-cli when accessing the browser whenever possible rather than playwright MCP**. Use `npx playwright test --ui` or `npx playwright test --headed` for interactive browser access. Only use browser MCP tools when specifically required.
- **Use Page Object Model (POM) design pattern**. Create a `BasePage` class with common locators and methods that all page objects extend. Page-specific locators should be built within their respective Page Class.
- **Prioritize accessibility locators**. When creating locators, prioritize `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText` over CSS selectors. Only use `locator()` when accessibility-based locators are not available or cause strict mode violations.

# Agents

## Playwright Agent

Use this agent for writing, debugging, and running Playwright E2E tests.

**Tools available:**
- `browser` - Launch and interact with browsers
- `evaluate` - Run JavaScript in browser context
- `screenshot` - Capture page screenshots
- `pdf` - Generate PDF from pages

**Configuration:**
- Headless: true
- Browser: chromium
- Timeout: 30s

## Playwright Explorer Agent

Use this agent for exploring pages, debugging selectors, and investigating UI issues.

**Tools available:**
- `browser` - Launch and interact with browsers
- `screenshot` - Capture page screenshots
- `evaluate` - Run JavaScript in browser context

**Configuration:**
- Headless: true
- Browser: chromium

# Skills

## playwright

General Playwright test automation skill. Covers:
- Writing tests with locators and assertions
- Page object patterns
- Network interception
- Running tests with various options

## playwright-cli

Playwright CLI reference skill. Covers:
- `playwright test` command options
- UI mode, debug mode, codegen
- Browser management
- Test generation and reporting
