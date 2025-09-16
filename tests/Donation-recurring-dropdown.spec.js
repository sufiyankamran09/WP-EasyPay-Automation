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




// Create and submit a Donation Recurring form with dropdown layout ($)
test('Donation Recurring with Dropdown Layout - $ Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await DonationcreateformRecurring(page, { 
    currency: 'dollar',
    layout: 'dropdown',
    title: 'Donation Recurring with Dropdown',
    description: 'This is the Donation Recurring with Payment Dropdown',
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
  await addpage(page, shortcode, '$ Donation Recurring Dropdown Page');

  // Form Submit using utility function
  const submittedAmount1 = await submitDonationFormRecurring(page, { 
    currency: 'dollar',
    layout: 'dropdown',
    selectedOption: 'Mobile',
    secondOption: 'Bike'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);

  // Delete Page using utility function
  await deletePageByName(page, '$ Donation Recurring Dropdown Page');

  // Delete Form using utility function
  await deleteform(page, 'Donation Recurring with Dropdown');

  await takeScreenshot(page);
});







// Create and submit a Donation Recurring form with dropdown layout (USD)
test('Donation Recurring with Dropdown Layout - USD Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await DonationcreateformRecurring(page, { 
    currency: 'usd',
    layout: 'dropdown',
    title: 'Donation Recurring with Dropdown USD',
    description: 'This is the Donation Recurring with Payment Dropdown USD',
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
  await addpage(page, shortcode, 'USD Donation Recurring Dropdown Page');

  // Form Submit using utility function
  const submittedAmount2 = await submitDonationFormRecurring(page, { 
    currency: 'usd',
    layout: 'dropdown',
    selectedOption: 'Mobile',
    secondOption: 'Bike'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  // Delete Page using utility function
  await deletePageByName(page, 'USD Donation Recurring Dropdown Page');

  // Delete Form using utility function
  await deleteform(page, 'Donation Recurring with Dropdown USD');

  await takeScreenshot(page);
});







// Create and submit a Donation Recurring form with dropdown layout (No Symbol)
test('Donation Recurring with Dropdown Layout - No Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await DonationcreateformRecurring(page, { 
    currency: 'none',
    layout: 'dropdown',
    title: 'Donation Recurring with Dropdown No Symbol',
    description: 'This is the Donation Recurring with Payment Dropdown No Symbol',
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
  await addpage(page, shortcode, 'No Symbol Donation Recurring Dropdown Page');

  // Form Submit using utility function
  const submittedAmount3 = await submitDonationFormRecurring(page, { 
    currency: 'none',
    layout: 'dropdown',
    selectedOption: 'Mobile',
    secondOption: 'Bike'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  // Delete Page using utility function
  await deletePageByName(page, 'No Symbol Donation Recurring Dropdown Page');

  // Delete Form using utility function
  await deleteform(page, 'Donation Recurring with Dropdown No Symbol');

  await takeScreenshot(page);
});
