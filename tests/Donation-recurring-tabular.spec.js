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






// Create and submit a Donation Recurring form with tabular layout ($)
test('Donation Recurring with Tabular Layout - $ Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await DonationcreateformRecurring(page, { 
    currency: 'dollar',
    layout: 'tabular',
    title: '$ Donation Recurring with Tabular',
    description: 'This is the Donation Recurring with Payment Tabular',
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
  await addpage(page, shortcode, '$ Donation Recurring Tabular Page');

  // Form Submit using utility function
  const submittedAmount1 = await submitDonationFormRecurring(page, { 
    currency: 'dollar',
    layout: 'tabular'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);

  // Delete Page using utility function
  await deletePageByName(page, '$ Donation Recurring Tabular Page');

  // Delete Form using utility function
  await deleteform(page, '$ Donation Recurring with Tabular');

  await takeScreenshot(page);
});









// Create and submit a Donation Recurring form with tabular layout (USD)
test('Donation Recurring with Tabular Layout - USD Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await DonationcreateformRecurring(page, { 
    currency: 'usd',
    layout: 'tabular',
    title: 'USD Donation Recurring with Tabular',
    description: 'This is the Donation Recurring with Payment Tabular USD',
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
  await addpage(page, shortcode, 'USD Donation Recurring Tabular Page');

  // Form Submit using utility function
  const submittedAmount2 = await submitDonationFormRecurring(page, { 
    currency: 'usd',
    layout: 'tabular'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  // Delete Page using utility function
  await deletePageByName(page, 'USD Donation Recurring Tabular Page');

  // Delete Form using utility function
  await deleteform(page, 'USD Donation Recurring with Tabular');

  await takeScreenshot(page);
});












// Create and submit a Donation Recurring form with tabular layout (No Symbol)
test('Donation Recurring with Tabular Layout - No Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await DonationcreateformRecurring(page, { 
    currency: 'none',
    layout: 'tabular',
    title: 'No Symbol Donation Recurring with Tabular',
    description: 'This is the Donation Recurring with Payment Tabular No Symbol',
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
  await addpage(page, shortcode, 'No Symbol Donation Recurring Tabular Page');

  // Form Submit using utility function
  const submittedAmount3 = await submitDonationFormRecurring(page, { 
    currency: 'none',
    layout: 'tabular'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  // Delete Page using utility function
  await deletePageByName(page, 'No Symbol Donation Recurring Tabular Page');

  // Delete Form using utility function
  await deleteform(page, 'No Symbol Donation Recurring with Tabular');

  await takeScreenshot(page);
});
