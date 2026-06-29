import { test } from '../fixtures/fixtures'; // 👇 Switched to your fast base fixture
import { waitForPageReady } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { ViewCartPage } from '../pages/ViewCartPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { HomePage } from '../pages/HomePage';
import { SignupLoginPage } from '../pages/SignupLoginPage';

test.describe('E2E Shopping and Security Suite (Optimized)', () => {

  // 👇 CLEANUP: Wipes cookies after each test to keep browser states isolated and fresh
  test.afterEach(async ({ context }) => {
    await context.clearCookies();
  });

  // --- USER SEARCH SCENARIOS ---
  test('Search: keyword search returns only matching products @epic("Shopping") @feature("Product Search") @story("Keyword search") @severity("normal")', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await page.goto('/products');
    await waitForPageReady(page);
    
    await productsPage.searchProduct('Dress');
    await productsPage.clickSearchButton();
    await productsPage.verifySearchResults();
  });

  // --- CART SCENARIOS ---
  test('Cart: adding multiple products updates the item count @epic("Shopping") @feature("Cart") @story("Add multiple products") @severity("normal")', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const viewCartPage = new ViewCartPage(page);

    await page.goto('/products');
    await waitForPageReady(page);
    
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickContinueShopping();
    await productsPage.addProductToCartByIndex(1);
    await page.waitForTimeout(1500);
    await productsPage.clickViewCart();
    await viewCartPage.verifyCartRowLength(2);
    await viewCartPage.verifyRowDetails(0, 'Blue Top', 'Rs. 500');
    await viewCartPage.verifyRowDetails(1, 'Men Tshirt', 'Rs. 400');
  });

  test('Cart: removing a product updates the item count @epic("Shopping") @feature("Cart") @story("Remove product") @severity("normal")', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const viewCartPage = new ViewCartPage(page);

    await page.goto('/products');
    await waitForPageReady(page);
    
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickViewCart();
    await viewCartPage.verifyCartRowLength(1);
    await viewCartPage.removeProductFromCart(0);
    await viewCartPage.verifyCartRowLength(0);

    await viewCartPage.verifyCartIsEmpty();
    await expect(page).toHaveURL('/view_cart');
  });

  // --- PRODUCT DETAIL SCENARIOS ---
  test('Product detail: product info page shows correct data @epic("Shopping") @feature("Product Detail") @story("View product") @severity("minor")', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    await page.goto('/products');
    await waitForPageReady(page);
    
    await productsPage.clickViewProductLink();
    await productDetailsPage.verifyProductNameIsVisibleAndNotEmpty();
    await productDetailsPage.verifyProductDetailsArePresent();
    await productDetailsPage.verifyAddToCartButtonPresent();
  });

  // --- SUBSCRIPTION SCENARIOS ---
  test('TC-SHOP-009 — Subscription: subscribing from the footer shows a success message @epic("Marketing") @feature("Newsletter") @story("Footer-subscription") @severity("minor")', async ({ page }) => {        
    const homePage = new HomePage(page);
    const uniqueEmail = `subscriber_${Date.now()}@example.com`;

    await page.goto('/');
    await waitForPageReady(page);
    
    await homePage.emailInput.click();
    await homePage.subsribeToNewsletter(uniqueEmail);

    await expect(homePage.successMessage).toBeVisible();
    await expect(homePage.successMessage).toHaveText('You have been successfully subscribed!');
    await expect(homePage.emailInput).toHaveValue('');
  });

  // --- SECURITY SCENARIOS ---
  test('Authenticated user is redirected away from the login page @epic("Session") @feature("Security") @story("Auth redirection") @severity("normal")', async ({ page }) => {
    const homePage = new HomePage(page);
    const signupLoginPage = new SignupLoginPage(page);

    // 1. Log into your static permanent account right here
    await page.goto('/login');
    await waitForPageReady(page);
    await signupLoginPage.login('purchasetest@gmail.com', 'SecurePass123!');
    await homePage.verifyLoggedInUser('Test User');

    // 2. Try to navigate back to the login page manually
    await page.goto('/login');
    
    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: 'load' }).catch(() => {});

    // 3. Assert the server kicked you back to the home page because you are already authorized
    await expect(page).toHaveURL('/'); 

    const loggedInTextLocator = page.locator('header', { hasText: 'Logged in as' });
    await expect(loggedInTextLocator).toBeVisible();
    await expect(loggedInTextLocator).toContainText('Logged in as Test User');
  });
});