import { test, expect } from '@playwright/test';
import { 
  loginToWordPress, 
  createform, 
  addpage, 
  Form_Submit, 
  deletepage, 
  deleteform 
} from './utils/formUtils.js';

test.describe('WordPress Form Tests', () => {
  let shortcode;

  test('Complete form workflow test', async ({ page }) => {
    test.setTimeout(120000);
    
    // Step 1: Login to WordPress
    await loginToWordPress(page, 'xekolohuwu5455', 'TestingQA@79791');
    
    // Step 2: Create a form and get the shortcode
    shortcode = await createform(page);
    expect(shortcode).toBeTruthy();
    
    // Step 3: Add a page with the shortcode
    await addpage(page, shortcode);
    
    // Step 4: Submit the form
    await Form_Submit(page);
  });

  test('Cleanup test - Delete form and page', async ({ page }) => {
    test.setTimeout(60000);
    
    // Login first
    await loginToWordPress(page, 'xekolohuwu5455', 'TestingQA@79791');
    
    // Delete the form
    await deleteform(page);
    
    // Delete the page
    await deletepage(page);
  });
}); 