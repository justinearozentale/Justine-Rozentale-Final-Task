import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupLoginPage extends BasePage {
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly signupButton: Locator;
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);

        this.nameInput = page.locator('[data-qa="signup-name"]');
        this.emailInput = page.locator('[data-qa="signup-email"]');
        this.signupButton = page.locator('[data-qa="signup-button"]');
        this.loginEmailInput = page.locator('[data-qa="login-email"]');
        this.loginPasswordInput = page.locator('[data-qa="login-password"]');
        this.loginButton = page.locator('[data-qa="login-button"]');
    }

    async fillSignupForm(name: string, email: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.signupButton.click();

        // await the structural registration setup route redirect
        await this.page.waitForURL('**/signup', { timeout: 10000 });
    }

  async login(email: string, password: string) {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.loginButton.click();

        // If the server oes blank, it forces a clean reload.
        await this.page.waitForURL('**/', { timeout: 4000 }).catch(async () => {
            console.log("⚠️ Server hung during login redirection. Triggering refresh step...");
            await this.page.reload({ waitUntil: 'load' }).catch(() => {});
        });
    }

}