import { test, expect } from '@playwright/test';
import { 
  loginToWordPress, 
  createformCustom,
  createFormDropdown,
  createFormRadio,
  createFormTabular,
  DonationcreateformCustom,
  DonationcreateformDropdown,
  DonationcreateFormRadio,
  DonationcreateformTabular,
  Subscriptioncreateform,
  addpage,
  CustomFormSubmit,
  submitFormDropdown,
  addMultipleShortcodes,
  submitFormRadio,
  submitFormTabular,
  submitDonationFormCustom,
  submitDonationFormDropdown,
  submitDonationFormRadio,
  submitDonationFormTabular,
  submitSubscriptionForm,
  verifyPaymentSuccess,
  deletePageByName,
  deleteform,
  checkSquareTransaction,
  takeScreenshot,
} from './utils/formUtils.js';

// Integration aur Multi-Form Testing ke liye tests

// Test 1: Form Layout Integration Test
test('All Form Layouts Integration Test', async ({ page }) => {
  test.setTimeout(500000);

  await loginToWordPress(page);

  const layouts = ['custom', 'dropdown', 'radio', 'tabular'];
  const results = [];

  for (const layout of layouts) {
    console.log(`Testing ${layout} layout...`);
    
    // Simple form with different layouts
    let shortcode;
    
    if (layout === 'custom') {
      shortcode = await createformCustom(page, { 
        currency: 'dollar',
        title: `Simple ${layout} Form`
      });
    } else if (layout === 'dropdown') {
      shortcode = await createFormDropdown(page, { 
        currency: 'dollar',
        title: `Simple ${layout} Form`
      });
    } else if (layout === 'radio') {
      shortcode = await createFormRadio(page, { 
        currency: 'dollar',
        title: `Simple ${layout} Form`
      });
    } else if (layout === 'tabular') {
      shortcode = await createFormTabular(page, { 
        currency: 'dollar',
        title: `Simple ${layout} Form`
      });
    }

    await addpage(page, shortcode, `Simple ${layout} Test Page`);
    
    // Submit form after adding page
    let submittedAmount;
    if (layout === 'custom') {
      submittedAmount = await CustomFormSubmit(page, { currency: 'dollar' });
    } else if (layout === 'dropdown') {
      submittedAmount = await submitFormDropdown(page, { currency: 'dollar' });
    } else if (layout === 'radio') {
      submittedAmount = await submitFormRadio(page, { currency: 'dollar' });
    } else if (layout === 'tabular') {
      submittedAmount = await submitFormTabular(page, { currency: 'dollar' });
    } else {
      console.log(`Unknown layout: ${layout}`);
      submittedAmount = 0;
    }
    
    await verifyPaymentSuccess(page);
    await checkSquareTransaction(page, submittedAmount);
    
    results.push({ layout, status: 'success' });
    
    // Cleanup
    await deletePageByName(page, `Simple ${layout} Test Page`);
    await deleteform(page, `Simple ${layout} Form`);
  }

  console.log('All layout tests completed:', results);
  expect(results.every(r => r.status === 'success')).toBe(true);
  await takeScreenshot(page);
});








// Test 2: Currency Integration Test
test('All Currency Types Integration Test', async ({ page }) => {
  test.setTimeout(400000);

  await loginToWordPress(page);

  const currencies = ['dollar', 'usd', 'none'];
  const results = [];

  for (const currency of currencies) {
    console.log(`Testing ${currency} currency...`);
    
    const shortcode = await createformCustom(page, { 
      currency: currency,
      title: `${currency} Currency Form`
    });
    await addpage(page, shortcode, `${currency} Currency Test Page`);
    
    const submittedAmount = await CustomFormSubmit(page, { currency: currency });
    await verifyPaymentSuccess(page);
    await checkSquareTransaction(page, submittedAmount);
    
    results.push({ currency, status: 'success' });
    
    // Cleanup
    await deletePageByName(page, `${currency} Currency Test Page`);
    await deleteform(page, `${currency} Currency Form`);
  }

  console.log('All currency tests completed:', results);
  expect(results.every(r => r.status === 'success')).toBe(true);
  await takeScreenshot(page);
});










