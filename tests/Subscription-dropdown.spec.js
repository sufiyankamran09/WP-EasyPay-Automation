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







// Create and submit a Subscription Payment form with dropdown layout ($)
test('Subscription Payment with Dropdown Layout - $ Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await Subscriptioncreateform(page, { 
    currency: 'dollar',
    layout: 'dropdown',
    title: 'Subscription Payment Dropdown',
    description: 'This is the subscription Payment Dropdown Form',
    enableCoupon: true,
    options: [
      { price: '1000', label: 'Mobile' },
      { price: '2000', label: 'Laptop' },
      { price: '3000', label: 'Bike' },
      { price: '4000', label: 'Car' }
    ]
  });

  // Add Page using utility function
  await addpage(page, shortcode, '$ Dropdown Subscription Page');

  // Form Submit using utility function
  const submittedAmount1 = await submitSubscriptionForm(page, { 
    currency: 'dollar',
    layout: 'dropdown',
    selectedOption: 'Mobile',
    secondOption: 'Bike',
    couponCode: 'Suf123'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);

  // Delete Page using utility function
  await deletePageByName(page, '$ Dropdown Subscription Page');

  // Delete Form using utility function
  await deleteform(page, 'Subscription Payment Dropdown');

  await takeScreenshot(page);
});








// Create and submit a Subscription Payment form with dropdown layout (USD)
test('Subscription Payment with Dropdown Layout - USD Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await Subscriptioncreateform(page, { 
    currency: 'usd',
    layout: 'dropdown',
    title: 'Subscription Payment Dropdown USD',
    description: 'This is the subscription Payment Dropdown Form USD',
    enableCoupon: true,
    options: [
      { price: '1000', label: 'Mobile' },
      { price: '2000', label: 'Laptop' },
      { price: '3000', label: 'Bike' },
      { price: '4000', label: 'Car' }
    ]
  });

  // Add Page using utility function
  await addpage(page, shortcode, 'USD Dropdown Subscription Page');

  // Form Submit using utility function
  const submittedAmount2 = await submitSubscriptionForm(page, { 
    currency: 'usd',
    layout: 'dropdown',
    selectedOption: 'Mobile',
    secondOption: 'Bike',
    couponCode: 'Suf123'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  // Delete Page using utility function
  await deletePageByName(page, 'USD Dropdown Subscription Page');

  // Delete Form using utility function
  await deleteform(page, 'Subscription Payment Dropdown');

  await takeScreenshot(page);
});







// Create and submit a Subscription Payment form with dropdown layout (No Symbol)
test('Subscription Payment with Dropdown Layout - No Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await Subscriptioncreateform(page, { 
    currency: 'none',
    layout: 'dropdown',
    title: 'Subscription Payment Dropdown No Symbol',
    description: 'This is the subscription Payment Dropdown Form No Symbol',
    enableCoupon: true,
    options: [
      { price: '1000', label: 'Mobile' },
      { price: '2000', label: 'Laptop' },
      { price: '3000', label: 'Bike' },
      { price: '4000', label: 'Car' }
    ]
  });

  // Add Page using utility function
  await addpage(page, shortcode, 'No Symbol Dropdown Subscription Page');

  // Form Submit using utility function
  const submittedAmount3 = await submitSubscriptionForm(page, { 
    currency: 'none',
    layout: 'dropdown',
    selectedOption: 'Mobile',
    secondOption: 'Bike',
    couponCode: 'Suf123'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  // Delete Page using utility function
    await deletePageByName(page, 'No Symbol Dropdown Subscription Page');

  // Delete Form using utility function 
  await deleteform(page, 'Subscription Payment Dropdown');

  await takeScreenshot(page);
});
