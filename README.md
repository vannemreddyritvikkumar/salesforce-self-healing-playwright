# 🛠️ Salesforce AI Self-Healing Framework

An intelligent automation wrapper for **Playwright** designed to solve the "brittle locator" problem in complex **Salesforce Lightning** environments.

## 🚀 The Challenge
Salesforce UIs are notoriously difficult to automate due to:
1. **Shadow DOM:** Standard locators often fail to pierce deep LWC (Lightning Web Component) structures.
2. **Dynamic IDs:** Element IDs change frequently, causing standard scripts to break after every Salesforce release.

## 🧠 The AI Solution
This framework implements a **Self-Healing** pattern:
- **Failure Detection:** If a standard CSS/XPath locator fails, the `AIHealer` class captures the current DOM state.
- **Contextual Analysis:** It sends a filtered DOM snapshot (tags, ARIA labels, text) to **GPT-4o**.
- **Autonomous Recovery:** The AI returns the most probable new selector, allowing the test to continue without manual intervention.

## 🛠️ Setup
1. Clone the repo.
2. Run `npm install`.
3. Create a `.env` file with your `OPENAI_API_KEY` and Salesforce credentials.
4. Run tests: 
   ```bash
   npx playwright test
