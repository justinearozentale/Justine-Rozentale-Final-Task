import { test as base, type Page } from '@playwright/test';

// Remembers the user details across the entire suite run
let registeredUserSession: any = null;

export const test = base.extend<{ authenticatedShopPage: Page }>({
  authenticatedShopPage: async ({ page }, use, testInfo) => {
    
    // 1. Block ads
    await page.route('**/*{google,doubleclick,adservice,analytics,fundingchoices}*/**', r => r.abort());

    const title = testInfo.title.toLowerCase();

    // 2. Only handles accounts for signup/purchase tests
    if (title.includes('registers') || title.includes('purchase')) {
      
      if (!registeredUserSession) {
        const timestamp = Date.now();
        registeredUserSession = {
          name: 'TestUser',
          email: `user_${timestamp}@test.com`,
          password: 'Pass123!'
        };

        await page.goto('/login');
        await page.fill('[data-qa="signup-name"]', registeredUserSession.name);
        await page.fill('[data-qa="signup-email"]', registeredUserSession.email);
        await page.click('[data-qa="signup-button"]');
        
        await page.fill('[data-qa="password"]', registeredUserSession.password);
        await page.fill('[data-qa="first_name"]', 'QA');
        await page.fill('[data-qa="last_name"]', 'Test');
        await page.fill('[data-qa="address"]', '123 Street');
        await page.fill('[data-qa="state"]', 'State');
        await page.fill('[data-qa="city"]', 'City');
        await page.fill('[data-qa="zipcode"]', '12345');
        await page.fill('[data-qa="mobile_number"]', '12345678');
        
        await page.waitForTimeout(500); 
        await page.click('[data-qa="create-account"]');
        await page.click('[data-qa="continue-button"]');
        
        console.log(`✨ Registered successfully: ${registeredUserSession.email}`);
      }

      // Pass the active user reference back to the test variables
      (page as any).testUser = registeredUserSession;
    }

    await use(page);
  },
});

export async function fixCrash(page: Page) {
  await page.waitForTimeout(1000);
  if (page.url().includes('500') || (await page.title().catch(() => '')) === '') {
    await page.reload({ waitUntil: 'load' }).catch(() => {});
  }
}