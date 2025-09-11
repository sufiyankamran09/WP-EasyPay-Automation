import { test, expect } from '@playwright/test';
import {
  loginToWordPress,
  createFormTabular,
  addpage,
  submitFormTabular,
  verifyPaymentSuccess,
  deletepage,
  deleteform,
  checkSquareTransaction,
  takeScreenshot,
} from './utils/formUtils.js';





// Create and submit a simple payment form with payment Tabular layout ($)
test('Simple form with tabular layout with $', async ({ page }) => {
    test.setTimeout(200000);
  
    // Login
    await loginToWordPress(page);
  
    // Create Form (Tabular layout) with $ currency
    const shortcode = await createFormTabular(page, {
      currency: 'dollar',
      title: 'Tabular Form',
      description: 'This is the Tabular form payment',
    });
    expect(shortcode).toBeTruthy();
  
    // Add Page with shortcode
    await addpage(page, shortcode);
  
    // Submit form (Tabular flow) and pay with $
    const submittedAmount1 = await submitFormTabular(page, { currency: 'dollar' });
  
    // Verify success
    await verifyPaymentSuccess(page);
    await checkSquareTransaction(page, submittedAmount1);
  
    // Cleanup (delete the created page and form)
    await deletepage(page);
    await deleteform(page);
    await takeScreenshot(page);
  });

  


  


  // Create and submit a simple payment form with payment Tabular layout (USD)
test('Simple form with tabular layout with USD', async ({ page }) => {
    test.setTimeout(200000);
  
    // Login
    await loginToWordPress(page);
  
    // Create Form (Tabular layout) with USD currency
    const shortcode = await createFormTabular(page, {
      currency: 'usd',
      title: 'Tabular Form',
      description: 'This is the Tabular form payment',
    });
    expect(shortcode).toBeTruthy();
  
    // Add Page with shortcode
    await addpage(page, shortcode);
  
    // Submit form (Tabular flow) and pay with USD
    const submittedAmount2 = await submitFormTabular(page, { currency: 'usd' });
  
    // Verify success
    await verifyPaymentSuccess(page);
    await checkSquareTransaction(page, submittedAmount2);
  
    // Cleanup (delete the created page and form)
    await deletepage(page);
    await deleteform(page);
    
    await takeScreenshot(page);
  });

  






// Create and submit a simple payment form with payment Tabular layout (No code/symbol)
test('Simple form with tabular layout with No Code/Symbol', async ({ page }) => {
  test.setTimeout(200000);

  // Login
  await loginToWordPress(page);

  // Create Form (Tabular layout) with no code/symbol
  const shortcode = await createFormTabular(page, {
    currency: 'none',
    title: 'Tabular Form',
    description: 'This is the Tabular form payment',
  });
  expect(shortcode).toBeTruthy();

  // Add Page with shortcode
  await addpage(page, shortcode);

  // Submit form (Tabular flow) expecting generic Pay button
  const submittedAmount3 = await submitFormTabular(page, { currency: 'none' });

  // Verify success
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount3);

  // Cleanup (delete the created page and form)
  await deletepage(page);
  await deleteform(page);
  await takeScreenshot(page);
});




