import { test as base, type Page } from '@playwright/test';

// 1. Setup the test environment with specific authenticatedShopPage fixture name
export const test = base.extend<{ authenticatedShopPage: Page }>({
  authenticatedShopPage: async ({ page }, use) => {
    // Blocking ads
    await page.route('**/*{google,doubleclick,adservice}*/**', route => route.abort());
    
    // Pass the configured page to test scripts
    await use(page);
  },
});

// If page is crashing or 500 error code is visible
export async function fixCrash(page: Page) {
  await page.waitForTimeout(1500); // Wait briefly for the server to settle

  const url = page.url();
  const title = await page.title().catch(() => '');

  // If the page crashed or went completely blank, refreshes it straight away
  if (url.includes('500') || title === '' || title.includes('500')) {
    console.log("⚠️ Site crashed! Refreshing the page now...");
    await page.reload({ waitUntil: 'load' }).catch(() => {});
  }
}