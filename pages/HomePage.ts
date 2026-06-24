import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage{
    readonly signUpButton: Locator;
    readonly productsButton: Locator;
    

    constructor(page: Page) {
        super(page);

    this.signUpButton = page.getByRole('link', { name: 'Signup / Login' });     
    this.productsButton = page.locator('.navbar-nav').getByText('Products');    }

    // Methods
    async assertOnHomePage() {
        await expect(this.page).toHaveURL('/');
    }

    async clickSignUpButton() {
        await this.signUpButton.click();
    }

    async clickProductsButton() {
        await this.productsButton.click();
    }

    async verifyLoggedInUser(username: string) {
        await expect(this.page.getByText(`Logged in as ${username}`)).toBeVisible();
}
}