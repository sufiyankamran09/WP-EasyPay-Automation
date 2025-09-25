import { expect } from '@playwright/test';
import { testConfig } from '../config/testConfig.js';
import fs from 'fs';
import path from 'path';
import os from 'os';



// Login function
export async function loginToWordPress(page, username = null, password = null) {
  const user = username || testConfig.credentials.username;
  const pass = password || testConfig.credentials.password;
  
  await page.goto(testConfig.urls.login);
  await page.getByRole('textbox', { name: 'Username or Email Address' }).click();
  await page.getByRole('textbox', { name: 'Username or Email Address' }).fill(user);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(pass);
  await page.getByRole('button', { name: 'Log In' }).click();
 // Check WP Easy Pay Visible //
  await page.goto('https://wppayautomation.instawp.xyz/wp-admin/');
  await page.waitForTimeout(5000);
  await expect(page.getByRole('link', { name: 'WP EASY PAY', exact: true })).toBeVisible();
  const text = await page.locator('#toplevel_page_edit-post_type-wp_easy_pay').textContent();
  const textprint = text.trim();
  console.log(`WP Easy Pay text content: ${textprint}`);

} 






// Function to create a payment form
export async function createformCustom(page, options = {}) {
  const { currency, title = 'Simple Form', description = 'This is a simple form', openInPopup, showMultistep, termsUrl = 'www.google.com',  popupButtonTitle } = options; // currency required; others optional

  await page.getByRole('link', { name: 'WP EASY PAY', exact: true }).click();
  await page.getByLabel('Main menu', { exact: true }).getByRole('link', { name: 'Create Payment Form' }).click();
  await page.getByRole('checkbox', { name: 'Use Global Settings' }).check();
  await page.getByText('Form settings').click();

  if (openInPopup) {
    await page.getByRole('checkbox', { name: 'Open form in popup' }).check();
  }
  if (showMultistep) {
    await page.getByRole('checkbox', { name: 'Show multistep form' }).check();
  }

  await page.getByRole('textbox', { name: 'please enter title' }).click();
  await page.getByRole('textbox', { name: 'please enter title' }).fill(title);
  await page.getByRole('textbox', { name: 'Please Enter description' }).click();
  await page.getByRole('textbox', { name: 'Please Enter description' }).fill(description);

  if (openInPopup && popupButtonTitle) {
    await page.getByRole('textbox', { name: 'please enter button title' }).click();
    await page.getByRole('textbox', { name: 'please enter button title' }).fill(popupButtonTitle);
  }

  await page.locator('#paymentTypeSimple').check();
  await page.locator('#doller1').click();
  await page.locator('#doller1').fill(testConfig.formData.amounts.option1);
  await page.locator('#doller2').click();
  await page.locator('#doller2').fill(testConfig.formData.amounts.option2);
  await page.locator('#doller3').click();
  await page.locator('#doller3').fill(testConfig.formData.amounts.option3);
  await page.locator('#doller4').click();
  await page.locator('#doller4').fill(testConfig.formData.amounts.option4);
  await page.getByRole('checkbox', { name: 'Enable other amount field on' }).check();
  await page.getByRole('textbox', { name: 'Min amount' }).click();
  await page.getByRole('textbox', { name: 'Min amount' }).fill(testConfig.formData.minAmount);
  await page.getByRole('textbox', { name: 'Max amount' }).click();
  await page.getByRole('textbox', { name: 'Max amount' }).fill(testConfig.formData.maxAmount);
  await page.getByRole('checkbox', { name: 'Enable save card for future' }).check();
  await page.getByRole('textbox', { name: 'Please Enter success message' }).click();
  await page.getByRole('textbox', { name: 'Please Enter success message' }).fill(testConfig.formData.successMessage);
  await page.getByRole('checkbox', { name: 'Enable terms and conditions' }).check();
  await page.getByRole('textbox', { name: 'Please Enter Label' }).click();
  await page.getByRole('textbox', { name: 'Please Enter Label' }).fill(testConfig.formData.termsLabel);
  await page.getByRole('textbox', { name: 'Please Enter url for user' }).click();
  await page.getByRole('textbox', { name: 'Please Enter url for user' }).fill(termsUrl);

  const shortcode = await page.locator("h4").textContent();
  console.log(shortcode);

  // Currency selection based on option
  if (currency === 'dollar') {
    await page.getByRole('radio', { name: 'Currency Symbol (e.x: $)' }).check();
  } else if (currency === 'none') {
    await page.getByRole('radio', { name: 'No code/Symbol' }).check();
  }

  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  console.log('Your form has been created successfully');
  return shortcode; // Return shortcode for use in other functions
}





// Create form with Dropdown payment type
export async function createFormDropdown(page, options = {}) {
  const { currency, title = testConfig.formData.title, description = testConfig.formData.description } = options;

  await page.getByRole('link', { name: 'WP EASY PAY', exact: true }).click();
  await page.getByLabel('Main menu', { exact: true }).getByRole('link', { name: 'Create Payment Form' }).click();
  await page.getByRole('checkbox', { name: 'Use Global Settings' }).check();
  await page.getByText('Form settings').click();
  await page.getByRole('textbox', { name: 'please enter title' }).fill(title);
  await page.getByRole('textbox', { name: 'Please Enter description' }).fill(description);
  await page.locator('#paymentTypeSimple').check();
  await page.locator('select[name="wpep_square_amount_type"]').selectOption('payment_drop');
  await page.getByRole('checkbox', { name: 'Enable Quantity on my form' }).check();

  // First option
  await page.getByRole('textbox', { name: 'Price' }).click();
  await page.getByRole('textbox', { name: 'Price' }).fill('100');
  await page.getByRole('textbox', { name: 'Label', exact: true }).fill('$ 100');

  // Second option
  await page.locator('#amountInDropInputs a').filter({ hasText: 'Add' }).click();
  await page.getByRole('textbox', { name: 'Price' }).nth(1).fill('200');
  await page.getByRole('textbox', { name: 'Label' }).nth(1).fill('$ 200');

  // Third option
  await page.locator('a').filter({ hasText: /^Add$/ }).nth(2).click();
  await page.getByRole('textbox', { name: 'Price' }).nth(2).fill('300');
  await page.getByRole('textbox', { name: 'Label' }).nth(2).fill('$ 300');

  // Fourth option
  await page.locator('a').filter({ hasText: /^Add$/ }).nth(3).click();
  await page.getByRole('textbox', { name: 'Price' }).nth(3).fill('400');
  await page.getByRole('textbox', { name: 'Label' }).nth(3).fill('$ 400');

  await page.getByRole('checkbox', { name: 'Enable save card for future' }).check();
  await page.getByRole('textbox', { name: 'Please Enter success message' }).fill(testConfig.formData.successMessage);
  await page.getByRole('checkbox', { name: 'Enable terms and conditions' }).check();
  await page.getByRole('textbox', { name: 'Please Enter Label' }).fill(testConfig.formData.termsLabel);
  await page.getByRole('textbox', { name: 'Please Enter url for user' }).fill(testConfig.formData.termsUrl);

  const shortcode = await page.locator('h4').textContent();

  if (currency === 'dollar') {
    await page.getByRole('radio', { name: 'Currency Symbol (e.x: $)' }).check();
  } else if (currency === 'none') {
    await page.getByRole('radio', { name: 'No code/Symbol' }).check();
  }

  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  return shortcode;
}






