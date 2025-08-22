# WordPress Form Testing with Playwright

This project demonstrates how to create reusable functions in Playwright and use them across multiple test files.

## Project Structure

```
tests/
├── utils/
│   └── formUtils.js          # Reusable utility functions
├── config/
│   └── testConfig.js         # Configuration and test data
├── Wp_form.spec.js           # Main test file
├── example-usage.spec.js     # Example of using utility functions
└── example.spec.js           # Original example file
```

## How to Use Utility Functions

### 1. Import Functions

```javascript
import { 
  loginToWordPress, 
  createform, 
  addpage, 
  Form_Submit 
} from './utils/formUtils.js';
```

### 2. Use Functions in Tests

```javascript
test('Complete workflow test', async ({ page }) => {
  // Login using utility function
  await loginToWordPress(page);
  
  // Create form and get shortcode
  const shortcode = await createform(page);
  
  // Add page with shortcode
  await addpage(page, shortcode);
  
  // Submit form
  await Form_Submit(page);
});
```

## Available Utility Functions

### Authentication
- `loginToWordPress(page, username?, password?)` - Login to WordPress

### Form Management
- `createform(page)` - Create a payment form and return shortcode
- `deleteform(page)` - Delete the first form

### Page Management
- `addpage(page, shortcode)` - Add a page with shortcode
- `deletepage(page)` - Delete the third page

### Form Submission
- `Form_Submit(page)` - Fill and submit the payment form

## Configuration

All test data is stored in `tests/config/testConfig.js`:

- **Credentials**: Username and password
- **URLs**: Login, admin, and other page URLs
- **Form Data**: Form field values and options
- **Payment Data**: Test payment information
- **Timeouts**: Various timeout values

## Benefits of This Approach

1. **Reusability**: Functions can be used in multiple test files
2. **Maintainability**: Changes in one place update all tests
3. **Readability**: Test files are cleaner and easier to understand
4. **Configuration**: Test data is centralized and easy to modify
5. **Scalability**: Easy to add new utility functions

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/Wp_form.spec.js

# Run tests in headed mode
npx playwright test --headed

# Run tests with debug
npx playwright test --debug
```

## Adding New Utility Functions

1. Add the function to `tests/utils/formUtils.js`
2. Export it using `export async function functionName()`
3. Import it in your test files
4. Use it in your tests

## Example: Creating a New Test

```javascript
import { test, expect } from '@playwright/test';
import { loginToWordPress, createform } from './utils/formUtils.js';

test('New test using utilities', async ({ page }) => {
  await loginToWordPress(page);
  const shortcode = await createform(page);
  expect(shortcode).toBeTruthy();
});
``` 