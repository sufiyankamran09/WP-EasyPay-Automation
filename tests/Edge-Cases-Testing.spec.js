import { test, expect } from '@playwright/test';
import {
  loginToWordPress,
  createformCustom,
  DonationcreateformCustom,
  Subscriptioncreateform,
  addpage,
  CustomFormSubmit,
  submitDonationFormCustom,
  submitSubscriptionForm,
  verifyPaymentSuccess,
  deletePageByName,
  deleteform,
  checkSquareTransaction,
  takeScreenshot,
} from './utils/formUtils.js';

// Edge Cases Testing ke liye tests

// Test 1: Invalid Card Number Testing
test('Invalid Card Number Edge Case Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Invalid Card Test Form',
    description: 'Testing invalid card number handling'
  });

  await addpage(page, shortcode, 'Invalid Card Test Page');

  // Form fill karo with valid data
  await page.locator('input[name="wpep-first-name-field"]').fill('Invalid');
  await page.locator('input[name="wpep-last-name-field"]').fill('Card');
  await page.locator('input[name="wpep-email-field"]').fill('invalid@example.com');
  await page.getByText("Other").click();
  const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput.fill("1000");

  // Invalid card details enter karo
  await page.waitForTimeout(2000);
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "Card number" })
    .fill("1234 5678 9012 3456"); // Invalid card number
  await page.waitForTimeout(1000);
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "MM/YY" })
    .fill("11/29");
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "CVV" })
    .fill("321");
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "ZIP" })
    .fill("43523");
  await page.getByRole("checkbox", { name: "I accept the" }).check();

  // Form submit karo
  await page.getByRole("button", { name: "Pay $" }).click();
  await page.waitForTimeout(5000);

  // Error message check karo
  const errorVisible = await page.locator('text=/error|invalid|declined/i').isVisible();
  console.log('Error message visible:', errorVisible);

  await deletePageByName(page, 'Invalid Card Test Page');
  await deleteform(page, 'Invalid Card Test Form');
  await takeScreenshot(page);
});

// Test 2: Expired Card Testing
test('Expired Card Edge Case Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Expired Card Test Form',
    description: 'Testing expired card handling'
  });

  await addpage(page, shortcode, 'Expired Card Test Page');

  // Form fill karo
  await page.locator('input[name="wpep-first-name-field"]').fill('Expired');
  await page.locator('input[name="wpep-last-name-field"]').fill('Card');
  await page.locator('input[name="wpep-email-field"]').fill('expired@example.com');
  await page.getByText("Other").click();
  const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput.fill("1000");

  // Expired card details enter karo
  await page.waitForTimeout(2000);
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "Card number" })
    .fill("4111 1111 1111 1111");
  await page.waitForTimeout(1000);
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "MM/YY" })
    .fill("01/20"); // Expired date
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "CVV" })
    .fill("321");
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "ZIP" })
    .fill("43523");
  await page.getByRole("checkbox", { name: "I accept the" }).check();

  // Form submit karo
  await page.getByRole("button", { name: "Pay $" }).click();
  await page.waitForTimeout(5000);

  // Error handling check karo
  console.log('Testing expired card handling...');

  await deletePageByName(page, 'Expired Card Test Page');
  await deleteform(page, 'Expired Card Test Form');
  await takeScreenshot(page);
});

// Test 3: Empty Form Fields Testing
test('Empty Form Fields Edge Case Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Empty Fields Test Form',
    description: 'Testing empty form field validation'
  });

  await addpage(page, shortcode, 'Empty Fields Test Page');

  // Form submit karo without filling any fields
  await page.getByRole("button", { name: "Pay $" }).click();
  await page.waitForTimeout(3000);

  // Validation error check karo
  const validationError = await page.locator('text=/required|fill|enter/i').isVisible();
  console.log('Validation error visible:', validationError);

  await deletePageByName(page, 'Empty Fields Test Page');
  await deleteform(page, 'Empty Fields Test Form');
  await takeScreenshot(page);
});

