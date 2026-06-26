import { test as base, type Page, expect } from '@playwright/test';

const DEFAULT_TIMEOUT = 10000;

export const test = base.extend({
  page: async ({ page }, use) => {
    // 1. Block ad servers completely so they never load
    await page.route('**/*{google,doubleclick,adservice}*/**', route => route.abort());

    // 2. Click the consent popup button if it appears
    await page.addInitScript(() => {
      window.addEventListener('load', () => {
        const consentButton = document.querySelector('.fc-cta-consent, button[aria-label="Consent"]') as HTMLElement | null;
        consentButton?.click();
      });
    });

    await use(page);
  },
});

/**
 * Clean and simple page loader check
 */
export async function waitForPageReady(page: Page, timeout = DEFAULT_TIMEOUT) {
  // 1. Wait for the page structure to load
  await page.waitForLoadState('domcontentloaded', { timeout });
  await page.waitForTimeout(2000); // 2 seconds to let the server load completely

  // 2. Simple check: Is the page body completely empty?
  const pageText = await page.innerText('body').catch(() => '');
  const isBlank = pageText.trim() === '';

  // 3. If the page is completely blank, run your 2-line reload!
  if (isBlank) {
    console.log("⚠️ Blank page detected. Reloading...");
    await page.reload({ waitUntil: 'load', timeout });
    await page.waitForLoadState('domcontentloaded', { timeout });
  }
}

export { expect };