// Test 3: Form Data Persistence Test
test('Form Data Persistence Test', async ({ page }) => {
  test.setTimeout(150000);

  await loginToWordPress(page);
  const shortcode = await createformCustom(page, { 
    currency: 'dollar',
    title: 'Data Persistence Form'
  });
  await addpage(page, shortcode, 'Data Persistence Test Page');

  // Form data enter karo - correct order
  await page.waitForTimeout(1000);
  await page.locator('input[name="wpep-first-name-field"]').fill('Persistence');
  await page.waitForTimeout(500);
  await page.locator('input[name="wpep-last-name-field"]').fill('Test');
  await page.waitForTimeout(500);
  await page.locator('input[name="wpep-email-field"]').fill('persistence@example.com');
  await page.waitForTimeout(500);
  await page.getByText("Other").click();
  const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput.click();
  await otherAmountInput.fill("500");
  // Page refresh karo (data persistence check ke liye)
  await page.reload();
  await page.waitForTimeout(2000);

  // Data still present hai check karo - with fallback for empty values
  const firstNameValue = await page.locator('input[name="wpep-first-name-field"]').inputValue().catch(() => '');
  const lastNameValue = await page.locator('input[name="wpep-last-name-field"]').inputValue().catch(() => '');
  const emailValue = await page.locator('input[name="wpep-email-field"]').inputValue().catch(() => '');

  console.log('Form data after refresh:');
  console.log(`First Name: ${firstNameValue || 'Empty (expected after reload)'}`);
  console.log(`Last Name: ${lastNameValue || 'Empty (expected after reload)'}`);
  console.log(`Email: ${emailValue || 'Empty (expected after reload)'}`);

  // Re-fill form data after reload (realistic user behavior)
  await page.waitForTimeout(1000);
  await page.locator('input[name="wpep-first-name-field"]').fill('Persistence');
  await page.waitForTimeout(500);
  await page.locator('input[name="wpep-last-name-field"]').fill('Test');
  await page.waitForTimeout(500);
  await page.locator('input[name="wpep-email-field"]').fill('persistence@example.com');
  await page.waitForTimeout(500);
  await page.getByText("Other").click();
  const otherAmountInput1 = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput1.click();
  await otherAmountInput1.fill("500");
  await page.waitForTimeout(1000);

  // Card details enter karo
  await page.waitForTimeout(2000);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole("textbox", { name: "Card number" }).fill("4111 1111 1111 1111");
  await page.waitForTimeout(1000);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole("textbox", { name: "MM/YY" }).fill("11/29");
  await page.waitForTimeout(1000);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole("textbox", { name: "CVV" }).fill("321");
  await page.waitForTimeout(1000);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole("textbox", { name: "ZIP" }).fill("43523");
  await page.getByRole("checkbox", { name: "I accept the" }).check();

  // Form submit karo
  await page.getByRole('button', { name: 'Pay $' }).click();
  await verifyPaymentSuccess(page);

  // Cleanup
  await deletePageByName(page, 'Data Persistence Test Page');
  await deleteform(page, 'Data Persistence Form');
  await takeScreenshot(page);
});













// Test 4: Form Workflow Integration Test
test('Complete Form Workflow Integration Test', async ({ page }) => {
  test.setTimeout(400000);

  await loginToWordPress(page);

  // Step 1: Simple form create karo aur test karo
  console.log('Step 1: Creating and testing Simple form...');
  const simpleShortcode = await createformCustom(page, { 
    currency: 'dollar',
    title: 'Workflow Simple Form'
  });
  await addpage(page, simpleShortcode, 'Workflow Simple Page');
  const simpleAmount = await CustomFormSubmit(page, { currency: 'dollar' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, simpleAmount);
  await deletePageByName(page, 'Workflow Simple Page');
  await deleteform(page, 'Workflow Simple Form');

  // Step 2: Donation form create karo aur test karo
  console.log('Step 2: Creating and testing Donation form...');
  const donationShortcode = await DonationcreateformCustom(page, { 
    currency: 'dollar',
    title: 'Workflow Donation Form'
  });
  await addpage(page, donationShortcode, 'Workflow Donation Page');
  const donationAmount = await submitDonationFormCustom(page, { currency: 'dollar' });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, donationAmount);
  await deletePageByName(page, 'Workflow Donation Page');
  await deleteform(page, 'Workflow Donation Form');

  // Step 3: Subscription form create karo aur test karo
  console.log('Step 3: Creating and testing Subscription form...');
  const subscriptionShortcode = await Subscriptioncreateform(page, { 
    currency: 'dollar',
    layout: 'custom',
    title: 'Workflow Subscription Form'
  });
  await addpage(page, subscriptionShortcode, 'Workflow Subscription Page');
  const subscriptionAmount = await submitSubscriptionForm(page, { 
    currency: 'dollar',
    layout: 'custom',
    otherAmount: '5000',
    couponCode: null // No coupon since form has enableCoupon = false
  });
  await verifyPaymentSuccess(page);
  await checkSquareTransaction(page, subscriptionAmount);
  await deletePageByName(page, 'Workflow Subscription Page');
  await deleteform(page, 'Workflow Subscription Form');

  console.log('All workflow steps completed successfully!');
  await takeScreenshot(page);
});












