import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ViewCartPage extends BasePage{
    readonly proceedToCheckoutButton: Locator;
    readonly cartRows: Locator;

    constructor(page: Page) {
        super(page);

    this.proceedToCheckoutButton = page.locator('.check_out');
    this.cartRows = page.locator('#cart_info_table tbody tr');
    }
   
    async clickProceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }

    async verifyCartRowLength(expectedCount: number) {
        await expect(this.cartRows).toHaveCount(expectedCount, { timeout: 10000 })
    }
    async verifyRowDetails(rowIndex: number, expectedName: string, expectedPrice: string) {
        const row = this.cartRows.nth(rowIndex);

        // Verify Name
        await expect(row.locator('.cart_description h4')).toHaveText(expectedName);
        
        // Verify Unit Price
        await expect(row.locator('.cart_price p')).toHaveText(expectedPrice);
        
        // Verify Quantity is always 1
        await expect(row.locator('.cart_quantity button')).toHaveText('1');
        
        // Verify Line Total matches the unit price (since quantity is 1)
        await expect(row.locator('.cart_total .cart_total_price')).toHaveText(expectedPrice);

        await expect(row.locator('.cart_total .cart_total_price')).toHaveText(expectedPrice);
    }

    async removeProductFromCart(rowIndex: number) {
        await this.cartRows.nth(rowIndex).locator('.cart_quantity_delete').click();
    }

    async verifyCartIsEmpty(){
    const emptyCartMessage = this.page.locator('#empty_cart'); 
    await expect(emptyCartMessage).toBeVisible({ timeout: 5000 });
    await expect(emptyCartMessage).toHaveText('Cart is empty! Click here to buy products.');

}
    }
