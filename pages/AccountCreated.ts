import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AccountCreated extends BasePage{
    readonly successMessage: Locator;
    readonly continueButton: Locator;

constructor(page: Page) {
        super(page);
        this.successMessage = page.getByText('Account Created!');
        this.continueButton = page.getByRole('link', { name: 'Continue' });
    }

    // Methods
    
    async verifyAccountCreated() {
        await this.successMessage.waitFor({ state: 'visible' });
    }
    
    async clickContinue() {
        await this.continueButton.click();
    }
    
    
}