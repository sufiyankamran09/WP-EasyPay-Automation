import { test, expect } from '@playwright/test';
import {
  loginToWordPress,
  addpage,
  verifyPaymentSuccess,
  deletepage,
  deleteform,
  DonationcreateformDropdown,
  submitDonationFormDropdown,
  checkSquareTransaction,
  takeScreenshot,
  deletePageByName,
} from './utils/formUtils.js';





// Create and submit a Donation form with Dropdown layout ($)
test('Donation with dropdown layout with $', async ({ page }) => {
  test.setTimeout(90000);

  await loginToWordPress(page);
  const shortcode = await DonationcreateformDropdown(page, { currency: 'dollar' });
  expect(shortcode).toBeTruthy();

  await addpage(page, shortcode, '$ Dropdown Form Page');
  const submittedAmount1 = await submitDonationFormDropdown(page, { currency: 'dollar' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);

  await deletePageByName(page, '$ Dropdown Form Page');
  await deleteform(page, 'Donation Payment Form');

  await takeScreenshot(page);

});






// Create and submit a Donation form with Dropdown layout (USD)
test('Donation with dropdown layout with USD', async ({ page }) => {
  test.setTimeout(90000);

  await loginToWordPress(page);
  const shortcode = await DonationcreateformDropdown(page, { currency: 'usd' });
  expect(shortcode).toBeTruthy();

  await addpage(page, shortcode, 'USD Dropdown Form Page');
  const submittedAmount2 = await submitDonationFormDropdown(page, { currency: 'usd' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  await deletePageByName(page, 'USD Dropdown Form Page');
  await deleteform(page, 'Donation Payment Form');

  await takeScreenshot(page);

});







// Create and submit a Donation form with Dropdown layout (No code/symbol)
test('Donation with dropdown layout with No Code/Symbol', async ({ page }) => {
  test.setTimeout(90000);

  await loginToWordPress(page);
  const shortcode = await DonationcreateformDropdown(page, { currency: 'none' });
  expect(shortcode).toBeTruthy();

  await addpage(page, shortcode, 'No Symbol Dropdown Form Page');
  const submittedAmount3 = await submitDonationFormDropdown(page, { currency: 'none' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  await deletePageByName(page, 'No Symbol Dropdown Form Page');
  await deleteform(page, 'Donation Payment Form');
  await takeScreenshot(page);

});


