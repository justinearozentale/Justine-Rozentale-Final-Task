import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
    readonly viewCartLink: Locator;
    readonly searchField: Locator;
    readonly searchButton: Locator;
    readonly searchedProductsHeading: Locator;
    readonly productNames: Locator;
    readonly continueShoppingButton: Locator;
    readonly productCards: Locator;
    readonly viewProductLink: Locator;
    readonly cartModal: Locator;

    constructor(page: Page) {
        super(page);
    
        this.viewCartLink = page.getByRole('link', { name: 'View Cart' });
        this.searchField = page.getByPlaceholder('Search Product');
        this.searchButton = page.locator('#submit_search');
        this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products' });
        this.productNames = page.locator('.productinfo p');
        this.continueShoppingButton = page.locator('button[data-dismiss="modal"]:has-text("Continue Shopping")');        
        this.productCards = page.locator('.single-products');
        this.viewProductLink = page.getByText('View Product');
        this.cartModal = page.locator('#cartModal');
    }

    async addFirstProductToCart() {
        const firstProduct = this.page.locator('.single-products').first();
        await firstProduct.hover();
        await this.page.getByText('Add to cart').first().click();
        await expect(this.cartModal).toBeVisible();
    }

    async clickViewCart() {
        await this.viewCartLink.click({ force: true });
        await this.page.waitForURL('**/view_cart', { timeout: 10000 });
    }

    async searchProduct(productName: string) {
        await this.waitForProductsData();
        await this.searchField.click();
        await this.searchField.fill(productName);
    }

    async clickSearchButton() {
        await this.searchButton.click();
    }

    async verifySearchResults() {
        await expect(this.searchedProductsHeading).toHaveText('Searched Products');
        await expect(this.productNames.first()).toBeVisible();
        await expect(this.productNames.first()).toContainText('Dress');
    }

    async addProductToCartByIndex(index: number) {
        await this.waitForProductsData();
        
        const productCard = this.productCards.nth(index);
        const addToCartButton = productCard.locator('.add-to-cart').first();

        await productCard.hover();
        await addToCartButton.click();
        
        await expect(this.cartModal).toBeVisible();
        
        await this.page.waitForTimeout(500);
    }   
   
    async clickContinueShopping() {
        await expect(this.continueShoppingButton).toBeVisible({ timeout: 10000 });
        await this.continueShoppingButton.click();
    }

    async clickViewProductLink() {
        await this.waitForProductsData();
        await this.viewProductLink.first().click();
    }
}