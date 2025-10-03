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

// Data Validation Testing ke liye tests

// Test 1: Email Validation Testing
test('Email Validation Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Email Validation Test Form',
    description: 'Testing email validation'
  });

  await addpage(page, shortcode, 'Email Validation Test Page');

  const invalidEmails = [
    'invalid-email',
    'test@',
    '@example.com',
    'test..test@example.com',
    'test@.com',
    'test@example.',
    'test space@example.com',
    'test@exam ple.com',
    'test@example.com.',
    'test@@example.com'
  ];

  for (const email of invalidEmails) {
    console.log(`Testing invalid email: ${email}`);
    
    await page.locator('input[name="wpep-first-name-field"]').fill('Email');
    await page.locator('input[name="wpep-last-name-field"]').fill('Test');
    await page.locator('input[name="wpep-email-field"]').fill(email);
    await page.getByText("Other").click();
    const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
    await otherAmountInput.fill("1000");

    await page.getByRole("button", { name: "Pay $" }).click();
    await page.waitForTimeout(3000);

    // Check for email validation error
    const emailError = await page.locator('text=/email|invalid|format|valid/i').isVisible();
    console.log(`Email validation error for "${email}": ${emailError}`);

    await page.reload();
    await page.waitForTimeout(2000);
  }

  // Test valid email
  console.log('Testing valid email: test@example.com');
  await page.locator('input[name="wpep-first-name-field"]').fill('Email');
  await page.locator('input[name="wpep-last-name-field"]').fill('Test');
  await page.locator('input[name="wpep-email-field"]').fill('test@example.com');
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

  await page.getByRole("button", { name: "Pay $" }).click();
  await page.waitForTimeout(3000);

  const emailErrorValid = await page.locator('text=/email|invalid|format|valid/i').isVisible();
  console.log(`Email validation error for valid email: ${emailErrorValid}`);

  await deletePageByName(page, 'Email Validation Test Page');
  await deleteform(page, 'Email Validation Test Form');
  await takeScreenshot(page);
});

// Test 2: Required Field Validation Testing
test('Required Field Validation Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Required Field Validation Test Form',
    description: 'Testing required field validation'
  });

  await addpage(page, shortcode, 'Required Field Validation Test Page');

  // Test empty first name
  await page.locator('input[name="wpep-last-name-field"]').fill('Test');
  await page.locator('input[name="wpep-email-field"]').fill('test@example.com');
  await page.getByText("Other").click();
  const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput.fill("1000");

  await page.getByRole("button", { name: "Pay $" }).click();
  await page.waitForTimeout(3000);

  const firstNameError = await page.locator('text=/first.*name|required/i').isVisible();
  console.log('First name required error:', firstNameError);

  await page.reload();
  await page.waitForTimeout(2000);

  // Test empty last name
  await page.locator('input[name="wpep-first-name-field"]').fill('Test');
  await page.locator('input[name="wpep-email-field"]').fill('test@example.com');
  await page.getByText("Other").click();
  const otherAmountInput2 = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput2.fill("1000");

  await page.getByRole("button", { name: "Pay $" }).click();
  await page.waitForTimeout(3000);

  const lastNameError = await page.locator('text=/last.*name|required/i').isVisible();
  console.log('Last name required error:', lastNameError);

  await page.reload();
  await page.waitForTimeout(2000);

  // Test empty email
  await page.locator('input[name="wpep-first-name-field"]').fill('Test');
  await page.locator('input[name="wpep-last-name-field"]').fill('Test');
  await page.getByText("Other").click();
  const otherAmountInput3 = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput3.fill("1000");

  await page.getByRole("button", { name: "Pay $" }).click();
  await page.waitForTimeout(3000);

  const emailError = await page.locator('text=/email|required/i').isVisible();
  console.log('Email required error:', emailError);

  await deletePageByName(page, 'Required Field Validation Test Page');
  await deleteform(page, 'Required Field Validation Test Form');
  await takeScreenshot(page);
});

