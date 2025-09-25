import { test, expect } from '@playwright/test';
import { 
  loginToWordPress, 
  createformCustom,
  DonationcreateformCustom,
  Subscriptioncreateform,
  addpage,
  CustomFormSubmit,
  submitDonationFormCustom,
  submitSubscriptionForm,
  verifyPaymentSuccess,
  deletePageByName,
  deleteform,
  checkSquareTransaction,
  takeScreenshot,
} from './utils/formUtils.js';

// Performance aur Load Testing ke liye tests








// Test 1: Multiple Forms Simultaneous Creation
test('Multiple Forms Simultaneous Creation Test', async ({ page }) => {
  test.setTimeout(300000);

  const startTime = Date.now();
  await loginToWordPress(page);

  // Multiple forms create karo simultaneously
  const formPromises = [];
  for (let i = 1; i <= 5; i++) {
    formPromises.push(
      createformCustom(page, { 
        currency: 'dollar',
        title: `Performance Test Form ${i}`,
        description: `This is performance test form number ${i}`
      })
    );
  }

  const shortcodes = await Promise.all(formPromises);
  const endTime = Date.now();
  const totalTime = endTime - startTime;

  console.log(`5 forms created in ${totalTime}ms`);
  expect(totalTime).toBeLessThan(120000); // 2 minutes se kam

  // Cleanup
  for (let i = 1; i <= 5; i++) {
    await deleteform(page, `Performance Test Form ${i}`);
  }

  await takeScreenshot(page);
});








// Test 2: Large Form Data Processing
test('Large Form Data Processing Test', async ({ page }) => {
  test.setTimeout(200000);

  await loginToWordPress(page);
  const shortcode = await createformCustom(page, { currency: 'dollar' });
  await addpage(page, shortcode, 'Large Data Test Page');

  const startTime = Date.now();

  // Large amount of data enter karo

  await page.waitForTimeout(1000);
  await page.locator('input[name="wpep-first-name-field"]').fill('VeryLongFirstNameForPerformanceTesting');
  await page.waitForTimeout(1000);
  await page.locator('input[name="wpep-last-name-field"]').fill('VeryLongLastNameForPerformanceTesting');
  await page.waitForTimeout(1000);
  await page.locator('input[name="wpep-email-field"]').fill('verylongemailaddressforperformancetesting@example.com');
  await page.waitForTimeout(1000);
  await page.getByText("Other").click();
  await page.waitForTimeout(1000);
  const otherAmountInputs = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInputs.click();
  await otherAmountInputs.fill('999');


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
  await page.getByRole("button", { name: "Pay $" }).click();
  const endTime = Date.now();
  const processingTime = endTime - startTime;

  console.log(`Large form data processed in ${processingTime}ms`);
  expect(processingTime).toBeLessThan(45000); // 45 seconds se kam (realistic for large data + card processing)

  await verifyPaymentSuccess(page);
  await deletePageByName(page, 'Large Data Test Page');
  await deleteform(page, 'Simple Form');
  await takeScreenshot(page);
});