// Create form with Radio payment type
export async function createFormRadio(page, options = {}) {
  const { currency, title = testConfig.formData.title, description = testConfig.formData.description } = options;

  await page.getByRole('link', { name: 'WP EASY PAY', exact: true }).click();
  await page.getByLabel('Main menu', { exact: true }).getByRole('link', { name: 'Create Payment Form' }).click();
  await page.getByRole('checkbox', { name: 'Use Global Settings' }).check();
  await page.getByText('Form settings').click();
  await page.getByRole('textbox', { name: 'please enter title' }).fill(title);
  await page.getByRole('textbox', { name: 'Please Enter description' }).fill(description);
  await page.waitForTimeout(1000);
  await page.locator('#paymentTypeSimple').check();
  await page.waitForTimeout(1000);
  await page.locator('select[name="wpep_square_amount_type"]').selectOption('payment_radio');
  await page.waitForTimeout(1000);
  await page.getByRole('checkbox', { name: 'Enable Quantity on my form' }).check();
  await page.waitForTimeout(1000);

  // First's
  await page.getByRole('textbox', { name: 'Price' }).fill('100');
  await page.getByRole('textbox', { name: 'Label', exact: true }).fill('$ 100');
  await page.waitForTimeout(1000);
  // Second
  await page.locator('#amountInListInputs a').filter({ hasText: 'Add' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('textbox', { name: 'Price' }).nth(1).fill('200');
  await page.getByRole('textbox', { name: 'Label' }).nth(1).fill('$ 200');
  await page.waitForTimeout(1000);
  // Third
  await page.locator('a').filter({ hasText: /^Add$/ }).nth(1).click();
  await page.waitForTimeout(1000);
  await page.getByRole('textbox', { name: 'Price' }).nth(2).fill('300');
  await page.getByRole('textbox', { name: 'Label' }).nth(2).fill('$ 300');
  await page.waitForTimeout(1000);
  // Fourth
  await page.locator('a').filter({ hasText: /^Add$/ }).nth(2).click();
  await page.waitForTimeout(1000);
  await page.getByRole('textbox', { name: 'Price' }).nth(3).fill('400');
  await page.getByRole('textbox', { name: 'Label' }).nth(3).fill('$ 400');
  await page.waitForTimeout(1000);

  await page.getByRole('checkbox', { name: 'Enable save card for future' }).check();
  await page.getByRole('textbox', { name: 'Please Enter success message' }).fill(testConfig.formData.successMessage);
  await page.getByRole('checkbox', { name: 'Enable terms and conditions' }).check();
  await page.getByRole('textbox', { name: 'Please Enter Label' }).fill(testConfig.formData.termsLabel);
  await page.getByRole('textbox', { name: 'Please Enter url for user' }).fill(testConfig.formData.termsUrl);

  const shortcode = await page.locator('h4').textContent();

  if (currency === 'dollar') {
    await page.getByRole('radio', { name: 'Currency Symbol (e.x: $)' }).check();
  } else if (currency === 'none') {
    await page.getByRole('radio', { name: 'No code/Symbol' }).check();
  }

  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  return shortcode;
}







// Create form with Tabular payment type
export async function createFormTabular(page, options = {}) {
  const { currency, title = testConfig.formData.title, description = testConfig.formData.description } = options;

  await page.getByRole('link', { name: 'WP EASY PAY', exact: true }).click();
  await page.getByLabel('Main menu', { exact: true }).getByRole('link', { name: 'Create Payment Form' }).click();
  await page.getByRole('checkbox', { name: 'Use Global Settings' }).check();
  await page.getByText('Form settings').click();
  await page.getByRole('textbox', { name: 'please enter title' }).fill(title);
  await page.getByRole('textbox', { name: 'Please Enter description' }).fill(description);
  await page.waitForTimeout(1000);
  await page.locator('select[name="wpep_square_amount_type"]').selectOption('payment_tabular');
  await page.getByRole('checkbox', { name: 'Enable save card for future' }).check();
  await page.waitForTimeout(1000);

  // Row 1
  await page.getByRole('textbox', { name: 'Product Price' }).fill('1000');
  await page.getByRole('textbox', { name: 'Label', exact: true }).fill('$ 1000');
  await page.getByRole('textbox', { name: 'Quantity' }).fill('1');
  await page.locator('input[type="button"]').first().click();

  // Row 2
  await page.getByRole('textbox', { name: 'Product Price' }).nth(1).fill('2000');
  await page.getByRole('textbox', { name: 'Label' }).nth(1).fill('$ 2000');
  await page.getByRole('textbox', { name: 'Quantity' }).nth(1).fill('1');
  await page.locator('input[type="button"]').nth(2).click();

  // Row 3
  await page.getByRole('textbox', { name: 'Product Price' }).nth(2).fill('3000');
  await page.getByRole('textbox', { name: 'Label' }).nth(2).fill('$ 3000');
  await page.getByRole('textbox', { name: 'Quantity' }).nth(2).fill('1');

  await page.getByRole('textbox', { name: 'Please Enter success message' }).fill(testConfig.formData.successMessage);
  await page.getByRole('checkbox', { name: 'Enable terms and conditions' }).check();
  await page.getByRole('textbox', { name: 'Please Enter Label' }).fill(testConfig.formData.termsLabel);
  await page.getByRole('textbox', { name: 'Please Enter url for user' }).fill(testConfig.formData.termsUrl);

  const shortcode = await page.locator('h4').textContent();

  if (currency === 'dollar') {
    await page.getByRole('radio', { name: 'Currency Symbol (e.x: $)' }).check();
  } else if (currency === 'none') {
    await page.getByRole('radio', { name: 'No code/Symbol' }).check();
  }

  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  return shortcode;
}







// Create donation form with custom layout

export async function DonationcreateformCustom(page, options = {}) {
  const { 
    currency, 
    openInPopup, 
    showMultistep, 
    popupButtonTitle,
    enableCoupon = false,
    enableRedirection = false,
    redirectUrl = 'www.google.com',
    redirectDelay = '8',
    redirectLabel = 'Payment Successful',
    title = 'Donation Form',
    description = 'This is a donation form',
    organizationName = 'Objects',
    goalAmount = '20000',
    goalMessage = 'Your Goal Achieved.',
    closeOnGoal = true,
    amount1 = '1000',
    amount2 = '2000', 
    amount3 = '3000',
    amount4 = '4000',
    minAmount = '1000',
    maxAmount = '50000'
  } = options;

  await page.getByRole('link', { name: 'WP EASY PAY', exact: true }).click();
  await page.getByLabel('Main menu', { exact: true }).getByRole('link', { name: 'Create Payment Form' }).click();
  await page.getByRole('checkbox', { name: 'Use Global Settings' }).check();
  await page.getByText('Form settings').click();

  if (openInPopup) {
    await page.getByRole('checkbox', { name: 'Open form in popup' }).check();
  }
  if (showMultistep) {
    await page.getByRole('checkbox', { name: 'Show multistep form' }).check();
  }

  await page.getByRole('textbox', { name: 'please enter title' }).click();
  await page.getByRole('textbox', { name: 'please enter title' }).fill(title);
  await page.getByRole('textbox', { name: 'Please Enter description' }).click();
  await page.getByRole('textbox', { name: 'Please Enter description' }).fill(description);

  if (openInPopup && popupButtonTitle) {
    await page.getByRole('textbox', { name: 'please enter button title' }).click();
    await page.getByRole('textbox', { name: 'please enter button title' }).fill(popupButtonTitle);
  }

 await page.locator('#paymentTypeDonation').check();
 await page.waitForTimeout(1000);
  await page.getByRole('textbox', { name: 'please enter organization name' }).click();
  await page.getByRole('textbox', { name: 'please enter organization name' }).fill(organizationName);
  await page.getByRole('checkbox', { name: 'Enable Goal', exact: true }).check();
  await page.getByPlaceholder('Enter Goal Amount').click();
  await page.getByPlaceholder('Enter Goal Amount').fill(goalAmount);
  await page.getByRole('checkbox', { name: 'Enable Goal Message' }).check();
  await page.getByRole('textbox', { name: 'Enter message to display' }).click();
  await page.getByRole('textbox', { name: 'Enter message to display' }).fill(goalMessage);
  
  if (closeOnGoal) {
  await page.getByRole('checkbox', { name: 'Close form when goal is' }).check();
  }
  await page.locator('#doller1').click(); 
  await page.locator('#doller1').fill(amount1);

  await page.locator('#doller2').click();
  await page.locator('#doller2').fill(amount2);
  await page.locator('#doller3').click();
  await page.locator('#doller3').fill(amount3);
  await page.locator('#doller4').click();
  await page.locator('#doller4').fill(amount4);
  await page.getByRole('checkbox', { name: 'Enable other amount field on' }).check();
  await page.getByRole('textbox', { name: 'Min amount' }).click();
  await page.getByRole('textbox', { name: 'Min amount' }).fill(minAmount);
  await page.getByRole('textbox', { name: 'Max amount' }).click();
  await page.getByRole('textbox', { name: 'Max amount' }).fill(maxAmount);
  
  // Enable coupon if requested
  if (enableCoupon) {
    await page.getByRole('checkbox', { name: 'Enable Coupon on my form' }).check();
  }

  await page.getByRole('checkbox', { name: 'Enable save card for future' }).check();

  // Enable redirection if requested
  if (enableRedirection) {
    await page.locator('#allowRedirection').selectOption('Yes');
    await page.getByPlaceholder('Example:').click();
    await page.getByPlaceholder('Example:').fill(redirectDelay);
    await page.getByRole('textbox', { name: 'Enter Label' }).click();
    await page.getByRole('textbox', { name: 'Enter Label' }).fill(redirectLabel);
    await page.getByRole('textbox', { name: 'Redirect url' }).click();
    await page.getByRole('textbox', { name: 'Redirect url' }).fill(redirectUrl);
  }

  await page.locator('#wpcontent').click();
  await page.getByRole('textbox', { name: 'Please Enter success message' }).click();
  await page.getByRole('textbox', { name: 'Please Enter success message' }).fill(testConfig.formData.successMessage);
  await page.getByRole('checkbox', { name: 'Enable terms and conditions' }).check();
  await page.getByRole('textbox', { name: 'Please Enter Label' }).click();
  await page.getByRole('textbox', { name: 'Please Enter Label' }).fill(testConfig.formData.termsLabel);
  await page.getByRole('textbox', { name: 'Please Enter url for user' }).click();
  await page.getByRole('textbox', { name: 'Please Enter url for user' }).fill(testConfig.formData.termsUrl1);

  const shortcode = await page.locator("h4").textContent();
  console.log(shortcode);

  // Currency selection based on option
  if (currency === 'dollar') {
    await page.getByRole('radio', { name: 'Currency Symbol (e.x: $)' }).check();
  } else if (currency === 'none') {
    await page.getByRole('radio', { name: 'No code/Symbol' }).check();
  }

  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  console.log('Your form has been created successfully');
  return shortcode; // Return shortcode for use in other functions

}








// Create donation form with Dropdown payment type
export async function DonationcreateformDropdown(page, options = {}) {
  const { currency, title = 'Donation Form', description = 'This is a donation form' } = options;

  await page.getByRole('link', { name: 'WP EASY PAY', exact: true }).click();
  await page.getByLabel('Main menu', { exact: true }).getByRole('link', { name: 'Create Payment Form' }).click();
  await page.getByRole('checkbox', { name: 'Use Global Settings' }).check();
  await page.getByText('Form settings').click();

  await page.getByRole('textbox', { name: 'please enter title' }).fill(title);
  await page.getByRole('textbox', { name: 'Please Enter description' }).fill(description);

  await page.locator('#paymentTypeDonation').check();
  await page.waitForTimeout(1000);

  // Basic donation info
  await page.getByRole('textbox', { name: 'please enter organization name' }).fill('Objects');
  await page.getByRole('checkbox', { name: 'Enable Goal', exact: true }).check();
  await page.getByPlaceholder('Enter Goal Amount').click();
  await page.getByPlaceholder('Enter Goal Amount').fill('20000');
  await page.getByRole('checkbox', { name: 'Enable Goal Message' }).check();
  await page.getByRole('textbox', { name: 'Enter message to display' }).click();
  await page.getByRole('textbox', { name: 'Enter message to display' }).fill('Your Goal Achieved.');
  await page.getByRole('checkbox', { name: 'Close form when goal is' }).check();

  // Switch to dropdown amount type
  await page.locator('select[name="wpep_square_amount_type"]').selectOption('payment_drop');
  await page.getByRole('checkbox', { name: 'Enable Quantity on my form' }).check();

  // Amount options
  await page.getByRole('textbox', { name: 'Price' }).fill('100');
  await page.getByRole('textbox', { name: 'Label', exact: true }).fill('$ 100');

  await page.locator('#amountInDropInputs a').filter({ hasText: 'Add' }).click();
  await page.getByRole('textbox', { name: 'Price' }).nth(1).fill('200');
  await page.getByRole('textbox', { name: 'Label' }).nth(1).fill('$ 200');

  await page.locator('a').filter({ hasText: /^Add$/ }).nth(2).click();
  await page.getByRole('textbox', { name: 'Price' }).nth(2).fill('300');
  await page.getByRole('textbox', { name: 'Label' }).nth(2).fill('$ 300');

  await page.locator('a').filter({ hasText: /^Add$/ }).nth(3).click();
  await page.getByRole('textbox', { name: 'Price' }).nth(3).fill('400');
  await page.getByRole('textbox', { name: 'Label' }).nth(3).fill('$ 400');

  await page.getByRole('checkbox', { name: 'Enable save card for future' }).check();
  await page.getByRole('textbox', { name: 'Please Enter success message' }).fill(testConfig.formData.successMessage);
  await page.getByRole('checkbox', { name: 'Enable terms and conditions' }).check();
  await page.getByRole('textbox', { name: 'Please Enter Label' }).fill(testConfig.formData.termsLabel);
  await page.getByRole('textbox', { name: 'Please Enter url for user' }).fill(testConfig.formData.termsUrl);

  const shortcode = await page.locator('h4').textContent();

  if (currency === 'dollar') {
    await page.getByRole('radio', { name: 'Currency Symbol (e.x: $)' }).check();
  } else if (currency === 'none') {
    await page.getByRole('radio', { name: 'No code/Symbol' }).check();
  }

  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  return shortcode;
}







// Create donation form with Radio payment type
export async function DonationcreateformRadio(page, options = {}) {
  const { currency, title = 'Donation Form', description = 'This is a donation form' } = options;

  await page.getByRole('link', { name: 'WP EASY PAY', exact: true }).click();
  await page.getByLabel('Main menu', { exact: true }).getByRole('link', { name: 'Create Payment Form' }).click();
  await page.getByRole('checkbox', { name: 'Use Global Settings' }).check();
  await page.getByText('Form settings').click();

  await page.getByRole('textbox', { name: 'please enter title' }).fill(title);
  await page.getByRole('textbox', { name: 'Please Enter description' }).fill(description);

  await page.locator('#paymentTypeDonation').check();
  await page.waitForTimeout(1000);
  await page.getByRole('textbox', { name: 'please enter organization name' }).fill('Objects');
  await page.getByRole('checkbox', { name: 'Enable Goal', exact: true }).check();
  await page.getByPlaceholder('Enter Goal Amount').click();
  await page.getByPlaceholder('Enter Goal Amount').fill('20000');
  await page.getByRole('checkbox', { name: 'Enable Goal Message' }).check();
  await page.getByRole('textbox', { name: 'Enter message to display' }).click();
  await page.getByRole('textbox', { name: 'Enter message to display' }).fill('Your Goal Achieved.');
  await page.getByRole('checkbox', { name: 'Close form when goal is' }).check();

  // Switch to radio amount type
  await page.locator('select[name="wpep_square_amount_type"]').selectOption('payment_radio');
  await page.getByRole('checkbox', { name: 'Enable Quantity on my form' }).check();

  // Radio amount options
  await page.getByRole('textbox', { name: 'Price' }).fill('1000');
  await page.getByRole('textbox', { name: 'Label', exact: true }).fill('$ 1000');

  await page.locator('#amountInListInputs a').filter({ hasText: 'Add' }).click();
  await page.getByRole('textbox', { name: 'Price' }).nth(1).fill('2000');
  await page.getByRole('textbox', { name: 'Label' }).nth(1).fill('$ 2000');

  await page.locator('a').filter({ hasText: /^Add$/ }).nth(1).click();
  await page.getByRole('textbox', { name: 'Price' }).nth(2).fill('3000');
  await page.getByRole('textbox', { name: 'Label' }).nth(2).fill('$ 3000');

  await page.locator('a').filter({ hasText: /^Add$/ }).nth(2).click();
  await page.getByRole('textbox', { name: 'Price' }).nth(3).fill('4000');
  await page.getByRole('textbox', { name: 'Label' }).nth(3).fill('$ 4000');

  await page.getByRole('checkbox', { name: 'Enable save card for future' }).check();
  await page.getByRole('textbox', { name: 'Please Enter success message' }).fill(testConfig.formData.successMessage);
  await page.getByRole('checkbox', { name: 'Enable terms and conditions' }).check();
  await page.getByRole('textbox', { name: 'Please Enter Label' }).fill(testConfig.formData.termsLabel);
  await page.getByRole('textbox', { name: 'Please Enter url for user' }).fill(testConfig.formData.termsUrl);

  const shortcode = await page.locator('h4').textContent();

  if (currency === 'dollar') {
    await page.getByRole('radio', { name: 'Currency Symbol (e.x: $)' }).check();
  } else if (currency === 'none') {
    await page.getByRole('radio', { name: 'No code/Symbol' }).check();
  }

  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  return shortcode;
}







// Create donation form with Tabular payment type
export async function DonationcreateformTabular(page, options = {}) {
  const { currency, title = 'Donation Form', description = 'This is a donation form' } = options;

  await page.getByRole('link', { name: 'WP EASY PAY', exact: true }).click();
  await page.getByLabel('Main menu', { exact: true }).getByRole('link', { name: 'Create Payment Form' }).click();
  await page.getByRole('checkbox', { name: 'Use Global Settings' }).check();
  await page.getByText('Form settings').click();

  await page.getByRole('textbox', { name: 'please enter title' }).fill(title);
  await page.getByRole('textbox', { name: 'Please Enter description' }).fill(description);

  await page.locator('#paymentTypeDonation').check();
  await page.waitForTimeout(1000);
  await page.getByRole('textbox', { name: 'please enter organization name' }).fill('Objects');
  await page.getByRole('checkbox', { name: 'Enable Goal', exact: true }).check();
  await page.getByPlaceholder('Enter Goal Amount').click();
  await page.getByPlaceholder('Enter Goal Amount').fill('20000');
  await page.getByRole('checkbox', { name: 'Enable Goal Message' }).check();
  await page.getByRole('textbox', { name: 'Enter message to display' }).click();
  await page.getByRole('textbox', { name: 'Enter message to display' }).fill('Your Goal Achieved.');
  await page.getByRole('checkbox', { name: 'Close form when goal is' }).check();

  // Switch to tabular amount type
  await page.locator('select[name="wpep_square_amount_type"]').selectOption('payment_tabular');
  await page.getByRole('checkbox', { name: 'Enable save card for future' }).check();
  await page.waitForTimeout(1000);

  // Row 1
  await page.getByRole('textbox', { name: 'Product Price' }).fill('1000');
  await page.getByRole('textbox', { name: 'Label', exact: true }).fill('$ 1000');
  await page.getByRole('textbox', { name: 'Quantity' }).fill('1');
  await page.locator('input[type="button"]').first().click();

  // Row 2
  await page.getByRole('textbox', { name: 'Product Price' }).nth(1).fill('2000');
  await page.getByRole('textbox', { name: 'Label' }).nth(1).fill('$ 2000');
  await page.getByRole('textbox', { name: 'Quantity' }).nth(1).fill('1');
  await page.locator('input[type="button"]').nth(2).click();

  // Row 3
  await page.getByRole('textbox', { name: 'Product Price' }).nth(2).fill('3000');
  await page.getByRole('textbox', { name: 'Label' }).nth(2).fill('$ 3000');
  await page.getByRole('textbox', { name: 'Quantity' }).nth(2).fill('1');

  await page.getByRole('textbox', { name: 'Please Enter success message' }).fill(testConfig.formData.successMessage);
  await page.getByRole('checkbox', { name: 'Enable terms and conditions' }).check();
  await page.getByRole('textbox', { name: 'Please Enter Label' }).fill(testConfig.formData.termsLabel);
  await page.getByRole('textbox', { name: 'Please Enter url for user' }).fill(testConfig.formData.termsUrl);

  const shortcode = await page.locator('h4').textContent();

  if (currency === 'dollar') {
    await page.getByRole('radio', { name: 'Currency Symbol (e.x: $)' }).check();
  } else if (currency === 'none') {
    await page.getByRole('radio', { name: 'No code/Symbol' }).check();
  }

  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  return shortcode;
}










// Create donation recurring form with any layout (custom, dropdown, radio, tabular)
export async function DonationcreateformRecurring(page, options = {}) {
  const { 
    currency, 
    layout = 'custom', // 'custom', 'dropdown', 'radio', 'tabular'
    title = 'Donation Recurring',
    description = 'This is the Donation Recurring Form',
    subscriptionCycle = 'WEEKLY',
    subscriptionLength = '2',
    // For custom layout
    amount1 = '1000',
    amount2 = '2000', 
    amount3 = '3000',
    amount4 = '4000',
    minAmount = '10000',
    maxAmount = '100000',
    // For dropdown/radio/tabular layouts
    options: layoutOptions = [
      { price: '1000', label: 'Mobile' },
      { price: '2000', label: 'Laptop' },
      { price: '3000', label: 'Bike' },
      { price: '4000', label: 'Car' }
    ]
  } = options;

  await page.getByRole('link', { name: 'WP EASY PAY', exact: true }).click();
  await page.getByLabel('Main menu', { exact: true }).getByRole('link', { name: 'Create Payment Form' }).click();
  await page.getByRole('checkbox', { name: 'Use Global Settings' }).check();
  await page.getByText('Form settings').click();

  await page.getByRole('textbox', { name: 'please enter title' }).click();
  await page.getByRole('textbox', { name: 'please enter title' }).fill(title);
  await page.getByRole('textbox', { name: 'Please Enter description' }).click();
  await page.getByRole('textbox', { name: 'Please Enter description' }).fill(description);

  // Select Donation Recurring payment type
  await page.getByRole('radio', { name: 'Donation Recurring' }).check();
  
  // Set subscription cycle and length
  await page.locator('select[name="wpep_subscription_cycle"]').selectOption(subscriptionCycle);
  await page.locator('select[name="wpep_subscription_length"]').selectOption(subscriptionLength);
  
  // Handle different layouts
  if (layout === 'custom') {
    // Custom layout - fill amount fields directly
    await page.locator('#doller1').click();
    await page.locator('#doller1').fill(amount1);
    await page.locator('#doller2').click();
    await page.locator('#doller2').fill(amount2);
    await page.locator('#doller3').click();
    await page.locator('#doller3').fill(amount3);
    await page.locator('#doller4').click();
    await page.locator('#doller4').fill(amount4);
    
    // Enable other amount field
    await page.getByRole('checkbox', { name: 'Enable other amount field on' }).check();
    await page.getByRole('textbox', { name: 'Min amount' }).click();
    await page.getByRole('textbox', { name: 'Min amount' }).fill(minAmount);
    await page.getByRole('textbox', { name: 'Max amount' }).click();
    await page.getByRole('textbox', { name: 'Max amount' }).fill(maxAmount);
    
  } else if (layout === 'dropdown') {
    // Dropdown layout
    await page.locator('select[name="wpep_square_amount_type"]').selectOption('payment_drop');
    await page.waitForTimeout(2000);
    
    // Add dropdown options
    for (let i = 0; i < layoutOptions.length; i++) {
      const option = layoutOptions[i];
      
      if (i > 0) {
        await page.locator('#amountInDropInputs a').filter({ hasText: 'Add' }).nth(i - 1).click();
      }
      
      const priceInput = page.getByRole('textbox', { name: 'Price' }).nth(i);
      const labelInput = page.getByRole('textbox', { name: 'Label', exact: true }).nth(i);
      
      await priceInput.click();
      await priceInput.fill(option.price);
      await labelInput.click();
      await labelInput.fill(option.label);
    }
    
  } else if (layout === 'radio') {
    // Radio layout
    await page.locator('select[name="wpep_square_amount_type"]').selectOption('payment_radio');
  
    
    // Add radio options
    for (let i = 0; i < layoutOptions.length; i++) {
      const option = layoutOptions[i];
      
      if (i > 0) {
        await page.locator('#amountInListInputs a').filter({ hasText: 'Add' }).nth(i - 1).click();
      }
      
      const priceInput = page.getByRole('textbox', { name: 'Price' }).nth(i);
      const labelInput = page.getByRole('textbox', { name: 'Label', exact: true }).nth(i);
      
      await priceInput.click();
      await priceInput.fill(option.price);
      await labelInput.click();
      await labelInput.fill(option.label);
    }
    
  } else if (layout === 'tabular') {
    // Tabular layout
    await page.locator('select[name="wpep_square_amount_type"]').selectOption('payment_tabular');
    await page.getByRole('checkbox', { name: 'Enable save card for future' }).check();
    
    // Add tabular options
    for (let i = 0; i < layoutOptions.length; i++) {
      const option = layoutOptions[i];
      
      if (i > 0) {
        await page.locator('input[type="button"]').first().click();
      }
      
      const priceInput = page.getByRole('textbox', { name: 'Product Price' }).nth(i);
      const labelInput = page.getByRole('textbox', { name: 'Label', exact: true }).nth(i);
      const quantityInput = page.getByRole('textbox', { name: 'Quantity' }).nth(i);
      
      await priceInput.click();
      await priceInput.fill(option.price);
      await labelInput.click();
      await labelInput.fill(option.label);
      await quantityInput.click();
      await quantityInput.fill('1');
    }
  }
  
  // Enable save card for future
  await page.getByRole('checkbox', { name: 'Enable save card for future' }).check();
  
  // Success message
  await page.getByRole('textbox', { name: 'Please Enter success message' }).click();
  await page.getByRole('textbox', { name: 'Please Enter success message' }).fill('Your Payment Successfully sent.');
  
  // Terms and conditions
  await page.getByRole('checkbox', { name: 'Enable terms and conditions' }).check();
  await page.getByRole('textbox', { name: 'Please Enter Label' }).click();
  await page.getByRole('textbox', { name: 'Please Enter Label' }).fill('Terms & Condition');
  await page.getByRole('textbox', { name: 'Please Enter url for user' }).click();
  await page.getByRole('textbox', { name: 'Please Enter url for user' }).fill('https://wpeasypay.com/documentation/');

  const shortcode = await page.locator("h4").textContent();
  console.log(shortcode);

  // Currency selection based on option
  if (currency === 'dollar') {
    await page.getByRole('radio', { name: 'Currency Symbol (e.x: $)' }).check();
  } else if (currency === 'usd') {
    await page.getByRole('radio', { name: 'USD' }).check();
  } else if (currency === 'none') {
    await page.getByRole('radio', { name: 'No code/Symbol' }).check();
  }

  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  console.log(`Your donation recurring ${layout} form has been created successfully`);
  return shortcode; // Return shortcode for use in other functions
}








// Create subscription payment form with any layout (custom, dropdown, radio, tabular)
export async function Subscriptioncreateform(page, options = {}) {
  const { 
    currency, 
    layout = 'custom', // 'custom', 'dropdown', 'radio', 'tabular'
    title = 'Subscription Payment',
    description = 'This is the subscription Payment Form',
    enableCoupon = false,
    // For custom layout
    amount1 = '1000',
    amount2 = '2000', 
    amount3 = '3000',
    amount4 = '4000',
    minAmount = '1000',
    maxAmount = '50000',
    // For dropdown/radio/tabular layouts
    options: layoutOptions = [
      { price: '1000', label: 'Mobile' },
      { price: '2000', label: 'Laptop' },
      { price: '3000', label: 'Bike' },
      { price: '4000', label: 'Car' }
    ]
  } = options;

  await page.getByRole('link', { name: 'WP EASY PAY', exact: true }).click();
  await page.getByLabel('Main menu', { exact: true }).getByRole('link', { name: 'Create Payment Form' }).click();
  await page.waitForTimeout(2000);
  await page.getByText('Square account settings').click();
  await page.getByRole('checkbox', { name: 'Use Global Settings' }).check();
  await page.waitForTimeout(2000);
  await page.getByText('Form settings').click();

  await page.getByRole('textbox', { name: 'please enter title' }).click();
  await page.getByRole('textbox', { name: 'please enter title' }).fill(title);
  await page.getByRole('textbox', { name: 'Please Enter description' }).click();
  await page.getByRole('textbox', { name: 'Please Enter description' }).fill(description);

  // Select Subscription Payment type
  await page.getByRole('radio', { name: 'Subscription Payment' }).check();
  
  // Enable coupon if requested
  if (enableCoupon) {
    await page.getByRole('checkbox', { name: 'Enable Coupon on my form' }).check();
  }
  
  // Handle different layouts
  if (layout === 'custom') {
    // Custom layout - fill amount fields directly
    await page.locator('#doller1').click();
    await page.locator('#doller1').fill(amount1);
    await page.locator('#doller2').click();
    await page.locator('#doller2').fill(amount2);
    await page.locator('#doller3').click();
    await page.locator('#doller3').fill(amount3);
    await page.locator('#doller4').click();
    await page.locator('#doller4').fill(amount4);
    
    // Enable other amount field
    await page.getByRole('checkbox', { name: 'Enable other amount field on' }).check();
    await page.getByRole('textbox', { name: 'Min amount' }).click();
    await page.getByRole('textbox', { name: 'Min amount' }).fill(minAmount);
    await page.getByRole('textbox', { name: 'Max amount' }).click();
    await page.getByRole('textbox', { name: 'Max amount' }).fill(maxAmount);
    
  } else if (layout === 'dropdown') {
    // Dropdown layout
    await page.locator('select[name="wpep_square_amount_type"]').selectOption('payment_drop');
    await page.waitForTimeout(2000);
    
    // Add dropdown options
    for (let i = 0; i < layoutOptions.length; i++) {
      const option = layoutOptions[i];
      
      if (i > 0) {
        await page.locator('#amountInDropInputs a').filter({ hasText: 'Add' }).nth(i - 1).click();
      }
      
      const priceInput = page.getByRole('textbox', { name: 'Price' }).nth(i);
      const labelInput = page.getByRole('textbox', { name: 'Label', exact: true }).nth(i);
      
      await priceInput.click();
      await page.waitForTimeout(1000);
      await priceInput.fill(option.price);
      await page.waitForTimeout(1000);
      await labelInput.click();
      await labelInput.fill(option.label);
      await page.waitForTimeout(1000);
    }
    
  } else if (layout === 'radio') {
    // Radio layout
    await page.locator('select[name="wpep_square_amount_type"]').selectOption('payment_radio');
    
    // Add radio options
    for (let i = 0; i < layoutOptions.length; i++) {
      const option = layoutOptions[i];
      
      if (i > 0) {
        await page.locator('#amountInListInputs a').filter({ hasText: 'Add' }).nth(i - 1).click();
      }
      
      const priceInput = page.getByRole('textbox', { name: 'Price' }).nth(i);
      const labelInput = page.getByRole('textbox', { name: 'Label', exact: true }).nth(i);
      
      await priceInput.click();
      await priceInput.fill(option.price);
      await labelInput.click();
      await labelInput.fill(option.label);
    }
    
  } else if (layout === 'tabular') {
    // Tabular layout
    await page.locator('select[name="wpep_square_amount_type"]').selectOption('payment_tabular');
    
    // Add tabular options
    for (let i = 0; i < layoutOptions.length; i++) {
      const option = layoutOptions[i];
      
      if (i > 0) {
        await page.locator('input[type="button"]').first().click();
      }
      
      const priceInput = page.getByRole('textbox', { name: 'Product Price' }).nth(i);
      const labelInput = page.getByRole('textbox', { name: 'Label', exact: true }).nth(i);
      const quantityInput = page.getByRole('textbox', { name: 'Quantity' }).nth(i);
      
      await priceInput.click();
      await priceInput.fill(option.price);
      await labelInput.click();
      await labelInput.fill(option.label);
      await quantityInput.click();
      await quantityInput.fill('1');
    }
  }
  
  // Enable save card for future
  await page.getByRole('checkbox', { name: 'Enable save card for future' }).check();
  
  // Success message
  await page.getByRole('textbox', { name: 'Please Enter success message' }).click();
  await page.getByRole('textbox', { name: 'Please Enter success message' }).fill('Your Payment Successfully sent.');
  
  // Terms and conditions
  await page.getByRole('checkbox', { name: 'Enable terms and conditions' }).check();
  await page.getByRole('textbox', { name: 'Please Enter Label' }).click();
  await page.getByRole('textbox', { name: 'Please Enter Label' }).fill('Terms & Condition');
  await page.getByRole('textbox', { name: 'Please Enter url for user' }).click();
  await page.getByRole('textbox', { name: 'Please Enter url for user' }).fill('https://wpeasypay.com/documentation/');

  const shortcode = await page.locator("h4").textContent();
  console.log(shortcode);

  // Currency selection based on option
  if (currency === 'dollar') {
    await page.getByRole('radio', { name: 'Currency Symbol (e.x: $)' }).check();
  } else if (currency === 'usd') {
    await page.getByRole('radio', { name: 'USD' }).check();
  } else if (currency === 'none') {
    await page.getByRole('radio', { name: 'No code/Symbol' }).check();
  }

  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  console.log(`Your subscription ${layout} form has been created successfully`);
  return shortcode; // Return shortcode for use in other functions
}









// Function to add a page with shortcode
export async function addpage(page, shortcode, title = 'Sufiyan') {
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Pages', exact: true }).click();
  await page.getByLabel('Main menu', { exact: true }).getByRole('link', { name: 'Add Page' }).click();
  await page.goto(testConfig.urls.page);
  await page.waitForTimeout(5000);
  await expect(page.locator('div').filter({ hasText: 'Choose a patternEvent' }).first()).toBeVisible();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('textbox', { name: 'Add title' }).click();
  await page.getByRole('textbox', { name: 'Add title' }).fill(title);
  await page.getByRole('button', { name: 'Add default block' }).click();
  await page.getByRole('document', { name: 'Empty block; start writing or' }).fill('/shortcode');
  await page.getByRole('option', { name: 'Shortcode' }).click();
  await page.getByRole('textbox', { name: 'Shortcode text' }).fill(shortcode);
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await page.getByLabel('Editor publish').getByRole('button', { name: 'Publish', exact: true }).click();
  await page.getByLabel('Editor publish').getByRole('link', { name: 'View Page' }).click();
  console.log('Your page has been added successfully');
}








// Function to submit form
export async function CustomFormSubmit(page, options = {}) {
  const { currency } = options; // required: 'dollar' | 'usd' | 'none'
  await page.waitForTimeout(2000);
  await page.locator('input[name="wpep-first-name-field"]').click();
  await page.locator('input[name="wpep-first-name-field"]').fill(testConfig.paymentData.firstName);
  await page.waitForTimeout(1000);
  await page.locator('input[name="wpep-last-name-field"]').click();
  await page.locator('input[name="wpep-last-name-field"]').fill(testConfig.paymentData.lastName);
  await page.waitForTimeout(1000);
  await page.locator('input[name="wpep-email-field"]').click();
  await page.locator('input[name="wpep-email-field"]').fill(testConfig.paymentData.email);
  await page.waitForTimeout(1000);
  await page.getByText("Other").click();
  const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput.click();
  await page.waitForTimeout(1000);
  await otherAmountInput.fill(testConfig.paymentData.amount);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'Card number' }).fill(testConfig.paymentData.cardNumber);
  await page.waitForTimeout(2000);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill(testConfig.paymentData.expiry);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill(testConfig.paymentData.cvv);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'ZIP' }).fill(testConfig.paymentData.zip);
  await page.getByRole('checkbox', { name: 'Save card for later use' }).check();
  await page.getByRole('checkbox', { name: 'I accept the' }).check();

  let submittedAmount = '';

  if (currency === 'dollar') {
    await expect(page.getByRole('button', { name: 'Pay $' })).toBeVisible();
    const amountSymbol = await page.locator('small.display[id^="amount_display_"]').first().textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    const amountLocator = page.locator('small.display[id^="amount_display_"]');
    await expect(amountLocator).not.toContainText('USD');
    await expect(amountLocator).toContainText('$');
    await page.getByRole('button', { name: 'Pay $' }).click();
  } else if (currency === 'usd') {
    await expect(page.getByRole('button', { name: 'USD' })).toBeVisible();
    const amountSymbol = await page.locator('small.display[id^="amount_display_"]').first().textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    const amountLocator = page.locator('small.display[id^="amount_display_"]');
    await expect(amountLocator).not.toContainText('$');
    await expect(amountLocator).toContainText('USD');
    await page.getByRole('button', { name: 'USD' }).click();
  } else {
    await expect(page.getByRole('button', { name: 'Pay' })).toBeVisible();
    const amountSymbol = await page.locator('small.display[id^="amount_display_"]').first().textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    const amountLocator = page.locator('small.display[id^="amount_display_"]');
    await expect(amountLocator).not.toContainText('$');
    await expect(amountLocator).not.toContainText('USD');
    await page.getByRole('button', { name: 'Pay' }).click();
    await page.waitForTimeout(3000);
  }

  // if (verifyWithSquare && submittedAmount) {
  //   await checkSquareTransaction(page, submittedAmount);
  // }
  return submittedAmount;
}








