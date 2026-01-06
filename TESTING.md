# Browser Automation Testing

This todo app includes comprehensive browser automation tests using Playwright.

## Test Setup

### Install Browsers

First, install the required browsers:

```bash
npx playwright install chromium
```

If you encounter download issues, you can try:

```bash
# Install all browsers
npx playwright install

# Or install specific browsers
npx playwright install firefox
npx playwright install webkit
```

## Running Tests

### Headless Mode (Default)

Run all tests in headless mode:

```bash
npm test
```

### Headed Mode (Watch Browser)

Run tests with a visible browser window:

```bash
npm run test:headed
```

### UI Mode (Interactive)

Run tests in interactive UI mode for debugging:

```bash
npm run test:ui
```

### View Test Report

After running tests, view the HTML report:

```bash
npm run test:report
```

## Test Coverage

The test suite covers:

### ✅ Basic Functionality
- Display app title
- Show empty state message
- Add new todos via button click
- Add new todos via Enter key
- Prevent adding empty todos

### ✅ Todo Management
- Toggle todo completion status
- Delete todos
- Handle multiple todos

### ✅ Sorting & Organization
- Move completed todos to bottom automatically
- Maintain proper order when adding new todos

### ✅ Statistics
- Display total todos count
- Display completed todos count
- Display active todos count
- Update statistics in real-time

### ✅ Complex Scenarios
- Multiple todo operations
- Mixed complete/incomplete states
- State persistence across operations

## Test File Structure

```
tests/
└── todo.spec.ts          # Main test suite
```

## Configuration

Playwright configuration is in `playwright.config.ts`:

- **Test Directory:** `./tests`
- **Base URL:** `http://localhost:3000`
- **Browser:** Chromium (Desktop Chrome)
- **Auto Start:** Dev server starts automatically
- **Reporter:** HTML report

## Writing New Tests

To add new tests, edit `tests/todo.spec.ts`:

```typescript
test('should do something', async ({ page }) => {
  await page.goto('/')

  // Your test logic here
  await expect(page.getByText('something')).toBeVisible()
})
```

## Debugging Tests

### Run Specific Test

```bash
npx playwright test --grep "should add a new todo"
```

### Run in Debug Mode

```bash
npx playwright test --debug
```

### Generate Code

Use Playwright's code generator to create tests interactively:

```bash
npx playwright codegen http://localhost:3000
```

## CI/CD Integration

The tests are configured to run in CI environments with:
- 2 retries on failure
- Single worker process
- HTML reporter output

## Troubleshooting

### Browser Download Fails

If browser downloads fail due to network restrictions:

1. Use a different network
2. Set up a proxy
3. Manually download browsers from https://playwright.dev/docs/browsers

### Tests Timeout

Increase timeout in `playwright.config.ts`:

```typescript
use: {
  timeout: 30000, // 30 seconds
}
```

### Port Already in Use

If port 3000 is occupied, the tests will reuse the existing server (configured in `webServer.reuseExistingServer`).

## Best Practices

1. **Run tests before commits** to catch regressions
2. **Use UI mode** when developing new tests
3. **Keep tests focused** on user behavior, not implementation
4. **Use meaningful test names** that describe the expected behavior
5. **Clean up after tests** (automatically handled by beforeEach)

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
