import { test, expect } from '@playwright/test';
import {
  loginToWordPress,
  createFormDropdown,
  addpage,
  submitFormDropdown,
  verifyPaymentSuccess,
  deletepage,
  deleteform,
} from './utils/formUtils.js';

// Create and submit a simple payment form with payment dropdown layout ($ Currency symbol)
test('Simple form with dropdown layout with $', async ({ page }) => {
  test.setTimeout(70000);

  // Login
  await loginToWordPress(page);

  // Create Form (Dropdown layout) with $ currency
  const shortcode = await createFormDropdown(page, {
    currency: 'dollar',
    title: 'New Form',
    description: 'New form here with layout Dropdown',
  });
  expect(shortcode).toBeTruthy();

  // Add Page with shortcode
  await addpage(page, shortcode);

  // Submit form (Dropdown flow) and pay with $
  await submitFormDropdown(page, { currency: 'dollar' });

  // Verify success
  await verifyPaymentSuccess(page);

  // Cleanup (delete the created page and form)
  await deletepage(page);
  await deleteform(page);
});

// Create and submit a simple payment form with payment dropdown layout (USD)
test('Simple form with dropdown layout with USD', async ({ page }) => {
  test.setTimeout(70000);

  // Login
  await loginToWordPress(page);

  // Create Form (Dropdown layout) with USD currency (no symbol selection step)
  const shortcode = await createFormDropdown(page, {
    currency: 'usd',
    title: 'New Form',
    description: 'New form here with layout Dropdown',
  });
  expect(shortcode).toBeTruthy();

  // Add Page with shortcode
  await addpage(page, shortcode);

  // Submit form (Dropdown flow) and pay with USD
  await submitFormDropdown(page, { currency: 'usd' });

  // Verify success
  await verifyPaymentSuccess(page);

  // Cleanup (delete the created page and form)
  await deletepage(page);
  await deleteform(page);
});

// Create and submit a simple payment form with payment dropdown layout (No code/symbol)
test('Simple form with dropdown layout with No code/symbol', async ({ page }) => {
  test.setTimeout(70000);

  // Login
  await loginToWordPress(page);

  // Create Form (Dropdown layout) with no code/symbol
  const shortcode = await createFormDropdown(page, {
    currency: 'none',
    title: 'New Form',
    description: 'New form here with layout Dropdown',
  });
  expect(shortcode).toBeTruthy();

  // Add Page with shortcode
  await addpage(page, shortcode);

  // Submit form (Dropdown flow) expecting generic Pay button
  await submitFormDropdown(page, { currency: 'none' });

  // Verify success
  await verifyPaymentSuccess(page);

  // Cleanup (delete the created page and form)
  await deletepage(page);
  await deleteform(page);
});
