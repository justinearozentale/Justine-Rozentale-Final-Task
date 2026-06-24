import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      document.querySelectorAll('iframe, .modal').forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
    });

    await use(page);
  },
});
