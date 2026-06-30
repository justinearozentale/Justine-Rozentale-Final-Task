import { test, fixCrash } from '../fixtures/authenticatedShopPage'; 
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { ViewCartPage } from '../pages/ViewCartPage';
import { CheckOutPage } from '../pages/CheckOutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { OrderPlacedPage } from '../pages/OrderPlacedPage';

test.afterEach(async ({ authenticatedShopPage, request }, testInfo) => {
  const user = (authenticatedShopPage as any).testUser;

  // When purchase flow finishes - it deletes the registered account from database
  if (user && testInfo.title.toLowerCase().includes('purchase')) {
    await request.delete('/api/deleteAccount', {
      form: { email: user.email, password: user.password }
    }).catch(() => {});
    console.log(`🗑️ API Cleanup: Deleted account for ${user.email}`);
  }
});

test.describe('Registration flow', () => {
  test('User successfully registers and is logged in @epic("Shopping") @feature("Checkout") @story("Full E2E flow") @severity("critical")', async ({ authenticatedShopPage }) => {
    const homePage = new HomePage(authenticatedShopPage);
    const generatedUser = (authenticatedShopPage as any).testUser;

    if (generatedUser) {
      await homePage.verifyLoggedInUser(generatedUser.name);
    }
  });
});

test.describe('Purchase flow', () => {
  test('Successful purchase @epic("Shopping") @feature("Checkout") @story("Successful purchase") @severity("critical")', async ({ authenticatedShopPage }) => {
    const homePage = new HomePage(authenticatedShopPage);
    const productsPage = new ProductsPage(authenticatedShopPage);
    const viewCartPage = new ViewCartPage(authenticatedShopPage);
    const checkOutPage = new CheckOutPage(authenticatedShopPage);
    const paymentPage = new PaymentPage(authenticatedShopPage);
    const orderPlacedPage = new OrderPlacedPage(authenticatedShopPage);

    await authenticatedShopPage.goto('/');
    
    await homePage.clickProductsButton();
    await productsPage.addFirstProductToCart();
    await productsPage.clickViewCart();
    await viewCartPage.clickProceedToCheckout();
    await checkOutPage.verifyAddressMatches('123 Street');
    await checkOutPage.clickPlaceOrder();

    await paymentPage.fillNameOnCard('Test User');
    await paymentPage.fillCardNumber('4111111111111111');
    await paymentPage.fillCVC('123');
    await paymentPage.fillExpirationMonth('12');
    await paymentPage.fillExpirationYear('2025');
    
    await paymentPage.clickPayAndConfirmOrder();
    
    // In case server throws 500 error
    await fixCrash(authenticatedShopPage);

    await orderPlacedPage.verifyOrderPlaced();
  });
});