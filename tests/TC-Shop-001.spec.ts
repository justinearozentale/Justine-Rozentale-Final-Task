import { test, waitForPageReady } from '../fixtures/fixtures';
import { HomePage } from '../pages/HomePage';
import { SignupPage } from '../pages/SignupPage';
import { AccountInfoPage } from '../pages/AccountInfoPage';
import { AccountCreated } from '../pages/AccountCreated';
import { ProductsPage } from '../pages/ProductsPage';
import { ViewCartPage } from '../pages/ViewCartPage';
import { CheckOutPage } from '../pages/CheckOutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { OrderPlacedPage } from '../pages/OrderPlacedPage';

test.describe('Registration flow', () => {
test('User successfully registers and is logged in @epic("Shopping") @feature("Checkout") @story("Full E2E flow") @severity("critical")', async ({ page }) => {
    const homePage = new HomePage(page);
    const signupPage = new SignupPage(page);
    const accountInfoPage = new AccountInfoPage(page);
    const accountCreated = new AccountCreated(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');
    await homePage.clickSignUpButton();

    const uniqueEmail = `test_user_${Date.now()}@gmail.com`;
    await signupPage.fillSignupForm('Test User', uniqueEmail);

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
    await waitForPageReady(page);
    await accountCreated.verifyAccountCreated();
    await accountCreated.clickContinue();
    await homePage.verifyLoggedInUser('Test User');
  });


test.describe('Purchase flow', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    const signupPage = new SignupPage(page);

    await page.goto('/');
    await waitForPageReady(page);
    await homePage.clickSignUpButton();

    await signupPage.login('purchasetest@gmail.com', 'SecurePass123!');
    await homePage.verifyLoggedInUser('Test User');
  });

test('Successful purchase @epic("Shopping") @feature("Checkout") @story("Successful purchase") @severity("critical")', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const viewCartPage = new ViewCartPage(page);
    const checkOutPage = new CheckOutPage(page);
    const paymentPage = new PaymentPage(page);
    const orderPlacedPage = new OrderPlacedPage(page);

    await homePage.clickProductsButton();
    await productsPage.addFirstProductToCart();
    await productsPage.clickViewCart();

    await viewCartPage.clickProceedToCheckout();
    await checkOutPage.verifyAddressMatches('SKOLAS IELA 5 3306');
    await checkOutPage.clickPlaceOrder();

    await paymentPage.fillNameOnCard('Test User');
    await paymentPage.fillCardNumber('4111111111111111');
    await paymentPage.fillCVC('123');
    await paymentPage.fillExpirationMonth('12');
    await paymentPage.fillExpirationYear('2025');
    await paymentPage.clickPayAndConfirmOrder();
    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: 'load' });

    await orderPlacedPage.verifyOrderPlaced();
  });
});
});