// Test 3: Rapid Form Submissions
test('Rapid Form Submissions Test', async ({ page }) => {
  test.setTimeout(400000);

  await loginToWordPress(page);
  const shortcode = await createformCustom(page, { currency: 'dollar' });
  await addpage(page, shortcode, 'Rapid Submission Test Page');

  const startTime = Date.now();
  console.log("Start Time:", startTime);
  const submissionTimes = [];

  // 10 rapid submissions try karo
  for (let i = 1; i <= 10; i++) {
    const submissionStart = Date.now();
    console.log("Submission Start Time:", submissionStart);
    await page.locator('input[name="wpep-first-name-field"]').fill(`Test${i}`);
    await page.waitForTimeout(500);
    await page.locator('input[name="wpep-last-name-field"]').fill(`User${i}`);
    await page.waitForTimeout(500);
    await page.locator('input[name="wpep-email-field"]').fill(`test${i}@example.com`);
    await page.waitForTimeout(500);
    await page.getByText("Other").click();
    await page.waitForTimeout(500);
    const otherAmountInputs = page.locator('[placeholder^="Enter your amount"]');
    await otherAmountInputs.click();
    await page.waitForTimeout(2000);
    await otherAmountInputs.fill(`${i}00`);
    await page.waitForTimeout(500);
        // Card details enter karo
    await page.waitForTimeout(2000);
    await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole("textbox", { name: "Card number" }).fill("4111 1111 1111 1111");

    await page.waitForTimeout(1000);
    await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole("textbox", { name: "MM/YY" }).fill("11/29");
    await page.waitForTimeout(1000);
    await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole("textbox", { name: "CVV" }).fill("321");
        
    await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole("textbox", { name: "ZIP" }).fill("43523");
    await page.waitForTimeout(1000);
    await page.getByRole("checkbox", { name: "I accept the" }).check()
    await page.getByRole("button", { name: "Pay $" }).click();

    const submissionEnd = Date.now();
    submissionTimes.push(submissionEnd - submissionStart);

    // Page reload karo next submission ke liye
    await page.reload();
    await page.waitForTimeout(1000);
  }

  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const averageSubmissionTime = submissionTimes.reduce((a, b) => a + b, 0) / submissionTimes.length;

  console.log(`10 rapid submissions completed in ${totalTime}ms`);
  console.log(`Average submission time: ${averageSubmissionTime}ms`);
  
  expect(averageSubmissionTime).toBeLessThan(15000); // 15 seconds se kam average (realistic for card processing)

  await deletePageByName(page, 'Rapid Submission Test Page');
  await deleteform(page, 'Simple Form');
  await takeScreenshot(page);
});












// Test 4: Form Response Time Test
test('Form Response Time Test', async ({ page }) => {
  test.setTimeout(300000);

  await loginToWordPress(page);
  const shortcode = await createformCustom(page, { currency: 'dollar' });
  await addpage(page, shortcode, 'Response Time Test Page');

  const responseTimes = [];

  // 5 different form submissions ke response time measure karo
  for (let i = 1; i <= 5; i++) {
    const startTime = Date.now();
    await page.waitForTimeout(2000);
    await page.locator('input[name="wpep-first-name-field"]').fill(`Test${i}`);
    await page.waitForTimeout(1000);
    await page.locator('input[name="wpep-last-name-field"]').fill(`User${i}`);
    await page.waitForTimeout(1000);
    await page.locator('input[name="wpep-email-field"]').fill(`test${i}@example.com`);
    await page.waitForTimeout(1000);
    await page.getByText("Other").click();
    await page.waitForTimeout(1000);
    const otherAmountInputs = page.locator('[placeholder^="Enter your amount"]');
    await otherAmountInputs.click();
    await page.waitForTimeout(2000);
    await otherAmountInputs.fill(`${i}00`);
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

    await page.getByRole("button", { name: "Pay $" }).click();

    // Success message wait karo  - with better error handling
    await page.waitForSelector('text=Payment Successful', { timeout: 30000 });

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    responseTimes.push(responseTime);

    console.log(`Submission ${i} response time: ${responseTime}ms`);

    // Page reload karo next test ke liye
    await page.reload();
    await page.waitForTimeout(2000);
  }

  const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const maxResponseTime = Math.max(...responseTimes);
  const minResponseTime = Math.min(...responseTimes);

  console.log(`Average response time: ${averageResponseTime}ms`);
  console.log(`Max response time: ${maxResponseTime}ms`);
  console.log(`Min response time: ${minResponseTime}ms`);

  expect(averageResponseTime).toBeLessThan(25000); // 25 seconds se kam average (realistic for card processing)
  expect(maxResponseTime).toBeLessThan(45000); // 45 seconds se kam maximum (realistic for card processing)

  await deletePageByName(page, 'Response Time Test Page');
  await deleteform(page, 'Simple Form');
  await takeScreenshot(page);
});
