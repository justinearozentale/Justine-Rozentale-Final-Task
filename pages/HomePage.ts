import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage{
    readonly signUpButton: Locator;
    readonly productsButton: Locator;
    readonly emailInput: Locator;
    readonly subscribeButton: Locator;
    readonly successMessage: Locator;
    readonly LoggedInUser: Locator;
    
    

    constructor(page: Page) {
        super(page);

    this.signUpButton = page.getByRole('link', { name: 'Signup / Login' });     
    this.productsButton = page.locator('.navbar-nav').getByText('Products');
    this.emailInput = page.locator('#susbscribe_email');
    this.subscribeButton = page.locator('#subscribe');
    this.successMessage = page.locator('#success-subscribe');
    this.LoggedInUser = page.locator('text=Logged in as')

    }
    // Methods
    async assertOnHomePage() {
        await expect(this.page).toHaveURL('/');
    }

    async clickSignUpButton() {
        await this.signUpButton.click({ force: true });
    }

    async clickProductsButton() {
        await this.productsButton.click();
    }

    async verifyLoggedInUser(username: string) {
        await expect(this.page.getByText(`Logged in as ${username}`)).toBeVisible();
}

    async subsribeToNewsletter(email: string) {
        await this.emailInput.click();
        await this.emailInput.fill(email);
        await this.subscribeButton.click();
    }
}