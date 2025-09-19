# WordPress Form Testing with Playwright

This project demonstrates comprehensive testing of WP Easy Pay plugin forms using Playwright automation framework. It includes tests for various payment form types, layouts, and currencies with reusable utility functions.

## Project Structure

```text
tests/
├── utils/
│   └── formUtils.js                    # Reusable utility functions
├── config/
│   └── testConfig.js                   # Configuration and test data
├── Donation-recurring-custom.spec.js   # Donation recurring with custom layout
├── Donation-recurring-dropdown.spec.js # Donation recurring with dropdown layout
├── Donation-recurring-radio.spec.js    # Donation recurring with radio layout
├── Donation-recurring-tabular.spec.js  # Donation recurring with tabular layout
├── Donation-with-custom.spec.js        # Donation with custom layout
├── Donation-with-dropdown.spec.js      # Donation with dropdown layout
├── Donation-with-radio.spec.js         # Donation with radio layout
├── Donation-with-tabular.spec.js       # Donation with tabular layout
├── Donation-with-square-verification.spec.js # Donation with Square verification
├── Simple-with-custom.spec.js          # Simple payment with custom layout
├── Simple-with-dropdown.spec.js        # Simple payment with dropdown layout
├── Simple-with-radio.spec.js           # Simple payment with radio layout
├── Simple-with-tabular.spec.js         # Simple payment with tabular layout
├── Subscription-custom.spec.js         # Subscription payment with custom layout
├── Subscription-dropdown.spec.js       # Subscription payment with dropdown layout
├── Subscription-radio.spec.js          # Subscription payment with radio layout
├── Subscription-tabular.spec.js        # Subscription payment with tabular layout
└── check.spec.js                       # Test verification file
```

## Test Categories

### 1. Donation Recurring Tests

- **Custom Layout**: Fixed amounts with other amount field
- **Dropdown Layout**: Predefined options in dropdown
- **Radio Layout**: Radio button selection
- **Tabular Layout**: Table format with quantity selection

### 2. Donation Payment Tests

- **Custom Layout**: Fixed amounts with other amount field
- **Dropdown Layout**: Predefined options in dropdown
- **Radio Layout**: Radio button selection
- **Tabular Layout**: Table format with quantity selection
- **Square Verification**: Payment verification with Square

### 3. Simple Payment Tests

- **Custom Layout**: Fixed amounts with other amount field
- **Dropdown Layout**: Predefined options in dropdown
- **Radio Layout**: Radio button selection
- **Tabular Layout**: Table format with quantity selection

### 4. Subscription Payment Tests

- **Custom Layout**: Fixed amounts with other amount field and coupon support
- **Dropdown Layout**: Predefined options in dropdown with coupon support
- **Radio Layout**: Radio button selection with coupon support
- **Tabular Layout**: Table format with quantity selection and coupon support

## Currency Support

Each test category supports three currency formats:

- **Dollar Symbol ($)**: `$1000`,`$2000`, etc.
- **USD Code**: `USD 1000`, `USD 2000`, etc.
- **No Symbol**: `1000`, `2000`, etc.

## Available Utility Functions

### Authentication

- `loginToWordPress(page, username?, password?)` - Login to WordPress admin

### Form Creation

- `DonationcreateformRecurring(page, options)` - Create donation recurring forms (custom, dropdown, radio, tabular)
- `Subscriptioncreateform(page, options)` - Create subscription payment forms (custom, dropdown, radio, tabular)
- `createformCustom(page)` - Create simple payment forms with custom layout
- `createformDropdown(page)` - Create simple payment forms with dropdown layout
- `createformRadio(page)` - Create simple payment forms with radio layout
- `createformTabular(page)` - Create simple payment forms with tabular layout

### Form Submission

- `submitDonationFormRecurring(page, options)` - Submit donation recurring forms
- `submitSubscriptionForm(page, options)` - Submit subscription payment forms
- `CustomFormSubmit(page)` - Submit simple payment forms
- `submitFormDropdown(page, options)` - Submit dropdown forms
- `submitFormRadio(page, options)` - Submit radio forms
- `submitFormTabular(page, options)` - Submit tabular forms

### Page Management

- `addpage(page, shortcode, pageName)` - Add a page with shortcode
- `deletepage(page)` - Delete the last created page
- `deletePageByName(page, pageName)` - Delete page by specific name (handles duplicates)

### Form Management

- `deleteform(page, formName?)` - Delete forms by name or all forms
- `deleteformCustom(page)` - Delete custom forms
- `deleteformDropdown(page)` - Delete dropdown forms
- `deleteformRadio(page)` - Delete radio forms
- `deleteformTabular(page)` - Delete tabular forms

### Payment Verification

- `verifyPaymentSuccess(page)` - Verify payment success message
- `checkSquareTransaction(page, submittedAmount)` - Verify Square transaction

### Utilities

- `takeScreenshot(page)` - Take screenshot for debugging
- `waitForElement(page, selector)` - Wait for element to be visible

## Configuration

All test data is stored in `tests/config/testConfig.js`:

- **Credentials**: WordPress admin credentials
- **URLs**: Login, admin, forms, and pages URLs
- **Form Data**: Form field values, options, and settings
- **Payment Data**: Test payment information (Square test cards)
- **Timeouts**: Various timeout values for different operations
- **Success Messages**: Expected success messages

## Form Options

### Donation Recurring Options

