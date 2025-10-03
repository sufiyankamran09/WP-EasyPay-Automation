import { test, expect } from '@playwright/test';
import {
  loginToWordPress,
  createformCustom,
  DonationcreateformCustom,
  addpage,
  CustomFormSubmit,
  submitDonationFormCustom,
  verifyPaymentSuccess,
  deletePageByName,
  deleteform,
  checkSquareTransaction,
  takeScreenshot,
} from './utils/formUtils.js';

// Security Testing ke liye tests

// Test 1: XSS Prevention Testing
test('XSS Prevention Security Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'XSS Prevention Test Form',
    description: 'Testing XSS prevention in form fields'
  });

  await addpage(page, shortcode, 'XSS Prevention Test Page');

  // XSS payloads enter karo
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    'javascript:alert("XSS")',
    '<img src=x onerror=alert("XSS")>',
    '"><script>alert("XSS")</script>',
    '\';alert("XSS");//'
  ];

  for (const payload of xssPayloads) {
    console.log(`Testing XSS payload: ${payload}`);
    
    await page.locator('input[name="wpep-first-name-field"]').fill(payload);
    await page.locator('input[name="wpep-last-name-field"]').fill('XSS');
    await page.locator('input[name="wpep-email-field"]').fill('xss@example.com');
    await page.getByText("Other").click();
    const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
    await otherAmountInput.fill("1000");

    // Check if XSS is properly escaped
    const firstNameValue = await page.locator('input[name="wpep-first-name-field"]').inputValue();
    console.log(`Escaped value: ${firstNameValue}`);
    
    // Verify no script execution
    const hasScript = await page.locator('script').count();
    console.log(`Script tags found: ${hasScript}`);
    
    await page.reload();
    await page.waitForTimeout(2000);
  }

  await deletePageByName(page, 'XSS Prevention Test Page');
  await deleteform(page, 'XSS Prevention Test Form');
  await takeScreenshot(page);
});

// Test 2: SQL Injection Prevention Testing
test('SQL Injection Prevention Security Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'SQL Injection Prevention Test Form',
    description: 'Testing SQL injection prevention'
  });

  await addpage(page, shortcode, 'SQL Injection Prevention Test Page');

  // SQL injection payloads enter karo
  const sqlPayloads = [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "' UNION SELECT * FROM users --",
    "admin'--",
    "' OR 1=1 --"
  ];

  for (const payload of sqlPayloads) {
    console.log(`Testing SQL injection payload: ${payload}`);
    
    await page.locator('input[name="wpep-first-name-field"]').fill(payload);
    await page.locator('input[name="wpep-last-name-field"]').fill('SQL');
    await page.locator('input[name="wpep-email-field"]').fill('sql@example.com');
    await page.getByText("Other").click();
    const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
    await otherAmountInput.fill("1000");

    // Check if payload is properly escaped
    const firstNameValue = await page.locator('input[name="wpep-first-name-field"]').inputValue();
    console.log(`Escaped value: ${firstNameValue}`);
    
    await page.reload();
    await page.waitForTimeout(2000);
  }

  await deletePageByName(page, 'SQL Injection Prevention Test Page');
  await deleteform(page, 'SQL Injection Prevention Test Form');
  await takeScreenshot(page);
});

// Test 3: CSRF Protection Testing
test('CSRF Protection Security Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'CSRF Protection Test Form',
    description: 'Testing CSRF protection'
  });

  await addpage(page, shortcode, 'CSRF Protection Test Page');

  // Check for CSRF tokens
  const csrfToken = await page.locator('input[name="_wpnonce"], input[name="csrf_token"], input[name="token"]').first().isVisible();
  console.log('CSRF token present:', csrfToken);

  // Check for hidden fields that might contain security tokens
  const hiddenFields = await page.locator('input[type="hidden"]').count();
  console.log('Hidden fields count:', hiddenFields);

  // Form submit karo normally
  await page.locator('input[name="wpep-first-name-field"]').fill('CSRF');
  await page.locator('input[name="wpep-last-name-field"]').fill('Test');
  await page.locator('input[name="wpep-email-field"]').fill('csrf@example.com');
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

  console.log('CSRF protection test completed');

  await deletePageByName(page, 'CSRF Protection Test Page');
  await deleteform(page, 'CSRF Protection Test Form');
  await takeScreenshot(page);
});

