import { test } from '@playwright/test';
import { 
  loginToWordPress, 
  addpage,
  verifyPaymentSuccess,
  deletepage,
  deleteform,
  DonationcreateformRecurring,
  submitDonationFormRecurring,
  checkSquareTransaction,
  takeScreenshot,
  deletePageByName,
} from './utils/formUtils.js';





// Create and submit a Donation Recurring form with radio layout ($)
test('Donation Recurring with Radio Layout - $ Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await DonationcreateformRecurring(page, { 
    currency: 'dollar',
    layout: 'radio',
    title: 'Donation Recurring with Radio',
    description: 'This is the Donation Recurring with Payment Radio',
    subscriptionCycle: 'WEEKLY',
    subscriptionLength: '2',
    options: [
      { price: '1000', label: 'Mobile' },
      { price: '2000', label: 'Laptop' },
      { price: '3000', label: 'Bike' },
      { price: '4000', label: 'Car' }
    ]
  });

  // Add Page using utility function
  await addpage(page, shortcode, '$ Donation Recurring Radio Page');

    // Form Submit using utility function
  const submittedAmount1 = await submitDonationFormRecurring(page, { 
    currency: 'dollar',
    layout: 'radio',
    selectedOption: 'Bike'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);

  // Delete Page using utility function
  await deletePageByName(page, '$ Donation Recurring Radio Page');

  // Delete Form using utility function
  await deleteform(page, 'Donation Recurring with Radio');

  await takeScreenshot(page);
});









// Create and submit a Donation Recurring form with radio layout (USD)
test('Donation Recurring with Radio Layout - USD Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await DonationcreateformRecurring(page, { 
    currency: 'usd',
    layout: 'radio',
    title: 'Donation Recurring with Radio USD',
    description: 'This is the Donation Recurring with Payment Radio USD',
    subscriptionCycle: 'WEEKLY',
    subscriptionLength: '2',
    options: [
      { price: '1000', label: 'Mobile' },
      { price: '2000', label: 'Laptop' },
      { price: '3000', label: 'Bike' },
      { price: '4000', label: 'Car' }
    ]
  });

  // Add Page using utility function
  await addpage(page, shortcode, 'USD Donation Recurring Radio Page');

  // Form Submit using utility function
  const submittedAmount2 = await submitDonationFormRecurring(page, { 
    currency: 'usd',
    layout: 'radio',
    selectedOption: 'Car'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  // Delete Page using utility function
    await deletePageByName(page, 'USD Donation Recurring Radio Page');

  // Delete Form using utility function
  await deleteform(page, 'Donation Recurring with Radio USD');

  await takeScreenshot(page);
});








// Create and submit a Donation Recurring form with radio layout (No Symbol)
test('Donation Recurring with Radio Layout - No Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await DonationcreateformRecurring(page, { 
    currency: 'none',
    layout: 'radio',
    title: 'Donation Recurring with Radio No Symbol',
    description: 'This is the Donation Recurring with Payment Radio No Symbol',
    subscriptionCycle: 'WEEKLY',
    subscriptionLength: '2',
    options: [
      { price: '1000', label: 'Mobile' },
      { price: '2000', label: 'Laptop' },
      { price: '3000', label: 'Bike' },
      { price: '4000', label: 'Car' }
    ]
  });

  // Add Page using utility function
  await addpage(page, shortcode, 'No Symbol Donation Recurring Radio Page');

  // Form Submit using utility function 
  const submittedAmount3 = await submitDonationFormRecurring(page, { 
    currency: 'none',
    layout: 'radio',
    selectedOption: 'Laptop'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  // Delete Page using utility function
  await deletePageByName(page, 'No Symbol Donation Recurring Radio Page');

  // Delete Form using utility function
  await deleteform(page, 'Donation Recurring with Radio No Symbol');

  await takeScreenshot(page);
});