// Test 3: Amount Validation Testing
test('Amount Validation Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Amount Validation Test Form',
    description: 'Testing amount validation',
    minAmount: '100',
    maxAmount: '10000'
  });

  await addpage(page, shortcode, 'Amount Validation Test Page');

  const invalidAmounts = [
    '50',    // Below minimum
    '15000', // Above maximum
    '0',     // Zero amount
    '-100',  // Negative amount
    'abc',   // Non-numeric
    '10.5.5', // Invalid decimal
    '10,000', // Comma in amount
    '10 000', // Space in amount
    ''       // Empty amount
  ];

  for (const amount of invalidAmounts) {
    console.log(`Testing invalid amount: ${amount}`);
    
    await page.locator('input[name="wpep-first-name-field"]').fill('Amount');
    await page.locator('input[name="wpep-last-name-field"]').fill('Test');
    await page.locator('input[name="wpep-email-field"]').fill('amount@example.com');
    await page.getByText("Other").click();
    const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
    await otherAmountInput.fill(amount);

    await page.getByRole("button", { name: "Pay $" }).click();
    await page.waitForTimeout(3000);

    // Check for amount validation error
    const amountError = await page.locator('text=/amount|minimum|maximum|invalid|valid/i').isVisible();
    console.log(`Amount validation error for "${amount}": ${amountError}`);

    await page.reload();
    await page.waitForTimeout(2000);
  }

  // Test valid amount
  console.log('Testing valid amount: 1000');
  await page.locator('input[name="wpep-first-name-field"]').fill('Amount');
  await page.locator('input[name="wpep-last-name-field"]').fill('Test');
  await page.locator('input[name="wpep-email-field"]').fill('amount@example.com');
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

  await page.getByRole("button", { name: "Pay $" }).click();
  await page.waitForTimeout(3000);

  const amountErrorValid = await page.locator('text=/amount|minimum|maximum|invalid|valid/i').isVisible();
  console.log(`Amount validation error for valid amount: ${amountErrorValid}`);

  await deletePageByName(page, 'Amount Validation Test Page');
  await deleteform(page, 'Amount Validation Test Form');
  await takeScreenshot(page);
});

// Test 4: Character Length Validation Testing
test('Character Length Validation Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Character Length Validation Test Form',
    description: 'Testing character length validation'
  });

  await addpage(page, shortcode, 'Character Length Validation Test Page');

  // Test very long first name
  const longFirstName = 'A'.repeat(1000);
  await page.locator('input[name="wpep-first-name-field"]').fill(longFirstName);
  await page.locator('input[name="wpep-last-name-field"]').fill('Test');
  await page.locator('input[name="wpep-email-field"]').fill('length@example.com');
  await page.getByText("Other").click();
  const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput.fill("1000");

  await page.getByRole("button", { name: "Pay $" }).click();
  await page.waitForTimeout(3000);

  const lengthError = await page.locator('text=/length|too.*long|maximum|limit/i').isVisible();
  console.log('Character length error for long first name:', lengthError);

  // Check if input was truncated
  const firstNameValue = await page.locator('input[name="wpep-first-name-field"]').inputValue();
  console.log(`First name length after input: ${firstNameValue.length}`);

  await page.reload();
  await page.waitForTimeout(2000);

  // Test very long last name
  const longLastName = 'B'.repeat(1000);
  await page.locator('input[name="wpep-first-name-field"]').fill('Test');
  await page.locator('input[name="wpep-last-name-field"]').fill(longLastName);
  await page.locator('input[name="wpep-email-field"]').fill('length@example.com');
  await page.getByText("Other").click();
  const otherAmountInput2 = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput2.fill("1000");

  await page.getByRole("button", { name: "Pay $" }).click();
  await page.waitForTimeout(3000);

  const lastNameLengthError = await page.locator('text=/length|too.*long|maximum|limit/i').isVisible();
  console.log('Character length error for long last name:', lastNameLengthError);

  // Check if input was truncated
  const lastNameValue = await page.locator('input[name="wpep-last-name-field"]').inputValue();
  console.log(`Last name length after input: ${lastNameValue.length}`);

  await deletePageByName(page, 'Character Length Validation Test Page');
  await deleteform(page, 'Character Length Validation Test Form');
  await takeScreenshot(page);
});

