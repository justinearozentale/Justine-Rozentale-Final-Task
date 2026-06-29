import { test as baseTest } from "./fixtures"; 
import { type Page, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { SignupLoginPage } from "../pages/SignupLoginPage";
import { AccountInfoPage } from "../pages/AccountInfoPage";
import { AccountCreatedPage } from "../pages/AccountCreatedPage";

function generateUser() {
  const uniqueId = Date.now();
  return {
    name: `Test User ${uniqueId}`,
    email: `test_user_${uniqueId}@gmail.com`,
    password: 'SecurePass123!'
  };
}

export type AuthenticatedShopPageFixture = {
  authenticatedShopPage: Page;
}

export const test = baseTest.extend<AuthenticatedShopPageFixture>({
  authenticatedShopPage: async ({ page }, use) => {
    const user = generateUser();
    
    const homePage = new HomePage(page);
    const signupLoginPage = new SignupLoginPage(page);
    const accountInfoPage = new AccountInfoPage(page);
    const accountCreatedPage = new AccountCreatedPage(page);

    // --- EXECUTE SIGNUP FLOW ---
    try {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
    } catch (error) {
      await page.waitForTimeout(2000);
      await page.reload({ waitUntil: 'load' }).catch(() => {});
    }

    await homePage.clickSignUpButton();
    await signupLoginPage.fillSignupForm(user.name, user.email);
    await accountInfoPage.registerUser(user);

    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: 'load' }).catch(() => {});

    await accountCreatedPage.verifyAccountCreated();
    await accountCreatedPage.clickContinue();

    (page as any).testUser = user;

    // 👇 GLOBAL RELOAD PATCH: intercept reload calls for all tests using this fixture
    const originalReload = page.reload.bind(page);
    page.reload = async (options?: any) => {
      return originalReload(options).catch((error) => {
        console.log(`🛡️ Global Fixture: Safely caught reload crash: ${error.message}`);
        return null as any;
      });
    };

    await use(page);
  },
});

export { expect };