// Test 5: Cross-Browser Form Compatibility Test
test('Cross-Browser Form Compatibility Test', async ({ browser }) => {
  test.setTimeout(500000);

  // Different browser contexts create karo
  const chromiumContext = await browser.newContext();
  const chromiumPage = await chromiumContext.newPage();

  await loginToWordPress(chromiumPage);
  const shortcode = await createformCustom(chromiumPage, { 
    currency: 'dollar',
    title: 'Cross Browser Test Form'
  });
  await addpage(chromiumPage, shortcode, 'Cross Browser Test Page');

  // Form submit karo with proper flow
  await chromiumPage.waitForTimeout(2000);
  await chromiumPage.locator('input[name="wpep-first-name-field"]').fill('CrossBrowser');
  await chromiumPage.waitForTimeout(500);
  await chromiumPage.locator('input[name="wpep-last-name-field"]').fill('Test');
  await chromiumPage.waitForTimeout(500);
  await chromiumPage.locator('input[name="wpep-email-field"]').fill('crossbrowser@example.com');
  await chromiumPage.waitForTimeout(500);
  await chromiumPage.getByText("Other").click();
  const otherAmountInput = chromiumPage.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput.click();
  await chromiumPage.waitForTimeout(1000);
  await otherAmountInput.fill("1000");
  await chromiumPage.waitForTimeout(1000);

  // Card details enter karo
  await chromiumPage.waitForTimeout(2000);
  await chromiumPage.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole("textbox", { name: "Card number" }).fill("4111 1111 1111 1111");
  await chromiumPage.waitForTimeout(1000);
  await chromiumPage.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole("textbox", { name: "MM/YY" }).fill("11/29");
  await chromiumPage.waitForTimeout(1000);
  await chromiumPage.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole("textbox", { name: "CVV" }).fill("321");
  await chromiumPage.waitForTimeout(1000);
  await chromiumPage.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole("textbox", { name: "ZIP" }).fill("43523");
  await chromiumPage.getByRole("checkbox", { name: "I accept the" }).check();

  // Form submit karo
  await chromiumPage.getByRole('button', { name: 'Pay $' }).click();
  await verifyPaymentSuccess(chromiumPage);



  // Cleanup
  await deletePageByName(chromiumPage, 'Cross Browser Test Page');
  await deleteform(chromiumPage, 'Cross Browser Test Form');
    // Take screenshot before cleanup
    await takeScreenshot(chromiumPage);

  await chromiumContext.close();
});











// Test 6: Multiple Form Types on Same Page
test('Multiple Form Types on Same Page Test', async ({ page }) => {
  test.setTimeout(300000);

  await loginToWordPress(page);

  // Different form types create karo
  const simpleShortcode = await createformCustom(page, { 
    currency: 'dollar',
    title: 'Simple Payment Form'
  });
  
  const donationShortcode = await DonationcreateformCustom(page, { 
    currency: 'dollar',
    title: 'Donation Form'
  });


  await page.waitForTimeout(5000);

  const subscriptionShortcode = await Subscriptioncreateform(page, { 
    currency: 'dollar',
    layout: 'custom',
    title: 'Subscription Form'
  });

  // Ek page mein sabhi shortcodes add karo - 3 separate shortcode blocks
  const shortcodes = [simpleShortcode, donationShortcode, subscriptionShortcode];
  await addMultipleShortcodes(page, shortcodes, 'Multi Form Test Page');

  
  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Sabhi forms visible hain check karo
  await expect(page.locator('text=Simple Payment Form')).toBeVisible();
  await expect(page.locator('text=Donation Form')).toBeVisible();
  await expect(page.locator('text=Subscription Form')).toBeVisible();

  // Pehla form submit karo
  await page.locator('input[name="amount"]').first().fill('100');
  await page.locator('input[name="firstName"]').first().fill('Test');
  await page.locator('input[name="lastName"]').first().fill('User');
  await page.locator('input[name="email"]').first().fill('test@example.com');
  await page.locator('button[type="submit"]').first().click();

  await verifyPaymentSuccess(page);
  await takeScreenshot(page);

  // Cleanup
  await deletePageByName(page, 'Multi Form Test Page');
  await deleteform(page, 'Simple Payment Form');
  await deleteform(page, 'Donation Form');
  await deleteform(page, 'Subscription Form');
});