```javascript
{
  currency: 'dollar' | 'usd' | 'none',
  layout: 'custom' | 'dropdown' | 'radio' | 'tabular',
  title: 'Form Title',
  description: 'Form Description',
  subscriptionCycle: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
  subscriptionLength: '1' | '2' | '3' | etc.,
  amount1: '1000',
  amount2: '2000',
  amount3: '3000',
  amount4: '4000',
  minAmount: '1000',
  maxAmount: '100000',
  options: [
    { price: '1000', label: 'Mobile' },
    { price: '2000', label: 'Laptop' },
    { price: '3000', label: 'Bike' },
    { price: '4000', label: 'Car' }
  ]
}
```

### Subscription Payment Options

```javascript
{
  currency: 'dollar' | 'usd' | 'none',
  layout: 'custom' | 'dropdown' | 'radio' | 'tabular',
  title: 'Form Title',
  description: 'Form Description',
  enableCoupon: true | false,
  amount1: '1000',
  amount2: '2000',
  amount3: '3000',
  amount4: '4000',
  minAmount: '1000',
  maxAmount: '50000',
  options: [
    { price: '1000', label: 'Mobile' },
    { price: '2000', label: 'Laptop' },
    { price: '3000', label: 'Bike' },
    { price: '4000', label: 'Car' }
  ]
}
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/Donation-recurring-custom.spec.js

# Run tests in headed mode
npx playwright test --headed

# Run tests with debug
npx playwright test --debug

# Run tests with specific browser
npx playwright test --project=chromium

# Run tests with dry run (check syntax)
npx playwright test --dry-run
```

## Test Execution Flow

1. **Login**: Authenticate to WordPress admin
2. **Create Form**: Generate form with specified options
3. **Add Page**: Create page with form shortcode
4. **Submit Form**: Fill and submit payment form
5. **Verify Payment**: Check payment success and Square transaction
6. **Cleanup**: Delete page and form
7. **Screenshot**: Capture final state

## Key Features

### Dynamic Form Deletion

- **Targeted Deletion**: Delete forms by specific name
- **Duplicate Handling**: Handle multiple forms with same name
- **Dynamic Approach**: Works with page refresh after deletion

### Robust Locators

- **Specific Selectors**: Use `getByTestId`, `locator('#id')`, `nth()`, `first()`
- **Strict Mode Compliance**: Avoid strict mode violations
- **Timeout Handling**: Proper wait strategies for dynamic content

### Error Handling

- **Square Payment**: Handle iframe interactions and popups
- **Form Validation**: Verify form elements before interaction
- **Network Stability**: Wait for network idle before operations

## Benefits

1. **Comprehensive Coverage**: Tests all form types and layouts
2. **Reusable Functions**: DRY principle with utility functions
3. **Maintainable Code**: Centralized configuration and functions
4. **Robust Testing**: Handles edge cases and dynamic content
5. **Easy Extension**: Simple to add new test cases
6. **Clear Structure**: Well-organized test files and functions
7. **Proper Cleanup**: Ensures clean test environment

## Adding New Tests

1. **Create Test File**: Follow naming convention `[Type]-[Layout].spec.js`
2. **Import Functions**: Import required utility functions
3. **Define Test Cases**: Create test cases for different currencies
4. **Use Options**: Pass appropriate options to form functions
5. **Add Cleanup**: Include proper cleanup in each test

## Example Test Structure

```javascript
import { test } from '@playwright/test';
import { 
  loginToWordPress, 
  addpage,
  verifyPaymentSuccess,
  deletepage,
  deleteform,
  DonationcreateformRecurring,
  submitDonationFormRecurring,
  checkSquareTransaction,
  takeScreenshot,
  deletePageByName,
} from './utils/formUtils.js';

test('Donation Recurring with Custom Layout - $ Symbol', async ({ page }) => {
  test.setTimeout(200000);
  
  await loginToWordPress(page);
  
  const shortcode = await DonationcreateformRecurring(page, { 
    currency: 'dollar',
    layout: 'custom',
    title: 'Donation with Recurring',
    description: 'This is the Donation Recurring Form',
    amount1: '1000',
    amount2: '2000',
    amount3: '3000',
    amount4: '4000',
    minAmount: '10000',
    maxAmount: '100000'
  });
  
  await addpage(page, shortcode, '$ Donation Recurring Custom Page');
  
  const submittedAmount1 = await submitDonationFormRecurring(page, { 
    currency: 'dollar',
    layout: 'custom',
    otherAmount: '50000'
  });
  
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);
  
  await deletePageByName(page, '$ Donation Recurring Custom Page');
  await deleteform(page, 'Donation with Recurring');
  
  await takeScreenshot(page);
});
```

## Troubleshooting

### Common Issues

1. **Timeout Errors**: Increase timeout values in test configuration
2. **Strict Mode Violations**: Use more specific locators
3. **Element Not Found**: Add proper wait strategies
4. **Payment Failures**: Verify Square test credentials

### Debug Tips

1. Use `--headed` mode to see browser actions
2. Use `--debug` mode for step-by-step execution
3. Check screenshots in `test-results/` folder
4. Review console logs for error details

## Dependencies

- **Playwright**: Test automation framework
- **Node.js**: JavaScript runtime
- **WordPress**: Content management system
- **WP Easy Pay Plugin**: Payment form plugin
- **Square Payment Gateway**: Payment processing
 
 
