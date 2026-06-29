import { test as base, type Page, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    // 1. Block ads
    await page.route('**/*{google,doubleclick,adservice}*/**', route => route.abort());

    // 2. Clear consent banners
    await page.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        (document.querySelector('.fc-cta-consent, button[aria-label="Consent"]') as HTMLElement)?.click();
      });
    });

    await use(page);
  },
});

export async function waitForPageReady(page: Page) {
  // 1. Give the page a moment to display the 500 error or blank view
  await page.waitForTimeout(2000); 

  // 2. Check if the page title or URL shows it's stuck on a crash/blank state
  // (Using title/URL because innerText fails when the browser tab crashes)
  const title = await page.title().catch(() => '');
  const url = page.url();

  // 3. If it looks like a crash or a blank screen, force a hard keyboard refresh
  if (title.includes('500') || title.includes('working') || title === '') {
    console.log("⚠️ Browser environment frozen by 500 error. Pressing F5 Control Key...");
    
    // Simulates a physical keyboard press of the F5 Refresh button from outside the page
    await page.keyboard.press('F5');
    
    // Let the network recover and draw the page
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await page.waitForTimeout(1500);
  }
}