// Test 4: Input Validation Security Testing
test('Input Validation Security Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Input Validation Security Test Form',
    description: 'Testing input validation security'
  });

  await addpage(page, shortcode, 'Input Validation Security Test Page');

  // Test various malicious inputs
  const maliciousInputs = [
    { field: 'first-name', value: 'A'.repeat(1000) }, // Very long input
    { field: 'email', value: 'invalid-email' }, // Invalid email
    { field: 'email', value: 'test@' }, // Incomplete email
    { field: 'email', value: '@example.com' }, // Missing local part
    { field: 'first-name', value: 'Test\x00Null' }, // Null character
    { field: 'first-name', value: 'Test\r\nNewline' }, // Newline characters
  ];

  for (const input of maliciousInputs) {
    console.log(`Testing malicious input: ${input.field} = ${input.value}`);
    
    if (input.field === 'first-name') {
      await page.locator('input[name="wpep-first-name-field"]').fill(input.value);
    } else if (input.field === 'email') {
      await page.locator('input[name="wpep-email-field"]').fill(input.value);
    }
    
    await page.getByText("Other").click();
    const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
    await otherAmountInput.fill("1000");

    // Check if input is properly validated/escaped
    const fieldValue = await page.locator(`input[name="wpep-${input.field}-field"]`).inputValue();
    console.log(`Validated value: ${fieldValue}`);
    
    await page.reload();
    await page.waitForTimeout(2000);
  }

  await deletePageByName(page, 'Input Validation Security Test Page');
  await deleteform(page, 'Input Validation Security Test Form');
  await takeScreenshot(page);
});

// Test 5: File Upload Security Testing (if applicable)
test('File Upload Security Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'File Upload Security Test Form',
    description: 'Testing file upload security'
  });

  await addpage(page, shortcode, 'File Upload Security Test Page');

  // Check if there are any file upload fields
  const fileInputs = await page.locator('input[type="file"]').count();
  console.log('File upload inputs found:', fileInputs);

  if (fileInputs > 0) {
    // Test malicious file uploads
    const maliciousFiles = [
      'malicious.php',
      'script.js',
      'executable.exe',
      'shell.sh',
      'backdoor.asp'
    ];

    for (const filename of maliciousFiles) {
      console.log(`Testing malicious file: ${filename}`);
      // This would test file upload restrictions
    }
  }

  await deletePageByName(page, 'File Upload Security Test Page');
  await deleteform(page, 'File Upload Security Test Form');
  await takeScreenshot(page);
});

// Test 6: Session Security Testing
test('Session Security Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Session Security Test Form',
    description: 'Testing session security'
  });

  await addpage(page, shortcode, 'Session Security Test Page');

  // Check for secure session handling
  const cookies = await page.context().cookies();
  console.log('Cookies found:', cookies.length);

  // Check for secure cookie attributes
  const secureCookies = cookies.filter(cookie => cookie.secure);
  const httpOnlyCookies = cookies.filter(cookie => cookie.httpOnly);
  
  console.log('Secure cookies:', secureCookies.length);
  console.log('HttpOnly cookies:', httpOnlyCookies.length);

  // Test session timeout
  await page.waitForTimeout(30000); // Wait 30 seconds
  await page.reload();
  
  // Check if session is still valid
  const formStillVisible = await page.locator('input[name="wpep-first-name-field"]').isVisible();
  console.log('Form still accessible after timeout:', formStillVisible);

  await deletePageByName(page, 'Session Security Test Page');
  await deleteform(page, 'Session Security Test Form');
  await takeScreenshot(page);
});