// Function to submit custom popup + multistep flow
export async function submitFormCustomPopupMultistep(page, options = {}) {
  const { currency, popupButtonText } = options;

  if (popupButtonText) {
    await expect(page.getByRole('button', { name: popupButtonText })).toBeVisible();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: popupButtonText }).click();
  } else {
    await page.locator("button[type='button']").first().click();
  }

  await page.locator('input[name="wpep-first-name-field"]').click();
  await page.locator('input[name="wpep-first-name-field"]').fill('Muhammad');
  await page.locator('input[name="wpep-last-name-field"]').click();
  await page.locator('input[name="wpep-last-name-field"]').fill('Sufiyan');
  await page.locator('input[name="wpep-email-field"]').click();
  await page.locator('input[name="wpep-email-field"]').fill('sufi@09.com');
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Next' }).click();
  await page.getByText('Other').click();
  await page.getByPlaceholder('Enter your amount 10 -').click();
  await page.getByPlaceholder('Enter your amount 10 -').fill('1000');

  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'Card number' }).fill('4111 1111 1111 1111');
  await page.waitForTimeout(2000);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill('11/29');
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill('321');
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'ZIP' }).fill('43523');
  await page.getByRole('checkbox', { name: 'Save card for later use' }).check();
  await page.getByRole('checkbox', { name: 'I accept the' }).check();

  let submittedAmount = '';

  if (currency === 'dollar') {
    await expect(page.getByRole('button', { name: 'Pay $' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('USD');
    await expect(amount).toContainText('$');
    await page.getByRole('button', { name: 'Pay $' }).click();
    await page.waitForTimeout(3000);
  } else if (currency === 'usd') {
    await expect(page.getByRole('button', { name: 'USD' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('$');
    await expect(amountSymbol).toContainText('USD');
    await page.getByRole('button', { name: 'USD' }).click();
    await page.waitForTimeout(3000);
  } else {
    await expect(page.getByRole('button', { name: 'Pay' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('$');
    await expect(amountSymbol).not.toContainText('USD');
    await page.getByRole('button', { name: 'Pay' }).click();
    await page.waitForTimeout(3000);
  }

  return submittedAmount;
}








// Submit: Dropdown

export async function submitFormDropdown(page, options = {}) {
	const { currency } = options;
  await page.waitForTimeout(2000);
	await page.locator('input[name="wpep-first-name-field"]').click();
	await page.locator('input[name="wpep-first-name-field"]').fill('Muhammad');
	await page.locator('input[name="wpep-last-name-field"]').click();
	await page.locator('input[name="wpep-last-name-field"]').fill('Sufiyan');
	await page.locator('input[name="wpep-email-field"]').click();
	await page.locator('input[name="wpep-email-field"]').fill('sufi@09.com');
	await page.getByText('$ 100').nth(1).click();
	await page.waitForTimeout(2000);
	await page.locator('span').filter({ hasText: '$ 200' }).click();
	await page.waitForTimeout(2000);
	await page.locator("//div[@id='increase']").click();
	await page.waitForTimeout(2000);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'Card number' }).fill(testConfig.paymentData.cardNumber);
  await page.waitForTimeout(2000);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill(testConfig.paymentData.expiry);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill(testConfig.paymentData.cvv);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'ZIP' }).fill(testConfig.paymentData.zip);
	await page.getByRole('checkbox', { name: 'Save card for later use' }).check();
	await page.getByRole('checkbox', { name: 'I accept the' }).check();

	let submittedAmount = '';

    if (currency === 'dollar') {
      await expect(page.getByRole('button', { name: 'Pay $' })).toBeVisible();
      const amount = page.locator('small.display[id^="amount_display_"]').first();
      const amountSymbol = await amount.textContent();
      submittedAmount = amountSymbol;
      console.log(`This is the Total Amount : ${amountSymbol}`);
      await page.getByRole('button', { name: 'Pay $' }).click();
      await page.waitForTimeout(3000);
    } else if (currency === 'usd') {
      await expect(page.getByRole('button', { name: 'USD' })).toBeVisible();
      const amount = page.locator('small.display[id^="amount_display_"]').first();
      const amountSymbol = await amount.textContent();
      submittedAmount = amountSymbol;
      console.log(`This is the Total Amount : ${amountSymbol}`);
      await page.getByRole('button', { name: 'USD' }).click();
      await page.waitForTimeout(3000);
    } else {
      await expect(page.getByRole('button', { name: 'Pay' })).toBeVisible();
      const amount = page.locator('small.display[id^="amount_display_"]').first();
      const amountSymbol = await amount.textContent();
      submittedAmount = amountSymbol;
      console.log(`This is the Total Amount : ${amountSymbol}`);
      await page.getByRole('button', { name: 'Pay' }).click();
      await page.waitForTimeout(3000);
    }

  return submittedAmount;
}







// Submit: Radio
export async function submitFormRadio(page, options = {}) {
	const { currency } = options;
  await page.waitForTimeout(2000);
	await page.locator('input[name="wpep-first-name-field"]').click();
	await page.locator('input[name="wpep-first-name-field"]').fill('Muhammad');
	await page.locator('input[name="wpep-last-name-field"]').click();
	await page.locator('input[name="wpep-last-name-field"]').fill('Sufiyan');
	await page.locator('input[name="wpep-email-field"]').click();
	await page.locator('input[name="wpep-email-field"]').fill('sufi@09.com');
	await page.waitForTimeout(1000);
	await page.getByRole('radio', { name: '$ 300' }).check();
	await page.waitForTimeout(1000);
	await page.locator('#increase').click();
	await page.waitForTimeout(1000);
	await page.locator('#increase').click();
	await page.waitForTimeout(2000);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'Card number' }).fill(testConfig.paymentData.cardNumber);
  await page.waitForTimeout(2000);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill(testConfig.paymentData.expiry);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill(testConfig.paymentData.cvv);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'ZIP' }).fill(testConfig.paymentData.zip);
	await page.getByRole('checkbox', { name: 'Save card for later use' }).check();
	await page.getByRole('checkbox', { name: 'I accept the' }).check();

  let submittedAmount = '';

  if (currency === 'dollar') {
    await expect(page.getByRole('button', { name: 'Pay $' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('USD');
    await expect(amount).toContainText('$');
    await page.getByRole('button', { name: 'Pay $' }).click();
    await page.waitForTimeout(3000);
  } else if (currency === 'usd') {
    await expect(page.getByRole('button', { name: 'USD' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('$ , USD');
    await page.getByRole('button', { name: 'USD' }).click();
    await page.waitForTimeout(3000);
  } else {
    await expect(page.getByRole('button', { name: 'Pay' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('$ , USD');
    await page.getByRole('button', { name: 'Pay' }).click();
    await page.waitForTimeout(3000);
  }
  
  return submittedAmount;
}







// Submit: Tabular 
export async function submitFormTabular(page, options = {}) {
	const { currency } = options;

	await page.waitForTimeout(2000);
	await page.locator('input[name="wpep-first-name-field"]').click();
	await page.locator('input[name="wpep-first-name-field"]').fill('Testing');
	await page.locator('input[name="wpep-last-name-field"]').click();
	await page.locator('input[name="wpep-last-name-field"]').fill('QA');
	await page.locator('input[name="wpep-email-field"]').click();
	await page.locator('input[name="wpep-email-field"]').fill('piqom@mailinator.com');
	await page.waitForTimeout(2000);
	await page.locator('.fa').first().click();
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'Card number' }).fill(testConfig.paymentData.cardNumber);
  await page.waitForTimeout(2000);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill(testConfig.paymentData.expiry);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill(testConfig.paymentData.cvv);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'ZIP' }).fill(testConfig.paymentData.zip);
	await page.getByRole('checkbox', { name: 'I accept the' }).check();

  let submittedAmount = '';

  if (currency === 'dollar') {
    await expect(page.getByRole('button', { name: 'Pay $' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('USD');
    await expect(amount).toContainText('$');
    await page.getByRole('button', { name: 'Pay $' }).click();
    await page.waitForTimeout(3000);
  } else if (currency === 'usd') {
    await expect(page.getByRole('button', { name: 'USD' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('$');
    await expect(amountSymbol).toContainText('USD');
    await page.getByRole('button', { name: 'USD' }).click();
    await page.waitForTimeout(3000);
  } else {
    await expect(page.getByRole('button', { name: 'Pay' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('$');
    await expect(amount).not.toContainText('USD');
    await page.getByRole('button', { name: 'Pay' }).click();
    await page.waitForTimeout(3000);
  }

  return submittedAmount;
} 






//Submit: Donation With custom layout
export async function submitDonationFormCustom(page, options = {}) {
  const { currency, otherAmount = '15000', couponCode, saveCard = false } = options;

  await page.waitForTimeout(3000);
  await page.locator('input[name="wpep-first-name-field"]').click();
  await page.locator('input[name="wpep-first-name-field"]').fill('Sufiyan');
  await page.locator('input[name="wpep-last-name-field"]').click();
  await page.locator('input[name="wpep-last-name-field"]').fill('Testing');
  await page.locator('input[name="wpep-email-field"]').click();
  await page.locator('input[name="wpep-email-field"]').fill('sufi@09.com');
  await page.waitForTimeout(3000);
  await page.getByText('Other').click();
  const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
  await otherAmountInput.click();
  await page.waitForTimeout(500);
  await otherAmountInput.fill(otherAmount);

  // Apply coupon if provided
  if (couponCode) {
    await page.locator('input[name="wpep-coupon"]').click();
    await page.locator('input[name="wpep-coupon"]').fill(couponCode);
    await page.getByRole('button', { name: 'Apply' }).click();

  }

  // Card details inside Square iframe
  const cardFrame = page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame();
  await cardFrame.getByRole('textbox', { name: 'Card number' }).click();
  await cardFrame.getByRole('textbox', { name: 'Card number' }).fill(testConfig.paymentData.cardNumber);
  await cardFrame.getByRole('textbox', { name: 'MM/YY' }).fill(testConfig.paymentData.expiry);
  await cardFrame.getByRole('textbox', { name: 'CVV' }).fill(testConfig.paymentData.cvv);
  await cardFrame.getByRole('textbox', { name: 'ZIP' }).fill(testConfig.paymentData.zip);

  if (saveCard) {
    await page.getByRole('checkbox', { name: 'Save card for later use' }).check();
  }

  await page.getByRole('checkbox', { name: 'I accept the' }).check();
  await page.waitForTimeout(2000);

  let submittedAmount = '';

  if (currency === 'dollar') {
    await expect(page.getByRole('button', { name: 'Pay $' })).toBeVisible();
    await page.waitForTimeout(2000);
    const amount = page.locator('small.display[id^="amount_display_"]');
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('USD');
    await expect(amount).toContainText('$');
    await page.getByRole('button', { name: 'Pay $' }).click();
    await page.waitForTimeout(3000);
  } else if (currency === 'usd') {
    await expect(page.getByRole('button', { name: 'USD' })).toBeVisible();
    await page.waitForTimeout(2000);
    const amount = page.locator('small.display[id^="amount_display_"]');
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('$');
    await expect(amount).toContainText('USD');
    await page.getByRole('button', { name: 'USD' }).click();
    await page.waitForTimeout(3000);
  } else {
    await expect(page.getByRole('button', { name: 'Pay' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]');
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('$');
    await expect(amount).not.toContainText('USD');
    await page.getByRole('button', { name: 'Pay' }).click();
    await page.waitForTimeout(3000);
  }

  return submittedAmount;
}








// Submit: Donation with Dropdown
export async function submitDonationFormDropdown(page, options = {}) {
  const { currency } = options;

  await page.waitForTimeout(3000);
  await page.locator('input[name="wpep-first-name-field"]').click();
  await page.locator('input[name="wpep-first-name-field"]').fill('Sufiyan');
  await page.locator('input[name="wpep-last-name-field"]').click();
  await page.locator('input[name="wpep-last-name-field"]').fill('Testing');
  await page.locator('input[name="wpep-email-field"]').click();
  await page.locator('input[name="wpep-email-field"]').fill('sufi@09.com');

  // Pick dropdown value and increase quantity
  await page.getByText('$ 100').nth(1).click();
  await page.waitForTimeout(1000);
  await page.locator('span').filter({ hasText: '$ 300' }).click();
  await page.waitForTimeout(1000);
  await page.locator("//div[@id='increase']").click();

  // Card details
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'Card number' }).fill(testConfig.paymentData.cardNumber);
  await page.waitForTimeout(1000);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill(testConfig.paymentData.expiry);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill(testConfig.paymentData.cvv);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'ZIP' }).fill(testConfig.paymentData.zip);

  await page.getByRole('checkbox', { name: 'I accept the' }).check();

  let submittedAmount = '';

  if (currency === 'dollar') {
    await expect(page.getByRole('button', { name: 'Pay $' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${submittedAmount}`);
    await page.getByRole('button', { name: 'Pay $' }).click();
    await page.waitForTimeout(3000);
  } else if (currency === 'usd') {
    await expect(page.getByRole('button', { name: 'USD' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${submittedAmount}`);
    await page.getByRole('button', { name: 'USD' }).click();
    await page.waitForTimeout(3000);
  } else {
    await expect(page.getByRole('button', { name: 'Pay' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${submittedAmount}`);
    await page.getByRole('button', { name: 'Pay' }).click();
    await page.waitForTimeout(3000);
  }

  return submittedAmount;
}







// Submit: Donation with Radio
export async function submitDonationFormRadio(page, options = {}) {
  const { currency } = options;

  await page.waitForTimeout(3000);
  await page.locator('input[name="wpep-first-name-field"]').click();
  await page.locator('input[name="wpep-first-name-field"]').fill('Sufiyan');
  await page.locator('input[name="wpep-last-name-field"]').click();
  await page.locator('input[name="wpep-last-name-field"]').fill('Testing');
  await page.locator('input[name="wpep-email-field"]').click();
  await page.locator('input[name="wpep-email-field"]').fill('sufi@09.com');

  // Choose a radio option and increase quantity
  await page.getByRole('radio', { name: '$ 4000' }).check();
  await page.waitForTimeout(1000);
  await page.locator('#increase').click();
  await page.waitForTimeout(1000);

  // Card details
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'Card number' }).fill(testConfig.paymentData.cardNumber);
  await page.waitForTimeout(1000);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill(testConfig.paymentData.expiry);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill(testConfig.paymentData.cvv);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'ZIP' }).fill(testConfig.paymentData.zip);

  await page.getByRole('checkbox', { name: 'I accept the' }).check();

  let submittedAmount = '';

  if (currency === 'dollar') {
    await expect(page.getByRole('button', { name: 'Pay $' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]');
    const amountSymbol = await amount.textContent();
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('USD');
    await expect(amount).toContainText('$');
    await page.getByRole('button', { name: 'Pay $' }).click();
    await page.waitForTimeout(3000);
  } else if (currency === 'usd') {
    await expect(page.getByRole('button', { name: 'USD' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]');
    const amountSymbol = await amount.textContent();
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('USD');
    await expect(amount).toContainText('USD');
    await page.getByRole('button', { name: 'USD' }).click();
    await page.waitForTimeout(3000);
  } else {
    await expect(page.getByRole('button', { name: 'Pay' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]');
    const amountSymbol = await amount.textContent();
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('USD');
    await expect(amount).not.toContainText('USD');
    await page.getByRole('button', { name: 'Pay' }).click();
    await page.waitForTimeout(3000);
  }

  return submittedAmount;
}










// Submit: Donation with Tabular
export async function submitDonationFormTabular(page, options = {}) {
  const { currency } = options;

  await page.waitForTimeout(2000);
  await page.locator('input[name="wpep-first-name-field"]').click();
  await page.locator('input[name="wpep-first-name-field"]').fill('Testing');
  await page.locator('input[name="wpep-last-name-field"]').click();
  await page.locator('input[name="wpep-last-name-field"]').fill('QA');
  await page.locator('input[name="wpep-email-field"]').click();
  await page.locator('input[name="wpep-email-field"]').fill('piqom@mailinator.com');
  await page.waitForTimeout(2000);
  await page.locator('.fa').first().click();

  // Card fields
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'Card number' }).fill(testConfig.paymentData.cardNumber);
  await page.waitForTimeout(2000);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'MM/YY' }).fill(testConfig.paymentData.expiry);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'CVV' }).fill(testConfig.paymentData.cvv);
  await page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame().getByRole('textbox', { name: 'ZIP' }).fill(testConfig.paymentData.zip);
  await page.getByRole('checkbox', { name: 'I accept the' }).check();

  let submittedAmount = '';

  if (currency === 'dollar') {
    await expect(page.getByRole('button', { name: 'Pay $' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${submittedAmount}`);
    await page.getByRole('button', { name: 'Pay $' }).click();
    await page.waitForTimeout(3000);
  } else if (currency === 'usd') {
    await expect(page.getByRole('button', { name: 'USD' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${submittedAmount}`);
    await page.getByRole('button', { name: 'USD' }).click();
    await page.waitForTimeout(3000);
  } else {
    await expect(page.getByRole('button', { name: 'Pay' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]').first();
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${submittedAmount}`);
    await page.getByRole('button', { name: 'Pay' }).click();
    await page.waitForTimeout(3000);
  }

  return submittedAmount;
}












// Submit: Donation Recurring with any layout (custom, dropdown, radio, tabular)
export async function submitDonationFormRecurring(page, options = {}) {
  const { 
    currency, 
    layout = 'custom',
    selectedOption = 'Mobile', 
    secondOption = 'Bike',
    otherAmount = '50000'
  } = options;

  await page.waitForTimeout(5000);
  
  // Fill form fields
  await page.locator('input[name="wpep-first-name-field"]').click();
  await page.locator('input[name="wpep-first-name-field"]').fill('Muhammad');
  await page.locator('input[name="wpep-last-name-field"]').click();
  await page.locator('input[name="wpep-last-name-field"]').fill('Sufiyan');
  await page.locator('input[name="wpep-email-field"]').click();
  await page.locator('input[name="wpep-email-field"]').fill('Sufiyan19@gmail.com');
  
  // Check for recurring donation frequency visibility
  await expect(page.getByText('Weekly Last till 2 – Weeks')).toBeVisible();
  console.log('Weekly Last till 2 – Weeks text is visible');
  
  // Check if the page contains the recurring donation text
  await expect(page.locator('body')).toContainText('Weekly Last till 2 – Weeks');
  console.log('Page contains Weekly Last till 2 – Weeks text');
  
  // Handle different layouts
  if (layout === 'custom') {
    // Custom layout - select "Other" amount
    await page.getByText('Other').click();
    const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
    await otherAmountInput.click();
    await page.waitForTimeout(500);
    await otherAmountInput.fill(otherAmount);
    
  } else if (layout === 'dropdown') {
    // Dropdown layout - select options
    await page.getByText(selectedOption).nth(1).click();
    await page.locator('span').filter({ hasText: secondOption }).click();
    
  } else if (layout === 'radio') {
    // Radio layout - select radio option
    await page.getByRole('radio', { name: selectedOption }).check();
    
  } else if (layout === 'tabular') {
    // Tabular layout - select tabular option
    await page.locator('.fa').first().click();
  }

  // Card details inside Square iframe
  const cardFrame = page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame();
  await cardFrame.getByRole('textbox', { name: 'Card number' }).click();
  await cardFrame.getByRole('textbox', { name: 'Card number' }).fill(testConfig.paymentData.cardNumber);
  await cardFrame.getByRole('textbox', { name: 'MM/YY' }).fill(testConfig.paymentData.expiry);
  await cardFrame.getByRole('textbox', { name: 'CVV' }).fill(testConfig.paymentData.cvv);
  await cardFrame.getByRole('textbox', { name: 'ZIP' }).fill(testConfig.paymentData.zip);

  await page.getByRole('checkbox', { name: 'Save card for later use' }).check();
  await page.getByRole('checkbox', { name: 'I accept the' }).check();
  await page.waitForTimeout(2000);

  let submittedAmount = '';

  if (currency === 'dollar') {
    await expect(page.getByRole('button', { name: 'Pay $' })).toBeVisible();
    await page.waitForTimeout(2000);
    const amount = page.locator('small.display[id^="amount_display_"]');
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('USD');
    await expect(amount).toContainText('$');
    await page.getByRole('button', { name: 'Pay $' }).click();
    await page.waitForTimeout(3000);
  } else if (currency === 'usd') {
    await expect(page.getByRole('button', { name: 'USD' })).toBeVisible();
    await page.waitForTimeout(2000);
    const amount = page.locator('small.display[id^="amount_display_"]');
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('$');
    await expect(amount).toContainText('USD');
    await page.getByRole('button', { name: 'USD' }).click();
    await page.waitForTimeout(3000);
  } else {
    await expect(page.getByRole('button', { name: 'Pay' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]');
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('$');
    await expect(amount).not.toContainText('USD');
    await page.getByRole('button', { name: 'Pay' }).click();
    await page.waitForTimeout(3000);
  }

  return submittedAmount;
}












// Submit: Subscription Payment with any layout (custom, dropdown, radio, tabular)
export async function submitSubscriptionForm(page, options = {}) {
  const { 
    currency, 
    layout = 'custom',
    selectedOption = 'Mobile', 
    secondOption = 'Bike',
    otherAmount = '9500',
    couponCode = null // No default coupon code
  } = options;

  await page.waitForTimeout(5000);
  
  // Fill form fields
  await page.locator('input[name="wpep-first-name-field"]').click();
  await page.locator('input[name="wpep-first-name-field"]').fill('Muhammad');
  await page.locator('input[name="wpep-last-name-field"]').click();
  await page.locator('input[name="wpep-last-name-field"]').fill('Sufiyan');
  await page.locator('input[name="wpep-email-field"]').click();
  await page.locator('input[name="wpep-email-field"]').fill('Sufiyan@gmail.com');
  
  // Check for subscription frequency visibility
  await expect(page.getByText('Daily Last till 1 – Days')).toBeVisible();
  console.log('Daily Last till 1 – Days text is visible');
  
  // Check if the page contains the subscription text
  await expect(page.locator('body')).toContainText('Daily Last till 1 – Days');
  console.log('Page contains Daily Last till 1 – Days text');
  
  // Handle different layouts
  if (layout === 'custom') {
    // Custom layout - select "Other" amount
    await page.getByText('Other').click();
    const otherAmountInput = page.locator('[placeholder^="Enter your amount"]');
    await otherAmountInput.click();
    await page.waitForTimeout(500);
    await otherAmountInput.fill(otherAmount);
    
  } else if (layout === 'dropdown') {
    // Dropdown layout - select options
    await page.getByText(selectedOption).nth(1).click();
    await page.waitForTimeout(1000);
    await page.locator('span').filter({ hasText: secondOption }).click();
    await page.waitForTimeout(1000);
  } else if (layout === 'radio') {
    // Radio layout - select radio option
    await page.getByRole('radio', { name: selectedOption }).check();
    await page.waitForTimeout(1000);
    await page.waitForTimeout(1000);
  } else if (layout === 'tabular') {
    // Tabular layout - select tabular option
    await page.locator('.fa').first().click();
    await page.waitForTimeout(1000);
  }

  // Apply coupon if provided
  if (couponCode) {
    await page.locator('input[name="wpep-coupon"]').click();
    await page.waitForTimeout(1000);
    await page.locator('input[name="wpep-coupon"]').fill(couponCode);
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.waitForTimeout(2000);
    await expect(page.getByText('×Congratulation! Coupon')).toBeVisible();
    // Use more flexible locator for coupon success message
    await expect(page.locator('[id*="wpep-coupons"]')).toContainText('×Congratulation! Coupon applied successfully.');
  }

  // Card details inside Square iframe
  const cardFrame = page.locator('//iframe[@title="Secure Credit Card Form"]').contentFrame();
  await cardFrame.getByRole('textbox', { name: 'Card number' }).click();
  await cardFrame.getByRole('textbox', { name: 'Card number' }).fill(testConfig.paymentData.cardNumber);
  await cardFrame.getByRole('textbox', { name: 'MM/YY' }).fill(testConfig.paymentData.expiry);
  await cardFrame.getByRole('textbox', { name: 'CVV' }).fill(testConfig.paymentData.cvv);
  await cardFrame.getByRole('textbox', { name: 'ZIP' }).fill(testConfig.paymentData.zip);
  await page.waitForTimeout(1000);
  await page.getByRole('checkbox', { name: 'Save card for later use' }).check();
  await page.getByRole('checkbox', { name: 'I accept the' }).check();
  await page.waitForTimeout(2000);

  let submittedAmount = '';

  if (currency === 'dollar') {
    await expect(page.getByRole('button', { name: 'Pay $' })).toBeVisible();
    await page.waitForTimeout(2000);
    const amount = page.locator('small.display[id^="amount_display_"]');
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('USD');
    await expect(amount).toContainText('$');
    await page.getByRole('button', { name: 'Pay $' }).click();
    await page.waitForTimeout(3000);
  } else if (currency === 'usd') {
    await expect(page.getByRole('button', { name: 'USD' })).toBeVisible();
    await page.waitForTimeout(2000);
    const amount = page.locator('small.display[id^="amount_display_"]');
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('$');
    await expect(amount).toContainText('USD');
    await page.getByRole('button', { name: 'USD' }).click();
    await page.waitForTimeout(3000);
  } else {
    await expect(page.getByRole('button', { name: 'Pay' })).toBeVisible();
    const amount = page.locator('small.display[id^="amount_display_"]');
    const amountSymbol = await amount.textContent();
    submittedAmount = amountSymbol;
    console.log(`This is the Total Amount : ${amountSymbol}`);
    await expect(amount).not.toContainText('$');
    await expect(amount).not.toContainText('USD');
    await page.getByRole('button', { name: 'Pay' }).click();
    await page.waitForTimeout(3000);
  }

  return submittedAmount;
}







// Function to verify payment success
export async function verifyPaymentSuccess(page) {
  // Wait for the element to be visible first
  await page.waitForSelector('text="Your Payment Successfully sent."', { timeout: 20000 });
  await expect(page.getByText('Your Payment Successfully sent.')).toBeVisible({ timeout: 2000 });
  await expect(page.locator('fieldset')).toContainText('Payment Successful');
  await expect(page.locator('fieldset')).toContainText('Your Payment Successfully sent.');
  console.log("Your Payment is Successfully Sent.  ")
}








// Function to delete a page by name
export async function deletePageByName(page, pageName) {
  await page.goto(testConfig.urls.pages);
  await page.waitForTimeout(1000);

  
  // Delete all pages with the same name by finding and deleting them one by one
  const allPageLinks = page.locator(`//a[normalize-space()='${pageName}']`);
  const totalPageCount = await allPageLinks.count();
  console.log(`Total pages found with name '${pageName}': ${totalPageCount}`);
  
  let pageExists = true;
  while (pageExists) {
    const remainingPageLinks = page.locator(`//a[normalize-space()='${pageName}']`);
    const pageCount = await remainingPageLinks.count();
    console.log(`Remaining pages with name '${pageName}': ${pageCount}`);
    
    if (pageCount > 0) {
      console.log("Page found and will be deleted");
      await page.waitForTimeout(1000);
      await remainingPageLinks.first().hover();
      await page.locator(`//a[contains(@aria-label, 'Move') and contains(@aria-label, '${pageName}') and contains(@aria-label, 'Trash')]`).first().click();
      console.log("Page deleted successfully and moving to Trash now ...  ");
      await page.waitForTimeout(2000);
    } else {
      pageExists = false;
    }
  }
}









// Function to delete a page
export async function deletepage(page) {
  // this is only for delete third page//
  await page.goto(testConfig.urls.pages);
  await page.locator("(//td[@class='title column-title has-row-actions column-primary page-title'])[1]").hover();
  await page.locator(("(//span[@class='trash'])[1]")).click();
  console.log("The Page has been successfully moved to Trash.");
}











 // Function to delete a form by name
export async function deleteform(page, formName = null) {
  await page.goto(testConfig.urls.forms);
  
  if (formName) {
    // Delete all forms with specific name
    const allFormRows = page.locator(`//tr[.//a[normalize-space()='${formName}']]`);
    const totalFormCount = await allFormRows.count();
    console.log(`Total forms found with name '${formName}': ${totalFormCount}`);
    
    let formExists = true;
    while (formExists) {
      const formRow = page.locator(`//tr[.//a[normalize-space()='${formName}']]`).first();
      if (await formRow.count() > 0) {
        const deleteButton = formRow.locator("//a[@title='Delete form'][normalize-space()='Delete']");
        await deleteButton.click();
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.waitForTimeout(2000);
      } else {
        formExists = false;
      }
    }
    console.log(`All forms with name "${formName}" have been successfully deleted.`);
  } else {
    // Delete all forms if no name specified
    let formExists = true;
    while (formExists) {
      const deleteButton = page.locator("//a[@title='Delete form'][normalize-space()='Delete']").first();
      if (await deleteButton.count() > 0) {
        await deleteButton.click();
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.waitForTimeout(2000);
      } else {
        formExists = false;
      }
    }
    console.log(`No forms found with name "${formName}".`);
  }
}








// Take Screenshot if error occurs while running the test
export async function takeScreenshot(page) {

  // Now try to extract the number of logs
const logsCount = await page.locator("a[title='Number of Logs']").textContent();

console.log('Logs Count:', logsCount); // Log the logs count

   if (logsCount !== "Number of Logs (0)") {
      //Click the "Debug Log Manager" tool (adjust the selector if needed)

     await page.getByRole('link', { name: 'Tools', exact: true }).click();
     await page.getByRole('link', { name: 'Debug Log Manager' }).click();
   
      // Wait for the page to load completely before taking the screenshot
      await page.waitForSelector("//div[@id='debug-log_wrapper']");  // Example: Adjust the selector based on the page
  
      // Define the folder path for saving the screenshot (Screenshot folder in Downloads)
      const folderPath = path.join(os.homedir(), 'Downloads', 'Screenshot');
      fs.mkdirSync(folderPath, { recursive: true });
  
      // Take the screenshot and save it
      await page.screenshot({
        path: path.join(folderPath, 'debug_log_screenshot.png'),
      });
  
      console.log('Screenshot saved to', path.join(folderPath, 'debug_log_screenshot.png'));
        await page.getByRole('button', { name: 'Clear Log' }).click();
        await page.goto('https://wppayautomation.instawp.xyz/wp-admin/tools.php?page=debug-log-manager');
     }

     else {
      console.log('No logs found, skipping screenshot.');
    }
}








// Function to check Square transactions (simple, same page, no new tab)
export async function checkSquareTransaction(page, submittedAmount1) {
  // Go to Square login
  await page.goto('https://app.squareup.com/login?app=developer&lang_code=en&return_to=https://developer.squareup.com/console/en/sandbox-test-accounts');
  await page.getByText('Email or phone number').click();
  await page.getByTestId('username-input').fill('sufiyankamran29@gmail.com');
  await page.getByTestId('login-email-next-button').getByRole('button', { name: 'Continue' }).click();
  await page.getByTestId('login-password-input').click();
  await page.getByTestId('login-password-input').fill('Suf@79791');
  await page.getByTestId('login-password-submit-button').getByRole('button', { name: 'Sign in' }).click();
  
  // Click "Remind me next time" button
  await page.locator('[id="2fa-post-login-promo-sms-remind-me-btn"]').getByRole('button', { name: 'Remind me next time' }).click();
  await page.locator('[id="2fa-post-login-promo-opt-out-modal-continue"]').getByRole('button', { name: 'Continue to Square' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByTestId('sandbox-test-accounts-table').locator('a').click();
  const page1 = await page1Promise;
  
  // Maximize the page3 window
  await page1.setViewportSize({ width: 1920, height: 1080 });

  await page1.goto('https://app.squareupsandbox.com/dashboard/');
  await page1.getByRole('paragraph').filter({ hasText: 'Payments & invoices' }).click();
  await page1.getByTestId('sub-level-nav-section-child-transactions').getByText('Transactions').click();

  // Read latest transaction amount and compare
  await page1.locator("(//div[@class='l-transactions__desc-col type-ellipsis'])[1]").click();
  await page1.waitForTimeout(2000);
        // Define the folder path for saving the screenshot (Screenshot folder in Downloads)
        const folderPath = path.join(os.homedir(), 'Downloads', 'Screenshot');
        fs.mkdirSync(folderPath, { recursive: true });
    
        // Take the screenshot and save it
        await page1.screenshot({
          path: path.join(folderPath, 'Square_Invoice_screenshot.png'),
        });
        console.log('Screenshot saved to', path.join(folderPath, 'Square_Invoice_screenshot.png'));
        const latestText = await page1.locator("//div[@class='detail-blade__body']").textContent();
        const locator = await page1.locator("//div[@class='l-pull-right type-tnum type-strong']").textContent();
        const cleanedText = latestText.replace(/\s+/g, ' ') // Replace multiple spaces or line breaks with a single space.trim(); // Remove leading and trailing whitespace
  console.log(`Latest Square Transaction Amount: ${cleanedText}`);
  const Squarevalue = locator.trim(); 
    // Print the text content
  console.log('Text Content:', Squarevalue);

  // Equality check between submitted amount and Square displayed value
  const submittedClean = (submittedAmount1 || '').trim();
  const squareClean = (Squarevalue || '').trim();
  const isEqual = submittedClean === squareClean;
  if (isEqual) {
    console.log(`Match: submittedAmount (${submittedClean}) equals Squarevalue (${squareClean})`);
  } else {
    console.log(`Mismatch: submittedAmount (${submittedClean}) vs Squarevalue (${squareClean})`);
  }
  await page1.close();
  return { match: isEqual, submittedAmount: submittedClean, squareValue: squareClean };
}








// Function to add multiple shortcode blocks to a page
export async function addMultipleShortcodes(page, shortcodes, pageName) {
  await page.goto('https://wppayautomation.instawp.xyz/wp-admin/post-new.php?post_type=page');
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('textbox', { name: 'Add title' }).fill(pageName);
  
  // Add multiple shortcode blocks using the correct Gutenberg approach
  for (let i = 0; i < shortcodes.length; i++) {
    await page.waitForTimeout(1000);
    if (i !==0) {

      await page.getByText('Multi Form Test PageShortcode').click();
    }
    else {
  // Click on empty block
  await page.getByRole('button', { name: 'Add default block' }).click();
  // await page.getByRole('document', { name: 'Empty block; start writing or' }).click();
    }
  
    
    // Type /shortcode to open shortcode option
    await page.getByRole('document', { name: 'Empty block; start writing or' }).fill('/shortcode');
    
    // Click on Shortcode option
    await page.getByRole('option', { name: 'Shortcode' }).click();
    
    // Fill the shortcode text
    await page.getByRole('textbox', { name: 'Shortcode text' }).fill(shortcodes[i]);
    console.log(shortcodes[i]);
    await page.waitForTimeout(1000);
    
  
    
    console.log(`Added shortcode block ${i + 1}: ${shortcodes[i].substring(0, 50)}...`);
    
    // Wait a bit before adding next shortcode
    await page.waitForTimeout(3000);
  }
  
  // Publish page
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  
  console.log(`Page "${pageName}" created with ${shortcodes.length} shortcode blocks`);
}


