// Import necessary Playwright modules
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const os = require('os');
import { 
    loginToWordPress, 
    createformCustom,
    addpage,
    CustomFormSubmit,
    submitFormCustomPopupMultistep,
    verifyPaymentSuccess,
    deletepage,
    deleteform,
    checkSquareTransaction,
    takeScreenshot,
  } from './utils/formUtils.js';
  

test('Click and capture screenshot after element appears', async ({ page }) => {
  // Navigate to the page where you want to perform the actions
  await page.goto('https://www.google.com');

  // Click on the element with the given locator (replace with your actual selector)
//   await page.locator('#input').click();

//   // Wait for the new element to appear after the click (replace with your actual selector)
//   const elementToCapture = page.locator('your-new-element-selector');
//   await elementToCapture.waitFor({ state: 'visible', timeout: 5000 }); // Ensure it's visible

  // Define the folder path for saving the screenshot (Screenshot folder in Downloads)
  const folderPath = path.join(os.homedir(), 'Downloads', 'Screenshot');

  // Create the folder if it doesn't exist
  fs.mkdirSync(folderPath, { recursive: true });

  // Define the full path for the screenshot
  const screenshotPath = path.join(folderPath, 'screenshot.png');

  // Take a screenshot of the newly appeared element and save it
  await page.screenshot({
    path: screenshotPath
  });

  console.log('Screenshot taken and saved to:', screenshotPath);
  
  // Optionally: Verify that the screenshot was saved
  const fileExists = fs.existsSync(screenshotPath);
  expect(fileExists).toBeTruthy(); // This will fail the test if the file doesn't exist
        

});

test('Check', async ({page}) => {

    test.setTimeout(200000);


});