import { test, expect } from '@playwright/test';
import {
  loginToWordPress,
  addpage,
  verifyPaymentSuccess,
  deletepage,
  deleteform,
  DonationcreateformCustom,
  submitDonationFormCustom,
  checkSquareTransaction,
} from './utils/formUtils.js';

// Test donation form with Square verification
test('Donation with Square verification', async ({ page }) => {
  test.setTimeout(120000); // Increased timeout for Square verification

  // Login to WordPress
  await loginToWordPress(page);

  // Create donation form
  const shortcode = await DonationcreateformCustom(page, { currency: 'dollar' });
  expect(shortcode).toBeTruthy();

  // Add page with shortcode
  await addpage(page, shortcode);

  // Submit form and verify with Square
  const result = await submitDonationFormCustom(page, { 
    currency: 'dollar', 
    verifyWithSquare: true 
  });

  // Verify payment success
  await verifyPaymentSuccess(page);

  // Check Square verification result
  if (result.match) {
    console.log('✅ Square verification passed!');
    expect(result.match).toBe(true);
  } else {
    console.log('❌ Square verification failed!');
    console.log(`Expected: ${result.expectedAmount}, Square: ${result.squareAmount}`);
  }

  // Cleanup
  await deletepage(page);
  await deleteform(page, 'Donation Payment Form');
});

// Test with manual Square check
test('Donation with manual Square check', async ({ page }) => {
  test.setTimeout(120000);

  await loginToWordPress(page);
  const shortcode = await DonationcreateformCustom(page, { currency: 'dollar' });
  expect(shortcode).toBeTruthy();

  await addpage(page, shortcode);
  
  // Submit form without automatic verification
  await submitDonationFormCustom(page, { currency: 'dollar' });
  await verifyPaymentSuccess(page);

  // Manually check Square after a delay
  await page.waitForTimeout(5000);
  const squareResult = await checkSquareTransaction(page, '$15,000.00');
  
  console.log('Square verification result:', squareResult);
  
  await deletepage(page);
  await deleteform(page, 'Donation Payment Form');
});
