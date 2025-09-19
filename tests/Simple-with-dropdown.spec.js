import { test, expect } from '@playwright/test';
import {
  loginToWordPress,
  createFormDropdown,
  addpage,
  submitFormDropdown,
  verifyPaymentSuccess,
  deletepage,
  deleteform,
  checkSquareTransaction,
  takeScreenshot,
  deletePageByName,
} from './utils/formUtils.js';



// Create and submit a simple payment form with payment dropdown layout ($ Currency symbol)
test('Simple form with dropdown layout with $', async ({ page }) => {
  test.setTimeout(200000);

  // Login
  await loginToWordPress(page);

  // Create Form (Dropdown layout) with $ currency
  const shortcode = await createFormDropdown(page, {
    currency: 'dollar',
    title: '$ Simple Dropdown Form',
    description: 'New form here with layout Dropdown',
  });
  expect(shortcode).toBeTruthy();

  // Add Page with shortcode
  await addpage(page, shortcode, '$ Dropdown Form Page'); 

  // Submit form (Dropdown flow) and pay with $
  const submittedAmount1 = await submitFormDropdown(page, { currency: 'dollar' });

  // Verify success
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);

  // Cleanup (delete the created page and form)
  await deletePageByName(page, '$ Dropdown Form Page');
  await deleteform(page, '$ Simple Dropdown Form');
  await takeScreenshot(page);

});







// Create and submit a simple payment form with payment dropdown layout (USD)
test('Simple form with dropdown layout with USD', async ({ page }) => {
  test.setTimeout(200000);

  // Login
  await loginToWordPress(page);

  // Create Form (Dropdown layout) with USD currency (no symbol selection step)
  const shortcode = await createFormDropdown(page, {
    currency: 'usd',
    title: 'USD Simple Dropdown Form',
    description: 'New form here with layout Dropdown',
  });
  expect(shortcode).toBeTruthy();

  // Add Page with shortcode
  await addpage(page, shortcode, 'USD Dropdown Form Page');

  // Submit form (Dropdown flow) and pay with USD
  const submittedAmount2 = await submitFormDropdown(page, { currency: 'usd' });

  // Verify success
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  // Cleanup (delete the created page and form)
  await deletePageByName(page, 'USD Dropdown Form Page');
  await deleteform(page, 'USD Simple Dropdown Form');
  await takeScreenshot(page);

});






// Create and submit a simple payment form with payment dropdown layout (No code/symbol)
test('Simple form with dropdown layout with No code/symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login
  await loginToWordPress(page);

  // Create Form (Dropdown layout) with no code/symbol
  const shortcode = await createFormDropdown(page, {
    currency: 'none',
    title: 'No Symbol Simple Dropdown Form',
    description: 'New form here with layout Dropdown',
  });
  expect(shortcode).toBeTruthy();

  // Add Page with shortcode
  await addpage(page, shortcode, 'No Code/Symbol Dropdown Form Page');

  // Submit form (Dropdown flow) expecting generic Pay button
  const submittedAmount3 = await submitFormDropdown(page, { currency: 'none' });

  // Verify success
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  // Cleanup (delete the created page and form)
  await deletePageByName(page, 'No Code/Symbol Dropdown Form Page');
  await deleteform(page, 'No Symbol Simple Dropdown Form');
  await takeScreenshot(page);

});
