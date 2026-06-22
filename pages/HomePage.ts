import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage{
    readonly signUpButton: Locator;
    

    constructor(page: Page) {
        super(page);

    this.signUpButton = page.getByRole('link', { name: 'Signup / Login' });        
    }

    // Methods
    async assertOnHomePage() {
        await expect(this.page).toHaveURL('/');
    }

    async clickSignUpButton() {
        await this.signUpButton.click();
    }
}