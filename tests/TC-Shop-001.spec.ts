import { test, expect } from '../fixtures/authenticatedShopPage'; 
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { ViewCartPage } from '../pages/ViewCartPage';
import { CheckOutPage } from '../pages/CheckOutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { OrderPlacedPage } from '../pages/OrderPlacedPage';

// 👇 Deletes the temporary account created by the fixture for the registration test
test.afterEach(async ({ authenticatedShopPage, request }) => {
  const user = (authenticatedShopPage as any).testUser;

  await request.delete('/api/deleteAccount', {
    form: {
      email: user.email,
      password: user.password
    }
  });
  
  console.log(`🗑️ API Cleanup: Deleted account for ${user.email}`);
});

// ==========================================
//   1. REGISTRATION FLOW
// ==========================================
test.describe('Registration flow', () => {
  test('User successfully registers and is logged in @epic("Shopping") @feature("Checkout") @story("Full E2E flow") @severity("critical")', async ({ authenticatedShopPage }) => {
    const homePage = new HomePage(authenticatedShopPage);
    const generatedUser = (authenticatedShopPage as any).testUser;

    await homePage.verifyLoggedInUser(generatedUser.name);
  });
});

// ==========================================
//   2. PURCHASE FLOW
// ==========================================
test.describe('Purchase flow', () => {
  test('Successful purchase @epic("Shopping") @feature("Checkout") @story("Successful purchase") @severity("critical")', async ({ authenticatedShopPage }) => {
    const homePage = new HomePage(authenticatedShopPage);
    const productsPage = new ProductsPage(authenticatedShopPage);
    const viewCartPage = new ViewCartPage(authenticatedShopPage);
    const checkOutPage = new CheckOutPage(authenticatedShopPage);
    const paymentPage = new PaymentPage(authenticatedShopPage);
    const orderPlacedPage = new OrderPlacedPage(authenticatedShopPage);

    // 👇 FIX: You are already logged in by the fixture! Go straight to shopping.
    await authenticatedShopPage.goto('/');
    
    // Start shopping interaction flow directly
    await homePage.clickProductsButton();
    await productsPage.addFirstProductToCart();
    await productsPage.clickViewCart();

    await viewCartPage.clickProceedToCheckout();
    
    await checkOutPage.verifyAddressMatches('123 Test Street, Test City, Test Country');
    await checkOutPage.clickPlaceOrder();

    await paymentPage.fillNameOnCard('Test User');
    await paymentPage.fillCardNumber('4111111111111111');
    await paymentPage.fillCVC('123');
    await paymentPage.fillExpirationMonth('12');
    await paymentPage.fillExpirationYear('2025');
    await paymentPage.clickPayAndConfirmOrder();
    
    await authenticatedShopPage.waitForTimeout(2000);
    await authenticatedShopPage.reload({ waitUntil: 'load' });
    await orderPlacedPage.verifyOrderPlaced();
  });
});