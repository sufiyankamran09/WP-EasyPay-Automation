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






// Create and submit a Subscription Payment form with tabular layout ($)
test('Subscription Payment with Tabular Layout - $ Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await Subscriptioncreateform(page, { 
    currency: 'dollar',
    layout: 'tabular',
    title: '$ Subscription Payment Tabular',
    description: 'This is the subscription Payment Tabular Form',
    enableCoupon: true,
    options: [
      { price: '1000', label: 'Mobile' },
      { price: '2000', label: 'Laptop' },
      { price: '3000', label: 'Bike' },
      { price: '4000', label: 'Car' }
    ]
  });

  // Add Page using utility function
  await addpage(page, shortcode, '$ Subscription Tabular Page');

  // Form Submit using utility function
  const submittedAmount1 = await submitSubscriptionForm(page, { 
    currency: 'dollar',
    layout: 'tabular',
    couponCode: 'Suf123'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);

  // Delete Page using utility function
  await deletePageByName(page, '$ Subscription Tabular Page');

  // Delete Form using utility function
  await deleteform(page, '$ Subscription Payment Tabular');

  await takeScreenshot(page);
});









// Create and submit a Subscription Payment form with tabular layout (USD)
test('Subscription Payment with Tabular Layout - USD Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await Subscriptioncreateform(page, { 
    currency: 'usd',
    layout: 'tabular',
    title: 'USD Subscription Payment Tabular',
    description: 'This is the subscription Payment Tabular Form USD',
    enableCoupon: true,
    options: [
      { price: '1000', label: 'Mobile' },
      { price: '2000', label: 'Laptop' },
      { price: '3000', label: 'Bike' },
      { price: '4000', label: 'Car' }
    ]
  });

  // Add Page using utility function
  await addpage(page, shortcode, 'USD Subscription Tabular Page');

  // Form Submit using utility function
  const submittedAmount2 = await submitSubscriptionForm(page, { 
    currency: 'usd',
    layout: 'tabular',
    couponCode: 'Suf123'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  // Delete Page using utility function
  await deletePageByName(page, 'USD Subscription Tabular Page');


  // Delete Form using utility function
  await deleteform(page, 'USD Subscription Payment Tabular');

  await takeScreenshot(page);
});









// Create and submit a Subscription Payment form with tabular layout (No Symbol)
test('Subscription Payment with Tabular Layout - No Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await Subscriptioncreateform(page, { 
    currency: 'none',
    layout: 'tabular',
    title: 'No Symbol Subscription Payment Tabular',
    description: 'This is the subscription Payment Tabular Form No Symbol',
    enableCoupon: true,
    options: [
      { price: '1000', label: 'Mobile' },
      { price: '2000', label: 'Laptop' },
      { price: '3000', label: 'Bike' },
      { price: '4000', label: 'Car' }
    ]
  });

  // Add Page using utility function
  await addpage(page, shortcode, 'No Symbol Subscription Tabular Page');

  // Form Submit using utility function
  const submittedAmount3 = await submitSubscriptionForm(page, { 
    currency: 'none',
    layout: 'tabular',
    couponCode: 'Suf123'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);

  await checkSquareTransaction(page, submittedAmount3);

  // Delete Page using utility function
  await deletePageByName(page, 'No Symbol Subscription Tabular Page');

  // Delete Form using utility function
  await deleteform(page, 'No Symbol Subscription Payment Tabular');

  await takeScreenshot(page);
});
