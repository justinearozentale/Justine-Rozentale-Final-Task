import { test as base, type Page } from '@playwright/test';

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

export async function waitForPageReady(page: Page, timeout = DEFAULT_TIMEOUT) {
  await page.waitForLoadState('domcontentloaded', { timeout });
  await page.waitForLoadState('load', { timeout });
}

export { DEFAULT_TIMEOUT };