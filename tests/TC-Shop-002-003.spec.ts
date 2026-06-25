import { test, waitForPageReady } from '../fixtures/fixtures';
import { ProductsPage } from '../pages/ProductsPage';
import { ViewCartPage } from '../pages/ViewCartPage';

test.describe('User Search scenarios', () => {
test('Search: keyword search returns only matching products @epic("Shopping") @feature("Product Search") @story("Keyword search") @severity("normal")', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await page.goto('/products');
    await waitForPageReady(page);
    await productsPage.searchProduct('Dress');
    await productsPage.clickSearchButton();
    await productsPage.verifySearchResults();
  });
});

test.describe('Cart scenarios', () => {
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
});
    