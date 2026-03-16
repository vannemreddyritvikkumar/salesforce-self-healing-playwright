import { test, expect } from '@playwright/test';
import { AIHealer } from '../lib/AIHealer';
import * as dotenv from 'dotenv';

dotenv.config();

test('Salesforce Lead Creation with AI Self-Healing', async ({ page }) => {
  const healer = new AIHealer(page);

  // 1. Login
  await page.goto('https://login.salesforce.com');
  await page.fill('#username', process.env.SF_USERNAME || '');
  await page.fill('#password', process.env.SF_PASSWORD || '');
  await page.click('#Login');

  // 2. Navigate to Leads (Salesforce often changes these tabs to 'More')
  // We use smartClick to handle UI shifts
  await healer.smartClick('a[title="Leads"]', 'The Leads navigation tab');

  // 3. Click New Lead (Inside a Shadow DOM/LWC)
  await healer.smartClick('button[name="New"]', 'The New Lead button');

  // 4. Assert
  await expect(page.getByText('Create Lead')).toBeVisible();
});
