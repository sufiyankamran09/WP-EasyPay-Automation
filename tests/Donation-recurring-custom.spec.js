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







// Create and submit a Donation Recurring form with custom payment layout ($)
test('Donation Recurring with Custom Layout - $ Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);
  
  // Create Form using existing utility function
  const shortcode = await DonationcreateformRecurring(page, { 
    currency: 'dollar',
    layout: 'custom',
    title: '$ Donation Recurring with Custom',
    description: 'This is the Donation Recurring Form',
    amount1: '1000',
    amount2: '2000',
    amount3: '3000',
    amount4: '4000',
    minAmount: '10000',
    maxAmount: '100000'
  });


  // Add Page using utility function
  await addpage(page, shortcode, '$ Donation Recurring Custom Page');


  // Form Submit using utility function
  const submittedAmount1 = await submitDonationFormRecurring(page, { 
    currency: 'dollar',
    layout: 'custom',
    otherAmount: '50000'
  });


  // Verify payment success using utility function  
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount1);


  // Delete Page using utility function
  await deletePageByName(page, '$ Donation Recurring Custom Page');

  // Delete Form using utility function
  await deleteform(page, '$ Donation Recurring with Custom');

  await takeScreenshot(page);
});







// Create and submit a Donation Recurring form with custom payment layout (USD)
test('Donation Recurring with Custom Layout - USD Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await DonationcreateformRecurring(page, { 
    currency: 'usd',
    layout: 'custom',
    title: 'USD Donation Recurring with Custom',
    description: 'This is the Donation Recurring Form with USD',
    amount1: '1000',
    amount2: '2000',
    amount3: '3000',
    amount4: '4000',
    minAmount: '10000',
    maxAmount: '100000'
  });

  // Add Page using utility function
  await addpage(page, shortcode, 'USD Donation Recurring Custom Page');

  // Form Submit using utility function
  const submittedAmount2 = await submitDonationFormRecurring(page, { 
    currency: 'usd',
    layout: 'custom',
    otherAmount: '50000'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount2);

  // Delete Page using utility function
  await deletePageByName(page, 'USD Donation Recurring Custom Page');

  // Delete Form using utility function
  await deleteform(page, 'USD Donation Recurring with Custom');

  await takeScreenshot(page);
});







// Create and submit a Donation Recurring form with custom payment layout (No Symbol)
test('Donation Recurring with Custom Layout - No Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login WP using utility function
  await loginToWordPress(page);

  // Create Form using existing utility function
  const shortcode = await DonationcreateformRecurring(page, { 
    currency: 'none',
    layout: 'custom',
    title: 'No Symbol Donation Recurring with Custom',
    description: 'This is the Donation Recurring Form with No Symbol',
    amount1: '1000',
    amount2: '2000',
    amount3: '3000',
    amount4: '4000',
    minAmount: '10000',
    maxAmount: '100000'
  });

  // Add Page using utility function
  await addpage(page, shortcode, 'No Symbol Donation Recurring Custom Page');

  // Form Submit using utility function
  const submittedAmount3 = await submitDonationFormRecurring(page, { 
    currency: 'none',
    layout: 'custom',
    otherAmount: '50000'
  });

  // Verify payment success using utility function
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  // Delete Page using utility function
  await deletePageByName(page, 'No Symbol Donation Recurring Custom Page');

  // Delete Form using utility function
  await deleteform(page, 'No Symbol Donation Recurring with Custom');

  await takeScreenshot(page);
});
