import { test, expect } from '@playwright/test';
import {
  loginToWordPress,
  createFormRadio,
  addpage,
  submitFormRadio,
  verifyPaymentSuccess,
  deletepage,
  deleteform,
} from './utils/formUtils.js';


// Create and submit a simple payment form with payment Radio layout ($)
test('Simple form with radio layout with $', async ({ page }) => {
  test.setTimeout(70000);

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
  await addpage(page, shortcode);

  // Submit form (Radio flow) and pay with $
  await submitFormRadio(page, { currency: 'dollar' });

  // Verify success
  await verifyPaymentSuccess(page);

  // Cleanup (delete the created page and form)
  await deletepage(page);
  await deleteform(page);
});


// Create and submit a simple payment form with payment Radio layout (USD)
test('Simple form with radio layout with USD', async ({ page }) => {
  test.setTimeout(70000);

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
  await addpage(page, shortcode);

  // Submit form (Radio flow) and pay with USD
  await submitFormRadio(page, { currency: 'usd' });

  // Verify success
  await verifyPaymentSuccess(page);

  // Cleanup (delete the created page and form)
  await deletepage(page);
  await deleteform(page);
});



// Create and submit a simple payment form with payment Radio layout (No code/symbol)
test('Simple form with radio layout with No code/symbol', async ({ page }) => {
  test.setTimeout(70000);

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
  await addpage(page, shortcode);

  // Submit form (Radio flow) expecting generic Pay button
  await submitFormRadio(page, { currency: 'none' });

  // Verify success
  await verifyPaymentSuccess(page);

  // Cleanup (delete the created page and form)
  await deletepage(page);
  await deleteform(page);
});


