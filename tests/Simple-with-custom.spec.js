import { test, expect } from '@playwright/test';
import { 
  loginToWordPress, 
  createformCustom,
  addpage,
  CustomFormSubmit,
  submitFormCustomPopupMultistep,
  verifyPaymentSuccess,
  deletepage,
  deleteform,
  checkSquareTransaction,
  takeScreenshot,
  deletePageByName,
} from './utils/formUtils.js';

//   Form creation  // 
test('WordPress Form Creation Test', async ({ page }) => {
  test.setTimeout(60000);
  
  // Login to WordPress using utility function
  await loginToWordPress(page);
  
  // Create form using utility function
  const shortcode = await createformCustom(page);
  
  // Verify shortcode was generated
  expect(shortcode).toBeTruthy();
  console.log("Generated shortcode:", shortcode);
});






//Create and submit a simple payment form with payment custom layout //
// $ Currency symbol//
test('$ Symbol Currency', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

   // Create Form using existing utility function
  const shortcode = await createformCustom(page, { currency: 'dollar' });

   // Add Page using utility function
  await addpage(page, shortcode, '$ Custom Page');

   // Form Submit using utility function
  const submittedAmount1 = await CustomFormSubmit(page, { currency: 'dollar' });

  // Verify payment success using utility function
   await verifyPaymentSuccess(page);
   await checkSquareTransaction(page,submittedAmount1);

   // Delete Page using utility function  
   await deletePageByName(page, '$ Custom Page');

   // Delete Form using utility function
   await deleteform(page, 'Simple Form');
   await takeScreenshot(page);

});






//Create and submit a simple payment form with payment custom layout //
// USD currency symbol flow 
test('USD Symbol Currency', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form (USD flow skips selecting $ radio)
  const shortcode = await createformCustom(page, { currency: 'usd' });

  // Add Page with shortcode
  await addpage(page, shortcode, 'USD Custom Page');

  // Submit form expecting USD indicators
  const submittedAmount2 = await CustomFormSubmit(page, { currency: 'usd' });

  // Verify success
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  // Cleanup
  await deletePageByName(page, 'USD Custom Page');
  await deleteform(page, 'Simple Form');

  await takeScreenshot(page);

});







//Create and submit a simple payment form with payment custom layout //
// No code/symbol flow 
test('No Code/Symbol Currency', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form (select No code/Symbol)
  const shortcode = await createformCustom(page, { currency: 'none' });

  // Add Page with shortcode
  await addpage(page, shortcode, 'No Code/Symbol Custom Page');

  // Submit form expecting no currency indicator
  const submittedAmount3 = await CustomFormSubmit(page, { currency: 'none' });

  // Verify success
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  // Cleanup
  await deletePageByName(page, 'No Code/Symbol Custom Page');
  await deleteform(page, 'Simple Form');
  await takeScreenshot(page);

});








//Create and submit a simple payment form with payment custom layout //
// Custom layout with popup + multistep (Currency $)
test('$ Symbol Currency with Popup', async ({ page }) => {
  test.setTimeout(200000);

  // Login
  await loginToWordPress(page);

  // Create custom form with popup + multistep
  const shortcode = await createformCustom(page, {
    currency: 'dollar',
    openInPopup: true,
    showMultistep: true,
    popupButtonTitle: 'Open the Simple form'
  });

  // Add page with shortcode
  await addpage(page, shortcode, '$ Symbol Currency with Popup Custom Page');

  // Submit via popup + multistep
  const submittedAmount4 = await submitFormCustomPopupMultistep(page, {
    currency: 'dollar',
    popupButtonText: 'Open the Simple form'
  });

  // Verify success
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount4);

  // Cleanup
  await deletePageByName(page, '$ Symbol Currency with Popup Custom Page');
  await deleteform(page, 'Simple Form');
  await takeScreenshot(page);

});




