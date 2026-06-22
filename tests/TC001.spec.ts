import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SignupPage } from '../pages/SignupPage';
import { AccountInfoPage } from '../pages/AccountInfoPage';
import { AccountCreated } from '../pages/AccountCreated';

test.describe('User Registration Flow', () => {

test('TC-SHOP-001 — Happy path: full shopping flow', async ({ page }) => {
    const homePage = new HomePage(page);
    const signupPage = new SignupPage(page);
    const accountInfoPage = new AccountInfoPage(page);
    const accountCreated = new AccountCreated(page);

    await page.goto('/');

    // Clear the banner if it shows up
    await homePage.acceptCookiesIfPresent();
    await page.waitForTimeout(2000);

    await homePage.clickSignUpButton();
 
    // Complete the signup form
    const uniqueEmail = `test_user_${Date.now()}@gmail.com`;
    await signupPage.fillSignupForm('Test User', uniqueEmail);

    // Close any ad banners that might block form fields
    await accountInfoPage.closeBottomBannerIfPresent();
    
    await accountInfoPage.selectTitle();
    await accountInfoPage.fillName('Test User');
    await accountInfoPage.verifyEmailField();
    await accountInfoPage.fillPassword('SecurePass123!');
    await accountInfoPage.selectDateOfBirth('12', 'January', '1990');
    await accountInfoPage.fillFirstName('Test User First Name');
    await accountInfoPage.fillLastName('Test User Last Name');
    await accountInfoPage.fillAddress('123 Test Street, Test City, Test Country');

    await accountInfoPage.selectCountry('United States');
    await accountInfoPage.fillState('Test State');
    await accountInfoPage.fillCity('Test City');
    await accountInfoPage.fillZipCode('12345');
    await accountInfoPage.fillMobileNumber('1234567890');

    await accountInfoPage.clickCreateAccount();

    await accountCreated.verifyAccountCreated();
    await accountCreated.clickContinue();

    await homePage.verifyLoggedInUser('Test User');

});
});