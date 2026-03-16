import { test, chromium } from '@playwright/test';
import { smartClick } from './healer';

test('AI Self-Healing Demo', async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to a real site (e.g., Google or a demo login page)
  await page.goto('https://www.google.com');

  // INTENTIONALLY USE A WRONG SELECTOR
  // Instead of 'input[name="q"]', we use '#wrong-id-123'
  console.log("Running test with broken selector...");
  await smartClick(page, '#wrong-id-123'); 

  await page.waitForTimeout(3000);
  await browser.close();
});
