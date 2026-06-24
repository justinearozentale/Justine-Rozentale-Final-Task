import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckOutPage extends BasePage {
    readonly deliveryAddress: Locator;
    readonly placeOrderButton: Locator;

    constructor(page: Page) {
        super(page);

        this.deliveryAddress = page.locator('#address_delivery');
        this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
    }

    async verifyAddressMatches(expectedAddress: string) {
        await expect(this.deliveryAddress).toContainText(expectedAddress);
    }

    async clickPlaceOrder() {
        await this.placeOrderButton.click();
    }
}