import { test, expect } from '@playwright/test';
import {
  loginToWordPress,
  addpage,
  verifyPaymentSuccess,
  deletepage,
  deleteform,
  DonationcreateformTabular,
  submitDonationFormTabular,
  checkSquareTransaction,
  takeScreenshot,
} from './utils/formUtils.js';


// Create and submit a Donation form with Tabular layout ($)
test('Donation with tabular layout with $', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);
  const shortcode = await DonationcreateformTabular(page, { currency: 'dollar' });
  expect(shortcode).toBeTruthy();

  await addpage(page, shortcode);
  const submittedAmount1 = await submitDonationFormTabular(page, { currency: 'dollar' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);

  await deletepage(page);
  await deleteform(page);
  await takeScreenshot(page);
});



// Create and submit a Donation form with Tabular layout (USD)
test('Donation with tabular layout with USD', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);
  const shortcode = await DonationcreateformTabular(page, { currency: 'usd' });
  expect(shortcode).toBeTruthy();

  await addpage(page, shortcode);
  const submittedAmount2 = await submitDonationFormTabular(page, { currency: 'usd' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  await deletepage(page);
  await deleteform(page);
  await takeScreenshot(page);
});




// Create and submit a Donation form with Tabular layout (No code/symbol)
test('Donation with tabular layout with No Code/Symbol', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);
  const shortcode = await DonationcreateformTabular(page, { currency: 'none' });
  expect(shortcode).toBeTruthy();

  await addpage(page, shortcode);
  const submittedAmount3 = await submitDonationFormTabular(page, { currency: 'none' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  await deletepage(page);
  await deleteform(page);
  await takeScreenshot(page);
});


