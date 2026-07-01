import { Page } from "@playwright/test";

export class BasePage {
    constructor(readonly page: Page) {}

    /**
     * Centralizes the required network response wait for the products grid.
     */
    async waitForProductsData() {
        await this.page.waitForResponse(response => 
            response.url().includes('/api/productsList') && response.status() === 200,
            { timeout: 5000 } 
        ).catch(() => {}); // Catch it safely if it already finished loading
    }
}