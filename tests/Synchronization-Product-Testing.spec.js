import { test, expect } from '@playwright/test';
import {
  loginToWordPress,
  addpage,
  verifyPaymentSuccess,
  deletePageByName,
  deleteform,
  checkSquareTransaction,
  takeScreenshot,
  createformCustomWithSync,
  submitFormCustomWithSync,
} from './utils/formUtils.js';

// Synchronization Product Testing ke liye tests





// Test 1: Synchronization Product Dollar Currency Testing
test('Synchronization Product Form - Dollar Currency Testing', async ({ page }) => {
  test.setTimeout(300000);

  await loginToWordPress(page);

  // Create form with synchronization
  const shortcode = await createformCustomWithSync(page, {
    currency: 'dollar',
    title: 'Synchronization Product Test Form',
    description: 'Testing synchronization with Square products',
    enableCoupon: true,
    searchTerm: 'b',
    productName: 'Downloaded Image Bike'
  });

  // Verify form is created successfully
  expect(shortcode).toBeTruthy();


  // Add page
  await addpage(page, shortcode, 'Synchronization Product Test Page');

  // Submit form with product selection and coupon (Dollar currency)
  const submittedAmount = await submitFormCustomWithSync(page, {
    currency: 'dollar',
    firstName: 'Muhammad',
    lastName: 'Sufiyan',
    email: 'Sufiyan@gmail.com',
    couponCode: 'Suf123',
    productClicks: 3
  });

  // Verify payment success
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount);


  await deletePageByName(page, 'Synchronization Product Test Page');
  await deleteform(page, 'Synchronization Product Test Form');
  await takeScreenshot(page);
});









// Test 2: Synchronization Product USD Currency Testing
test('Synchronization Product Form - USD Currency Testing', async ({ page }) => {
  test.setTimeout(300000);

  await loginToWordPress(page);

  // Create form with synchronization
  const shortcode = await createformCustomWithSync(page, {
    currency: 'usd',
    title: 'Synchronization Product Submit Test Form',
    description: 'Testing form submission with products and coupon',
    enableCoupon: true,
    searchTerm: 'b',
    productName: 'Downloaded Image Bike'
  });

  // Add page
  await addpage(page, shortcode, 'Synchronization Product Submit Test Page');

  // Submit form with product selection and coupon (USD currency)
  const submittedAmount = await submitFormCustomWithSync(page, {
    currency: 'usd',
    firstName: 'Muhammad',
    lastName: 'Sufiyan',
    email: 'Sufiyan@gmail.com',
    couponCode: 'Suf123',
    productClicks: 3
  });

  // Verify payment success
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount);

  await deletePageByName(page, 'Synchronization Product Submit Test Page');
  await deleteform(page, 'Synchronization Product Submit Test Form');
  await takeScreenshot(page);
});









// Test 3: Synchronization Product No Code Symbol Testing
test('Synchronization Product Form - No Code Symbol Testing', async ({ page }) => {
  test.setTimeout(300000);

  await loginToWordPress(page);

  // Create form with synchronization
  const shortcode = await createformCustomWithSync(page, {
    currency: 'none',
    title: 'No Code Symbol Test Form',
    description: 'Testing no code symbol',
    enableCoupon: true,
    searchTerm: 'b',
    productName: 'Downloaded Image Bike'
  });

  // Add page
  await addpage(page, shortcode, 'No Code Symbol Test Page');

  // Submit form with no code symbol
  const submittedAmount = await submitFormCustomWithSync(page, {
    currency: 'none',
    firstName: 'No Code',
    lastName: 'Symbol',
    email: 'no@example.com',
    couponCode: 'Suf123',
    productClicks: 2
  });

  // Verify payment success
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount);

 

  await deletePageByName(page, 'No Code Symbol Test Page');
  await deleteform(page, 'No Code Symbol Test Form');
  await takeScreenshot(page);
});









// Test 4: Synchronization Product Search Testing
test('Synchronization Product Form - Product Search Testing', async ({ page }) => {
  test.setTimeout(300000);

  await loginToWordPress(page);

  // Test multiple product search terms
  console.log('Testing multiple product search terms...');
  
  // Create form with synchronization - Test search term 'b'
  const shortcode1 = await createformCustomWithSync(page, {
    currency: 'dollar',
    title: 'Product Search Test Form - B',
    description: 'Testing product search with term "b"',
    enableCoupon: true,
    searchTerm: 'b',
    productName: 'Downloaded Image Bike'
  });
  
  // Test different search term 'bike'
   await createformCustomWithSync(page, {
    currency: 'dollar',
    title: 'Product Search Test Form - Bike',
    description: 'Testing product search with term "bike"',
    enableCoupon: true,
    searchTerm: 'bike',
    productName: 'Downloaded Image Bike'
  });
  
  // Use the first form for submission
  const shortcode = shortcode1;

  // Add page
  await addpage(page, shortcode, 'Product Search Test Page');

  // Submit form
  const submittedAmount = await submitFormCustomWithSync(page, {
    currency: 'dollar',
    firstName: 'Search',
    lastName: 'Test',
    email: 'search@example.com'
  });

  // Verify payment success
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, submittedAmount);


  await deletePageByName(page, 'Product Search Test Page');
  await deleteform(page, 'Product Search Test Form - B');
  await deleteform(page, 'Product Search Test Form - Bike');
  await takeScreenshot(page);
});
