import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckOutPage extends BasePage {
    readonly deliveryAddress: Locator;
    readonly placeOrderButton: Locator;

    constructor(page: Page) {
        super(page);
        this.deliveryAddress = page.locator('#address_delivery');
        this.placeOrderButton = page.locator('.check_out');
    }

    async verifyAddressMatches(expectedStreet: string) {
        // If default country changes to USA, Canada, or India, it will still pass
        await expect(this.deliveryAddress).toContainText(expectedStreet);
    }

    async clickPlaceOrder() {
        await this.placeOrderButton.click();
    }
}