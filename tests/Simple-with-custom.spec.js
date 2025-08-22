import { test, expect } from '@playwright/test';
import { 
  loginToWordPress, 
  createformCustom,
  addpage,
  CustomFormSubmit,
  submitFormCustomPopupMultistep,
  verifyPaymentSuccess,
  deletepage,
  deleteform
} from './utils/formUtils.js';

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
  test.setTimeout(70000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await createformCustom(page, { currency: 'dollar' });

  // Add Page using utility function
  await addpage(page, shortcode);

  // Form Submit using utility function
  await CustomFormSubmit(page, { currency: 'dollar' });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);

  // Delete Page using utility function
  await deletepage(page);

  // Delete Form using utility function
  await deleteform(page);
});


//Create and submit a simple payment form with payment custom layout //
// USD currency symbol flow 
test('USD Symbol Currency', async ({ page }) => {
  test.setTimeout(70000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form (USD flow skips selecting $ radio)
  const shortcode = await createformCustom(page, { currency: 'usd' });

  // Add Page with shortcode
  await addpage(page, shortcode);

  // Submit form expecting USD indicators
  await CustomFormSubmit(page, { currency: 'usd' });

  // Verify success
  await verifyPaymentSuccess(page);

  // Cleanup
  await deletepage(page);
  await deleteform(page);
});


//Create and submit a simple payment form with payment custom layout //
// No code/symbol flow 
test('No Code/Symbol Currency', async ({ page }) => {
  test.setTimeout(70000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form (select No code/Symbol)
  const shortcode = await createformCustom(page, { currency: 'none' });

  // Add Page with shortcode
  await addpage(page, shortcode);

  // Submit form expecting no currency indicator
  await CustomFormSubmit(page, { currency: 'none' });

  // Verify success
  await verifyPaymentSuccess(page);

  // Cleanup
  await deletepage(page);
  await deleteform(page);
});


//Create and submit a simple payment form with payment custom layout //
// Custom layout with popup + multistep (Currency $)
test('$ Symbol Currency with Popup', async ({ page }) => {
  test.setTimeout(70000);

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
  await addpage(page, shortcode);

  // Submit via popup + multistep
  await submitFormCustomPopupMultistep(page, {
    currency: 'dollar',
    popupButtonText: 'Open the Simple form'
  });

  // Verify success
  await verifyPaymentSuccess(page);

  // Cleanup
  await deletepage(page);
  await deleteform(page);
});




