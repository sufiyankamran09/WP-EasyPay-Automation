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

// API Integration Testing ke liye tests

// Test 1: Square API Integration Testing
test('Square API Integration Testing', async ({ page }) => {
  test.setTimeout(300000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Square API Integration Test Form',
    description: 'Testing Square API integration'
  });

  await addpage(page, shortcode, 'Square API Integration Test Page');

  // Monitor API calls
  const apiCalls = [];
  
  page.on('request', request => {
    if (request.url().includes('square') || request.url().includes('squareupsandbox')) {
      apiCalls.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers()
      });
    }
  });

  // Form submit karo
  const submittedAmount = await CustomFormSubmit(page, { currency: 'dollar' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount);

  // API calls verify karo
  console.log('Square API calls made:', apiCalls.length);
  apiCalls.forEach((call, index) => {
    console.log(`API Call ${index + 1}:`, call.method, call.url);
  });

  // Verify required API calls were made
  expect(apiCalls.length).toBeGreaterThan(0);
  
  const paymentCalls = apiCalls.filter(call => 
    call.url.includes('payments') || call.url.includes('payment')
  );
  expect(paymentCalls.length).toBeGreaterThan(0);

  await deletePageByName(page, 'Square API Integration Test Page');
  await deleteform(page, 'Square API Integration Test Form');
  await takeScreenshot(page);
});

// Test 2: WordPress AJAX API Testing
test('WordPress AJAX API Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'WordPress AJAX API Test Form',
    description: 'Testing WordPress AJAX API integration'
  });

  await addpage(page, shortcode, 'WordPress AJAX API Test Page');

  // Monitor AJAX calls
  const ajaxCalls = [];
  
  page.on('request', request => {
    if (request.url().includes('admin-ajax.php') || request.url().includes('wp-json')) {
      ajaxCalls.push({
        url: request.url(),
        method: request.method(),
        postData: request.postData()
      });
    }
  });

  // Form submit karo
  const submittedAmount = await CustomFormSubmit(page, { currency: 'dollar' });
  await verifyPaymentSuccess(page);

  // AJAX calls verify karo
  console.log('WordPress AJAX calls made:', ajaxCalls.length);
  ajaxCalls.forEach((call, index) => {
    console.log(`AJAX Call ${index + 1}:`, call.method, call.url);
  });

  await deletePageByName(page, 'WordPress AJAX API Test Page');
  await deleteform(page, 'WordPress AJAX API Test Form');
  await takeScreenshot(page);
});

// Test 3: Payment Gateway Response Testing
test('Payment Gateway Response Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Payment Gateway Response Test Form',
    description: 'Testing payment gateway response handling'
  });

  await addpage(page, shortcode, 'Payment Gateway Response Test Page');

  // Monitor response codes
  const responses = [];
  
  page.on('response', response => {
    if (response.url().includes('square') || response.url().includes('payment')) {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });

  // Form submit karo
  const submittedAmount = await CustomFormSubmit(page, { currency: 'dollar' });
  await verifyPaymentSuccess(page);

  // Response codes verify karo
  console.log('Payment gateway responses:', responses.length);
  responses.forEach((response, index) => {
    console.log(`Response ${index + 1}:`, response.status, response.statusText, response.url);
  });

  // Verify successful responses
  const successfulResponses = responses.filter(r => r.status >= 200 && r.status < 300);
  expect(successfulResponses.length).toBeGreaterThan(0);

  await deletePageByName(page, 'Payment Gateway Response Test Page');
  await deleteform(page, 'Payment Gateway Response Test Form');
  await takeScreenshot(page);
});

// Test 4: Error Response Handling Testing
test('Error Response Handling Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Error Response Handling Test Form',
    description: 'Testing error response handling'
  });

  await addpage(page, shortcode, 'Error Response Handling Test Page');

  // Intercept and modify responses to simulate errors
  await page.route('**/pci-connect.squareupsandbox.com/payments/mtx/v2', route => {
    route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        errors: [{
          category: 'INVALID_REQUEST_ERROR',
          code: 'INVALID_REQUEST_ERROR',
          detail: 'Test error response'
        }]
      })
    });
  });

  // Form submit karo
  await page.locator('input[name="wpep-first-name-field"]').fill('Error');
  await page.locator('input[name="wpep-last-name-field"]').fill('Test');
  await page.locator('input[name="wpep-email-field"]').fill('error@example.com');
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
  await page.waitForTimeout(5000);

  // Error handling verify karo
  console.log('Testing error response handling...');

  await deletePageByName(page, 'Error Response Handling Test Page');
  await deleteform(page, 'Error Response Handling Test Form');
  await takeScreenshot(page);
});

// Test 5: Webhook Integration Testing
test('Webhook Integration Testing', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'Webhook Integration Test Form',
    description: 'Testing webhook integration'
  });

  await addpage(page, shortcode, 'Webhook Integration Test Page');

  // Monitor webhook calls
  const webhookCalls = [];
  
  page.on('request', request => {
    if (request.url().includes('webhook') || request.url().includes('callback')) {
      webhookCalls.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers()
      });
    }
  });

  // Form submit karo
  const submittedAmount = await CustomFormSubmit(page, { currency: 'dollar' });
  await verifyPaymentSuccess(page);

  // Webhook calls verify karo
  console.log('Webhook calls made:', webhookCalls.length);
  webhookCalls.forEach((call, index) => {
    console.log(`Webhook Call ${index + 1}:`, call.method, call.url);
  });

  await deletePageByName(page, 'Webhook Integration Test Page');
  await deleteform(page, 'Webhook Integration Test Form');
  await takeScreenshot(page);
});

// Test 6: API Rate Limiting Testing
test('API Rate Limiting Testing', async ({ page }) => {
  test.setTimeout(400000);

  await loginToWordPress(page);

  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    title: 'API Rate Limiting Test Form',
    description: 'Testing API rate limiting'
  });

  await addpage(page, shortcode, 'API Rate Limiting Test Page');

  // Monitor rate limiting responses
  const rateLimitResponses = [];
  
  page.on('response', response => {
    if (response.status() === 429 || response.headers()['x-ratelimit-remaining']) {
      rateLimitResponses.push({
        url: response.url(),
        status: response.status(),
        headers: response.headers()
      });
    }
  });

  // Multiple rapid submissions try karo
  for (let i = 1; i <= 5; i++) {
    console.log(`Rapid submission ${i}`);
    
    await page.locator('input[name="wpep-first-name-field"]').fill(`Rate${i}`);
    await page.locator('input[name="wpep-last-name-field"]').fill('Test');
    await page.locator('input[name="wpep-email-field"]').fill(`rate${i}@example.com`);
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
    await page.waitForTimeout(2000);
    
    await page.reload();
    await page.waitForTimeout(1000);
  }

  // Rate limiting responses verify karo
  console.log('Rate limiting responses:', rateLimitResponses.length);
  rateLimitResponses.forEach((response, index) => {
    console.log(`Rate Limit Response ${index + 1}:`, response.status, response.url);
  });

  await deletePageByName(page, 'API Rate Limiting Test Page');
  await deleteform(page, 'API Rate Limiting Test Form');
  await takeScreenshot(page);
});
