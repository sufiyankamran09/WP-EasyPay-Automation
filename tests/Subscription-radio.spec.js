import { test } from '@playwright/test';
import { 
  loginToWordPress, 
  addpage,
  verifyPaymentSuccess,
  deletepage,
  deleteform,
  Subscriptioncreateform,
  submitSubscriptionForm,
  checkSquareTransaction,
  takeScreenshot,
  deletePageByName,
} from './utils/formUtils.js';






// Create and submit a Subscription Payment form with radio layout ($)
test('Subscription Payment with Radio Layout - $ Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await Subscriptioncreateform(page, { 
    currency: 'dollar',
    layout: 'radio',
    title: '$ Subscription Radio Payment',
    description: 'This is the subscription Payment Radio Form',
    enableCoupon: true,
    options: [
      { price: '1000', label: 'Mobile' },
      { price: '2000', label: 'Laptop' },
      { price: '3000', label: 'Bike' },
      { price: '4000', label: 'Car' }
    ]
  });

  // Add Page using utility function
  await addpage(page, shortcode, '$ Subscription Radio Page');

  // Form Submit using utility function
  const submittedAmount1 = await submitSubscriptionForm(page, { 
    currency: 'dollar',
    layout: 'radio',
    selectedOption: '3000',
    couponCode: 'Suf123'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);

  // Delete Page using utility function
  await deletePageByName(page, '$ Subscription Radio Page');

  // Delete Form using utility function
  await deleteform(page, '$ Subscription Radio Payment');

  await takeScreenshot(page);
});







// Create and submit a Subscription Payment form with radio layout (USD)
test('Subscription Payment with Radio Layout - USD Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await Subscriptioncreateform(page, { 
    currency: 'usd',
    layout: 'radio',
    title: 'USD Subscription Radio Payment',
    description: 'This is the subscription Payment Radio Form USD',
    enableCoupon: true,
    options: [
      { price: '1000', label: 'Mobile' },
      { price: '2000', label: 'Laptop' },
      { price: '3000', label: 'Bike' },
      { price: '4000', label: 'Car' }
    ]
  });

  // Add Page using utility function
  await addpage(page, shortcode, 'USD Subscription Radio Page');

  // Form Submit using utility function
  const submittedAmount2 = await submitSubscriptionForm(page, { 
    currency: 'usd',
    layout: 'radio',
    selectedOption: '3000',
    couponCode: 'Suf123'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  // Delete Page using utility function
  await deletePageByName(page, 'USD Subscription Radio Page');

  // Delete Form using utility function
  await deleteform(page, 'USD Subscription Radio Payment');

  await takeScreenshot(page);
});







// Create and submit a Subscription Payment form with radio layout (No Symbol)
test('Subscription Payment with Radio Layout - No Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await Subscriptioncreateform(page, { 
    currency: 'none',
    layout: 'radio',
    title: 'No Symbol Subscription Radio Payment',
    description: 'This is the subscription Payment Radio Form No Symbol',
    enableCoupon: true,
    options: [
      { price: '1000', label: 'Mobile' },
      { price: '2000', label: 'Laptop' },
      { price: '3000', label: 'Bike' },
      { price: '4000', label: 'Car' }
    ]
  });

  // Add Page using utility function
  await addpage(page, shortcode, 'No Symbol Subscription Radio Page');

  // Form Submit using utility function
  const submittedAmount3 = await submitSubscriptionForm(page, { 
    currency: 'none',
    layout: 'radio',
    selectedOption: '3000',
    couponCode: 'Suf123'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  // Delete Page using utility function
  await deletePageByName(page, 'No Symbol Subscription Radio Page');

  // Delete Form using utility function
  await deleteform(page, 'No Symbol Subscription Radio Payment');

  await takeScreenshot(page);
});
