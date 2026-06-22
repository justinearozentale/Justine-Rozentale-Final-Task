import { expect, Page, Locator } from "@playwright/test";

export class BasePage {
    readonly consentButton: Locator;

    constructor(readonly page: Page) {
        // The "Consent" button has a role of button with the text 'Consent'
        this.consentButton = page.getByRole('button', { name: 'Consent' });
    }

    async acceptCookiesIfPresent() {
        // If the consent banner shows up, click it. If it doesn't, ignore it.
        if (await this.consentButton.isVisible({ timeout: 3000 })) {
            await this.consentButton.click();
        }
    }
}