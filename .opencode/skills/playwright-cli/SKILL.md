---
name: playwright-cli
description: Playwright CLI commands - opencode agent skill for running playwright test runner CLI, generating tests, debugging, managing browsers, and using codegen.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: testing
---

## Playwright CLI Reference

### Running Tests

```bash
npx playwright test                    # Run all tests
npx playwright test file.spec.ts       # Run specific file
npx playwright test --grep "pattern"    # Run tests matching pattern
npx playwright test --grep-invert "skip" # Skip tests matching pattern
npx playwright test --workers 4        # Parallel workers
npx playwright test --retries 3         # Retry failed tests
npx playwright test --timeout 30000     # Timeout per test (ms)
```

### UI & Debugging

```bash
npx playwright test --ui                # Open UI mode
npx playwright test --headed            # Run visible browsers
npx playwright test --debug             # Debug mode
npx playwright show-trace trace.zip     # View trace file
npx playwright show-report              # View HTML report
```

### Codegen & Screenshots

```bash
npx playwright codegen https://example.com   # Generate tests while browsing
npx playwright screenshot url output.png     # Take screenshot
npx playwright pdf url output.pdf            # Generate PDF
```

### Browser Management

```bash
npx playwright install                    # Install browsers
npx playwright install chromium           # Install specific browser
npx playwright install --with-deps        # Install with system deps
npx playwright chromium --version         # Check browser version
```

### Test Generation

```bash
npx playwright test --generate           # Generate test files
npx playwright create page object        # Create page object
```

### Common Options

| Flag | Description |
|------|-------------|
| `--project=name` | Run specific project (browser) |
| `--reporter=list|html|json` | Reporter type |
| `--trace=on-first-retry` | Capture traces on retry |
| `--video=on` | Record video on failure |
| `--screenshot=on` | Capture screenshot on failure |

### Exit Codes

- `0` - All tests passed
- `1` - Tests failed
- `2` - Interrupted by user
- `3` - Internal error
