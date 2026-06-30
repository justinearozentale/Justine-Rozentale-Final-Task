import { test, fixCrash } from '../fixtures/authenticatedShopPage';
import { expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { ViewCartPage } from '../pages/ViewCartPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { HomePage } from '../pages/HomePage';
import { SignupLoginPage } from '../pages/SignupLoginPage';

test.describe('Shopping and other flows', () => {

  // CLEANUP: Wipes cookies after each test to keep browser states isolated and fresh
  test.afterEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('Search: keyword search returns only matching products @epic("Shopping") @feature("Product Search") @story("Keyword search") @severity("normal")', async ({ authenticatedShopPage }) => {
    const page = authenticatedShopPage; 
    const productsPage = new ProductsPage(page);

    await page.goto('/products');
    await fixCrash(page); // Crash safety check
    
    await productsPage.searchProduct('Dress');
    await productsPage.clickSearchButton();
    await fixCrash(page);
    await productsPage.verifySearchResults();
  });

  test('Cart: adding multiple products updates the item count @epic("Shopping") @feature("Cart") @story("Add multiple products") @severity("normal")', async ({ authenticatedShopPage }) => {
    const page = authenticatedShopPage;
    const productsPage = new ProductsPage(page);
    const viewCartPage = new ViewCartPage(page);

    await page.goto('/products');
    await fixCrash(page);

    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickContinueShopping();
    await productsPage.addProductToCartByIndex(1);
    await productsPage.clickViewCart();
    await fixCrash(page);
    
    await viewCartPage.verifyCartRowLength(2);
    await viewCartPage.verifyRowDetails(0, 'Blue Top', 'Rs. 500');
    await viewCartPage.verifyRowDetails(1, 'Men Tshirt', 'Rs. 400');
  });

  test('Cart: removing a product updates the item count @epic("Shopping") @feature("Cart") @story("Remove product") @severity("normal")', async ({ authenticatedShopPage }) => {
    const page = authenticatedShopPage;
    const productsPage = new ProductsPage(page);
    const viewCartPage = new ViewCartPage(page);

    await page.goto('/products');
    await fixCrash(page);

    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickViewCart();
    await fixCrash(page);
    await viewCartPage.verifyCartRowLength(1);
    
    await viewCartPage.removeProductFromCart(0);
    await viewCartPage.verifyCartRowLength(0);
    await viewCartPage.verifyCartIsEmpty();
    await expect(page).toHaveURL('/view_cart');
  });

  test('Product detail: product info page shows correct data @epic("Shopping") @feature("Product Detail") @story("View product") @severity("minor")', async ({ authenticatedShopPage }) => {
    const page = authenticatedShopPage;
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    await page.goto('/products');
    await fixCrash(page);

    await productsPage.clickViewProductLink();
    await fixCrash(page);
    await productDetailsPage.verifyProductNameIsVisibleAndNotEmpty();
    await productDetailsPage.verifyProductDetailsArePresent();
    await productDetailsPage.verifyAddToCartButtonPresent();
  });

  test('Subscription: subscribing from the footer shows a success message @epic("Marketing") @feature("Newsletter") @story("Footer-subscription") @severity("minor")', async ({ authenticatedShopPage }) => {        
    const page = authenticatedShopPage;
    const homePage = new HomePage(page);
    const uniqueEmail = `subscriber_${Date.now()}@example.com`;

    await page.goto('/');
    await fixCrash(page);
    await homePage.subsribeToNewsletter(uniqueEmail);

    await expect(homePage.successMessage).toBeVisible();
    await expect(homePage.successMessage).toHaveText('You have been successfully subscribed!');
    await expect(homePage.emailInput).toHaveValue('');
  });

  test('Authenticated user is redirected away from the login page @epic("Session") @feature("Security") @story("Auth redirection") @severity("normal")', async ({ authenticatedShopPage }) => {
    const page = authenticatedShopPage;
    const homePage = new HomePage(page);
    const signupLoginPage = new SignupLoginPage(page);

    await page.goto('/login');
    await fixCrash(page);
    
    await signupLoginPage.login('purchasetest@gmail.com', 'SecurePass123!');
    await homePage.verifyLoggedInUser('Test User');

    await page.goto('/login');
    await fixCrash(page); // Automatically clicks refresh if server returns a 500 crash or a blank screen

    await expect(page).toHaveURL('/'); 

    const loggedInTextLocator = page.locator('header', { hasText: 'Logged in as' });
    await expect(loggedInTextLocator).toBeVisible();
    await expect(loggedInTextLocator).toContainText('Logged in as Test User');
  });
});