// Test 5: Special Characters Validation Testing
test('Special Characters Validation Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Special Characters Validation Test Form',
    description: 'Testing special characters validation'
  });

  await addpage(page, shortcode, 'Special Characters Validation Test Page');

  const specialCharacters = [
    'Test<script>alert("xss")</script>',
    'Test"quotes"',
    "Test'single'quotes",
    'Test&amper&sand',
    'Test<less>than',
    'Test>greater>than',
    'Test|pipe|symbol',
    'Test\\backslash',
    'Test/forward/slash',
    'Test?question?mark',
    'Test#hash#symbol',
    'Test%percent%symbol',
    'Test+plus+symbol',
    'Test=equals=symbol',
    'Test!exclamation!mark',
    'Test@at@symbol',
    'Test$dollar$symbol',
    'Test^caret^symbol',
    'Test~tilde~symbol',
    'Test`backtick`symbol',
    'Test[open]bracket',
    'Test]close]bracket',
    'Test{open}brace',
    'Test}close}brace',
    'Test(open)paren',
    'Test)close)paren'
  ];

  for (const specialChar of specialCharacters) {
    console.log(`Testing special characters: ${specialChar.substring(0, 20)}...`);
    
    await page.locator('input[name="wpep-first-name-field"]').fill(specialChar);
    await page.locator('input[name="wpep-last-name-field"]').fill('Special');
    await page.locator('input[name="wpep-email-field"]').fill('special@example.com');
    await page.getByText("Other").click();
    const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
    await otherAmountInput.fill("1000");

    await page.getByRole("button", { name: "Pay $" }).click();
    await page.waitForTimeout(3000);

    // Check for special character validation error
    const specialCharError = await page.locator('text=/invalid|special|character|allowed/i').isVisible();
    console.log(`Special character validation error: ${specialCharError}`);

    // Check if input was sanitized
    const firstNameValue = await page.locator('input[name="wpep-first-name-field"]').inputValue();
    console.log(`Sanitized value: ${firstNameValue.substring(0, 50)}...`);

    await page.reload();
    await page.waitForTimeout(2000);
  }

  await deletePageByName(page, 'Special Characters Validation Test Page');
  await deleteform(page, 'Special Characters Validation Test Form');
  await takeScreenshot(page);
});

// Test 6: Numeric Validation Testing
test('Numeric Validation Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Numeric Validation Test Form',
    description: 'Testing numeric validation'
  });

  await addpage(page, shortcode, 'Numeric Validation Test Page');

  const numericTests = [
    { field: 'first-name', value: '123', description: 'Numbers in first name' },
    { field: 'last-name', value: '456', description: 'Numbers in last name' },
    { field: 'email', value: '123@456.com', description: 'Numbers in email' }
  ];

  for (const test of numericTests) {
    console.log(`Testing: ${test.description}`);
    
    if (test.field === 'first-name') {
      await page.locator('input[name="wpep-first-name-field"]').fill(test.value);
      await page.locator('input[name="wpep-last-name-field"]').fill('Numeric');
    } else if (test.field === 'last-name') {
      await page.locator('input[name="wpep-first-name-field"]').fill('Numeric');
      await page.locator('input[name="wpep-last-name-field"]').fill(test.value);
    } else if (test.field === 'email') {
      await page.locator('input[name="wpep-first-name-field"]').fill('Numeric');
      await page.locator('input[name="wpep-last-name-field"]').fill('Test');
      await page.locator('input[name="wpep-email-field"]').fill(test.value);
    }

    await page.getByText("Other").click();
    const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
    await otherAmountInput.fill("1000");

    await page.getByRole("button", { name: "Pay $" }).click();
    await page.waitForTimeout(3000);

    // Check for numeric validation error
    const numericError = await page.locator('text=/numeric|number|invalid|valid/i').isVisible();
    console.log(`Numeric validation error for ${test.field}: ${numericError}`);

    await page.reload();
    await page.waitForTimeout(2000);
  }

  await deletePageByName(page, 'Numeric Validation Test Page');
  await deleteform(page, 'Numeric Validation Test Form');
  await takeScreenshot(page);
});
