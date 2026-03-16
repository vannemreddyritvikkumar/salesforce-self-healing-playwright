import { Page } from '@playwright/test';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class AIHealer {
  constructor(private page: Page) {}

  /**
   * Tries to click a selector. If it fails, it asks AI to find the new selector.
   */
  async smartClick(originalSelector: string, description: string) {
    try {
      // Try standard click (timeout set to 5s for faster healing trigger)
      await this.page.click(originalSelector, { timeout: 5000 });
      console.log(`✅ Success: Clicked ${originalSelector}`);
    } catch (error) {
      console.error(`❌ Failed to find: ${originalSelector}. Healing...`);
      
      // 1. Capture the DOM state (Focus on interactive elements to save tokens)
      const domSnapshot = await this.page.evaluate(() => {
        return Array.from(document.querySelectorAll('button, a, input, [role="button"]'))
          .map(el => ({
            tagName: el.tagName,
            text: el.textContent?.trim().slice(0, 50),
            id: el.id,
            ariaLabel: el.getAttribute('aria-label'),
            className: el.className
          }));
      });

      // 2. Ask GPT-4o for the new selector
      const prompt = `The CSS selector "${originalSelector}" for "${description}" is broken.
      Based on this simplified DOM: ${JSON.stringify(domSnapshot)}, find the new CSS selector.
      Return ONLY the selector string. No prose.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }]
      });

      const healedSelector = completion.choices[0].message.content?.trim();

      // 3. Retry with healed selector
      if (healedSelector) {
        console.log(`💡 AI suggest healed selector: ${healedSelector}`);
        await this.page.click(healedSelector);
      } else {
        throw new Error("AI could not determine a healed selector.");
      }
    }
  }
}
