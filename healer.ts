import { Page } from '@playwright/test';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Custom wrapper for Playwright click action.
 * If the selector fails, it uses AI to find a fallback.
 */
export async function smartClick(page: Page, selector: string) {
  try {
    // Attempt normal click with a short timeout
    await page.click(selector, { timeout: 3000 });
    console.log(`✅ Success: Clicked ${selector}`);
  } catch (error) {
    console.warn(`⚠️ Failure: Selector ${selector} not found. Healing starting...`);

    // Capture the page source to give AI context
    const htmlContext = await page.evaluate(() => {
      // We grab buttons and links to keep the token count low
      return Array.from(document.querySelectorAll('button, a, input'))
        .map(el => el.outerHTML)
        .join('\n')
        .slice(0, 3000); 
    });

    const prompt = `The CSS selector "${selector}" failed to find an element. 
    Based on the following HTML elements from the page, what is the best NEW CSS selector for the element the user was likely looking for? 
    Return ONLY the string of the selector.
    
    HTML context:
    ${htmlContext}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const healedSelector = completion.choices[0].message.content?.trim();
    console.log(`🤖 AI Suggestion: ${healedSelector}`);

    // Attempt to click the healed selector
    if (healedSelector) {
      await page.click(healedSelector);
      console.log(`🎉 Healed: Successfully clicked ${healedSelector}`);
    }
  }
}
