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
  deletePageByName,

} from './utils/formUtils.js';


// Create and submit a Donation form with Tabular layout ($)
test('Donation with tabular layout with $', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);
  const shortcode = await DonationcreateformTabular(page, { currency: 'dollar' });
  expect(shortcode).toBeTruthy();

  await addpage(page, shortcode, '$ Tabular Form Page');
  const submittedAmount1 = await submitDonationFormTabular(page, { currency: 'dollar' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);

  await deletePageByName(page, '$ Tabular Form Page');
  await deleteform(page, 'Donation Payment Form');
  await takeScreenshot(page);
});



// Create and submit a Donation form with Tabular layout (USD)
test('Donation with tabular layout with USD', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);
  const shortcode = await DonationcreateformTabular(page, { currency: 'usd' });
  expect(shortcode).toBeTruthy();

  await addpage(page, shortcode, 'USD Tabular Form Page');
  const submittedAmount2 = await submitDonationFormTabular(page, { currency: 'usd' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  await deletePageByName(page, 'USD Tabular Form Page');
  await deleteform(page, 'Donation Payment Form');
  await takeScreenshot(page);
});




// Create and submit a Donation form with Tabular layout (No code/symbol)
test('Donation with tabular layout with No Code/Symbol', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);
  const shortcode = await DonationcreateformTabular(page, { currency: 'none' });
  expect(shortcode).toBeTruthy();

  await addpage(page, shortcode, 'No Symbol Tabular Form Page');
  const submittedAmount3 = await submitDonationFormTabular(page, { currency: 'none' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  await deletePageByName(page, 'No Symbol Tabular Form Page');
  await deleteform(page, 'Donation Payment Form');
  await takeScreenshot(page);
});


