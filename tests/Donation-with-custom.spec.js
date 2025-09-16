import { test, expect } from '@playwright/test';
import { 
  loginToWordPress, 
  createformCustom,
  addpage,
  CustomFormSubmit,
  DonationcreateformCustom,
  submitFormCustomPopupMultistep,
  verifyPaymentSuccess,
  submitDonationFormCustom,
  deletepage,
  deleteform,
  checkSquareTransaction,
  takeScreenshot,
  deletePageByName,
} from './utils/formUtils.js';






//Create and submit a Donation payment form with payment custom layout //
// $ Currency symbol//
test('$ Symbol Currency', async ({ page }) => {
  test.setTimeout(200000);


    // Login WP using utility function
  await loginToWordPress(page);

    // Create Form using existing utility function
  const shortcode = await DonationcreateformCustom(page, { currency: 'dollar' });



  // Add Page using utility function
  await addpage(page, shortcode, '$ Donation Custom Page');


  // Form Submit using utility function
  const submittedAmount1 = await submitDonationFormCustom(page, { currency: 'dollar' });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);


  // Delete Page using utility function
  await deletePageByName(page, '$ Donation Custom Page');

  // Delete Form using utility function
  await deleteform(page, 'Donation Payment Form');

  await takeScreenshot(page);

});









// Create and submit a Donation form (custom layout) with Coupon enabled and Redirection Yes
test('Donation with Coupon + Redirection ($)', async ({ page }) => {
  test.setTimeout(200000);

  // Login
  await loginToWordPress(page);

  // Create Form with coupon and redirection enabled
  const shortcode = await DonationcreateformCustom(page, {
    currency: 'dollar',
    enableCoupon: true,
    enableRedirection: true,
    title: 'Donation with coupon',
    description: 'This is the donation Form with coupon and redirect after submit',
    organizationName: 'Objects',
    goalAmount: '50000',
    goalMessage: 'Your Goal Achieved.',
    closeOnGoal: true,
    amount1: '5000',
    amount2: '10000',
    amount3: '15000',
    amount4: '20000',
    minAmount: '10000',
    maxAmount: '50000',
    redirectUrl: 'www.google.com',
    redirectDelay: '8',
    redirectLabel: 'Payment Successful',
  });

  // Add Page
  await addpage(page, shortcode, 'Donation with coupon page');
 

  // Submit Form with coupon + redirection params
  const submittedAmount = await submitDonationFormCustom(page, {
    currency: 'dollar',
    otherAmount: '45000',
    couponCode: 'Suf123',
    saveCard: true,
  });

  // Verify success on-site
  await verifyPaymentSuccess(page);

    // Click redirect link after verification
  await page.getByRole('link', { name: 'Payment Successful' }).click();


  // Verify on Square
  await checkSquareTransaction(page, submittedAmount);



  // Cleanup
  await deletePageByName(page, 'Donation with coupon page');
  await deleteform(page, 'Donation Payment Form');
  await takeScreenshot(page);
});








//Create and submit a Donation payment form with payment custom layout //
// USD Currency symbol//
test('USD Currency Symbol', async ({ page }) => {
  test.setTimeout(200000);


    // Login WP using utility function
  await loginToWordPress(page);

    // Create Form using existing utility function
  const shortcode = await DonationcreateformCustom(page, { currency: 'usd' });



  // Add Page using utility function
  await addpage(page, shortcode, 'USD Donation Custom Page');


  // Form Submit using utility function
  const submittedAmount2 = await submitDonationFormCustom(page, { currency: 'usd' });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  
  // Delete Page using utility function
  await deletePageByName(page, 'USD Donation Custom Page');

  // Delete Form using utility function
  await deleteform(page, 'Donation Payment Form');

  await takeScreenshot(page);

});







//Create and submit a Donation payment form with payment custom layout //
// No code symbol//
test('No Code Symbol', async ({ page }) => {
  test.setTimeout(200000);


    // Login WP using utility function
  await loginToWordPress(page);

    // Create Form using existing utility function
  const shortcode = await DonationcreateformCustom(page, { currency: 'none' });



  // Add Page using utility function
    await addpage(page, shortcode, 'No Symbol Donation Custom Page');


  // Form Submit using utility function
  const submittedAmount3 = await submitDonationFormCustom(page, { currency: 'none' });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  
  // Delete Page using utility function
  await deletePageByName(page, 'No Symbol Donation Custom Page');

  // Delete Form using utility function
  await deleteform(page, 'Donation Payment Form');

  await takeScreenshot(page);

});