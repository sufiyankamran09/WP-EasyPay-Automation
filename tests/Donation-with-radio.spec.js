import { test, expect } from '@playwright/test';
import {
  loginToWordPress,
  addpage,
  verifyPaymentSuccess,
  deletepage,
  deleteform,
  DonationcreateformRadio,
  submitDonationFormRadio,
  checkSquareTransaction,
} from './utils/formUtils.js';

// Create and submit a Donation form with Radio layout ($)
test('Donation with radio layout with $', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);
  const shortcode = await DonationcreateformRadio(page, { currency: 'dollar' });
  expect(shortcode).toBeTruthy();
  
  await addpage(page, shortcode);
  const submittedAmount1 = await submitDonationFormRadio(page, { currency: 'dollar' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);

  await deletepage(page);
  await deleteform(page);
});

// Create and submit a Donation form with Radio layout (USD)
test('Donation with radio layout with USD', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);
  const shortcode = await DonationcreateformRadio(page, { currency: 'usd' });
  expect(shortcode).toBeTruthy();

  await addpage(page, shortcode);
  const submittedAmount2 = await submitDonationFormRadio(page, { currency: 'usd' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  await deletepage(page);
  await deleteform(page);
});

// Create and submit a Donation form with Radio layout (No code/symbol)
test('Donation with radio layout with No Code/Symbol', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);
  const shortcode = await DonationcreateformRadio(page, { currency: 'none' });
  expect(shortcode).toBeTruthy();

  await addpage(page, shortcode);
  const submittedAmount3 = await submitDonationFormRadio(page, { currency: 'none' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  await deletepage(page);
  await deleteform(page);
});


