import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class OrderPlacedPage extends BasePage{
    readonly confirmationMessage: Locator;

    constructor(page: Page) {
        super(page);

        this.confirmationMessage = page.getByText(/ORDER PLACED!/i);
    }

   async verifyOrderPlaced() {
       const orderHeader = this.page.locator('[data-qa="order-placed"] b');
        await expect(orderHeader).toBeVisible({ timeout: 15000 });
        await expect(orderHeader).toHaveText(/order placed/i);
    }
}