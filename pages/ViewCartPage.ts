import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ViewCartPage extends BasePage{
    readonly proceedToCheckoutButton: Locator;

    constructor(page: Page) {
        super(page);

    this.proceedToCheckoutButton = page.locator('.check_out');
    }
   
    async clickProceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }
}
