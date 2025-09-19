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





// Create and submit a Subscription Payment form with custom layout ($)
test('Subscription Payment with Custom Layout - $ Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await Subscriptioncreateform(page, { 
    currency: 'dollar',
    layout: 'custom',
    title: '$ Subscription Custom Payment',
    description: 'This is the subscription Payment Form',
    enableCoupon: true,
    amount1: '1000',
    amount2: '2000',
    amount3: '3000',
    amount4: '4000',
    minAmount: '1000',
    maxAmount: '50000'
  });

  // Add Page using utility function
  await addpage(page, shortcode, '$ Subscription Custom Page');

  // Form Submit using utility function
  const submittedAmount1 = await submitSubscriptionForm(page, { 
    currency: 'dollar',
    layout: 'custom',
    otherAmount: '9500',
    couponCode: 'Suf123'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);

  // Delete Page using utility function
  await deletePageByName(page, '$ Subscription Custom Page');

  // Delete Form using utility function
  await deleteform(page, '$ Subscription Custom Payment');

  await takeScreenshot(page);
});







// Create and submit a Subscription Payment form with custom layout (USD)
test('Subscription Payment with Custom Layout - USD Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await Subscriptioncreateform(page, { 
    currency: 'usd',
    layout: 'custom',
    title: 'USD Subscription Custom Payment',
    description: 'This is the subscription Payment Form USD',
    enableCoupon: true,
    amount1: '1000',
    amount2: '2000',
    amount3: '3000',
    amount4: '4000',
    minAmount: '1000',
    maxAmount: '50000'
  });

  // Add Page using utility function
  await addpage(page, shortcode, 'USD Subscription Custom Page');

  // Form Submit using utility function
  const submittedAmount2 = await submitSubscriptionForm(page, { 
    currency: 'usd',
    layout: 'custom',
    otherAmount: '9500',
    couponCode: 'Suf123'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  // Delete Page using utility function
  await deletePageByName(page, 'USD Subscription Custom Page');

  // Delete Form using utility function
  await deleteform(page, 'USD Subscription Custom Payment');

  await takeScreenshot(page);
});









// Create and submit a Subscription Payment form with custom layout (No Symbol)
test('Subscription Payment with Custom Layout - No Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await Subscriptioncreateform(page, { 
    currency: 'none',
    layout: 'custom',
    title: 'No Symbol Subscription Custom Payment',
    description: 'This is the subscription Payment Form No Symbol',
    enableCoupon: true,
    amount1: '1000',
    amount2: '2000',
    amount3: '3000',
    amount4: '4000',
    minAmount: '1000',
    maxAmount: '50000'
  });

  // Add Page using utility function
  await addpage(page, shortcode, 'No Symbol Subscription Custom Page');

  // Form Submit using utility function
  const submittedAmount3 = await submitSubscriptionForm(page, { 
    currency: 'none',
    layout: 'custom',
    otherAmount: '9500',
    couponCode: 'Suf123'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  // Delete Page using utility function
  await deletePageByName(page, 'No Symbol Subscription Custom Page');

  // Delete Form using utility function
  await deleteform(page, 'No Symbol Subscription Custom Payment');

  await takeScreenshot(page);
});
