import { test, expect } from '@playwright/test';
import {
  loginToWordPress,
  createFormRadio,
  addpage,
  submitFormRadio,
  verifyPaymentSuccess,
  deletepage,
  deleteform,
  checkSquareTransaction,
  takeScreenshot,
  deletePageByName,
} from './utils/formUtils.js';




// Create and submit a simple payment form with payment Radio layout ($)
test('Simple form with radio layout with $', async ({ page }) => {
  test.setTimeout(200000);

  // Login
  await loginToWordPress(page);

  // Create Form (Radio layout) with $ currency
  const shortcode = await createFormRadio(page, {
    currency: 'dollar',
    title: 'Radio Form',
    description: 'This is the Radio form payment',
  });
  expect(shortcode).toBeTruthy();

  // Add Page with shortcode
  await addpage(page, shortcode, '$ Radio Form Page');

  // Submit form (Radio flow) and pay with $
  const submittedAmount1 = await submitFormRadio(page, { currency: 'dollar' });

  // Verify success
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);

  // Cleanup (delete the created page and form)
  await deletePageByName(page, '$ Radio Form Page');
  await deleteform(page, 'Simple Payment Form');
  await takeScreenshot(page);
});






// Create and submit a simple payment form with payment Radio layout (USD)
test('Simple form with radio layout with USD', async ({ page }) => {
  test.setTimeout(200000);

  // Login
  await loginToWordPress(page);

  // Create Form (Radio layout) with USD currency
  const shortcode = await createFormRadio(page, {
    currency: 'usd',
    title: 'Radio Form',
    description: 'This is the Radio form payment',
  });
  expect(shortcode).toBeTruthy();

  // Add Page with shortcode
  await addpage(page, shortcode, 'USD Radio Form Page');

  // Submit form (Radio flow) and pay with USD
  const submittedAmount2 = await submitFormRadio(page, { currency: 'usd' });

  // Verify success
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  // Cleanup (delete the created page and form)
  await deletePageByName(page, 'USD Radio Form Page');
  await deleteform(page, 'Simple Payment Form');
  await takeScreenshot(page);
});






// Create and submit a simple payment form with payment Radio layout (No code/symbol)
test('Simple form with radio layout with No code/symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login
  await loginToWordPress(page);

  // Create Form (Radio layout) with no code/symbol
  const shortcode = await createFormRadio(page, {
    currency: 'none',
    title: 'Radio Form',
    description: 'This is the Radio form payment',
  });
  expect(shortcode).toBeTruthy();

  // Add Page with shortcode
  await addpage(page, shortcode, 'No Code/Symbol Radio Form Page');

  // Submit form (Radio flow) expecting generic Pay button
  const submittedAmount3 = await submitFormRadio(page, { currency: 'none' });

  // Verify success
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  // Cleanup (delete the created page and form)
  await deletePageByName(page, 'No Code/Symbol Radio Form Page');
  await deleteform(page, 'Simple Payment Form');

  await takeScreenshot(page);
});