// Test 4: Special Characters in Form Fields
test('Special Characters Edge Case Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Special Characters Test Form',
    description: 'Testing special characters handling'
  });

  await addpage(page, shortcode, 'Special Characters Test Page');

  // Special characters enter karo
  await page.locator('input[name="wpep-first-name-field"]').fill('Test@#$%');
  await page.locator('input[name="wpep-last-name-field"]').fill('User&*()');
  await page.locator('input[name="wpep-email-field"]').fill('test+special@example.com');
  await page.getByText("Other").click();
  const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput.fill("1000");

  // Card details enter karo
  await page.waitForTimeout(2000);
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "Card number" })
    .fill("4111 1111 1111 1111");
  await page.waitForTimeout(1000);
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "MM/YY" })
    .fill("11/29");
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "CVV" })
    .fill("321");
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "ZIP" })
    .fill("43523");
  await page.getByRole("checkbox", { name: "I accept the" }).check();

  // Form submit karo
  await page.getByRole("button", { name: "Pay $" }).click();
  await page.waitForTimeout(3000);

  console.log('Testing special characters handling...');

  await deletePageByName(page, 'Special Characters Test Page');
  await deleteform(page, 'Special Characters Test Form');
  await takeScreenshot(page);
});

// Test 5: Very Large Amount Testing
test('Very Large Amount Edge Case Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Large Amount Test Form',
    description: 'Testing very large amount handling',
    maxAmount: '999999999'
  });

  await addpage(page, shortcode, 'Large Amount Test Page');

  // Form fill karo
  await page.locator('input[name="wpep-first-name-field"]').fill('Large');
  await page.locator('input[name="wpep-last-name-field"]').fill('Amount');
  await page.locator('input[name="wpep-email-field"]').fill('large@example.com');
  await page.getByText("Other").click();
  const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput.fill("999999999"); // Very large amount

  // Card details enter karo
  await page.waitForTimeout(2000);
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "Card number" })
    .fill("4111 1111 1111 1111");
  await page.waitForTimeout(1000);
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "MM/YY" })
    .fill("11/29");
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "CVV" })
    .fill("321");
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "ZIP" })
    .fill("43523");
  await page.getByRole("checkbox", { name: "I accept the" }).check();

  // Form submit karo
  await page.getByRole("button", { name: "Pay $" }).click();
  await page.waitForTimeout(5000);

  console.log('Testing very large amount handling...');

  await deletePageByName(page, 'Large Amount Test Page');
  await deleteform(page, 'Large Amount Test Form');
  await takeScreenshot(page);
});

// Test 6: Network Timeout Testing
test('Network Timeout Edge Case Testing', async ({ page }) => {
  test.setTimeout(300000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Network Timeout Test Form',
    description: 'Testing network timeout handling'
  });

  await addpage(page, shortcode, 'Network Timeout Test Page');

  // Network timeout simulate karo
  await page.route('**/pci-connect.squareupsandbox.com/payments/mtx/v2', route => {
    setTimeout(() => {
      route.abort('timedout');
    }, 1000);
  });

  // Form fill karo
  await page.locator('input[name="wpep-first-name-field"]').fill('Timeout');
  await page.locator('input[name="wpep-last-name-field"]').fill('Test');
  await page.locator('input[name="wpep-email-field"]').fill('timeout@example.com');
  await page.getByText("Other").click();
  const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput.fill("1000");

  // Card details enter karo
  await page.waitForTimeout(2000);
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "Card number" })
    .fill("4111 1111 1111 1111");
  await page.waitForTimeout(1000);
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "MM/YY" })
    .fill("11/29");
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "CVV" })
    .fill("321");
  await page
    .locator('//iframe[@title="Secure Credit Card Form"]')
    .contentFrame()
    .getByRole("textbox", { name: "ZIP" })
    .fill("43523");
  await page.getByRole("checkbox", { name: "I accept the" }).check();

  // Form submit karo
  await page.getByRole("button", { name: "Pay $" }).click();
  await page.waitForTimeout(10000);

  console.log('Testing network timeout handling...');

  await deletePageByName(page, 'Network Timeout Test Page');
  await deleteform(page, 'Network Timeout Test Form');
  await takeScreenshot(page);
});
