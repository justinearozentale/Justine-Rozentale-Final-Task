import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AccountCreatedPage extends BasePage {
    readonly successMessage: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);
        this.successMessage = page.getByText('Account Created!');
        this.continueButton = page.getByRole('link', { name: 'Continue' });
    }

    // Methods
    
    async verifyAccountCreated() {
        await expect(this.successMessage).toBeVisible();
    }
    
    async clickContinue() {
        await this.continueButton.click();
    }
}