import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class OrderPlacedPage extends BasePage{
    readonly confirmationMessage: Locator;

    constructor(page: Page) {
        super(page);

        this.confirmationMessage = page.getByText('Order Placed!');
    
        
    
   }

   async verifyOrderPlaced() {
        await expect(this.confirmationMessage).toBeVisible();
        await expect(this.page).toHaveURL(/payment_done/);   
    }

   
}