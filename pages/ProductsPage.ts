import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage{
    readonly viewCartLink: Locator;

    constructor(page: Page) {
        super(page);
    
        this.viewCartLink = page.getByRole('link', { name: 'View Cart' });
    }
    async addFirstProductToCart() {
        const firstProduct = this.page.locator('.single-products').first();
        await firstProduct.hover();
        await this.page.waitForTimeout(1000);
        // Click button with text "Add to cart"
        await this.page.getByText('Add to cart').first().click();
   }

   async clickViewCart() {
    await this.viewCartLink.click();    
   }
}