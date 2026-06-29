import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PaymentPage extends BasePage{
    readonly nameOnCardField: Locator;
    readonly cardNumberField: Locator;
    readonly cvcField: Locator;
    readonly expirationMonthField: Locator;
    readonly expirationYearField: Locator;
    readonly payAndConfirmOrderButton: Locator;

    constructor(page: Page) {
        super(page);

    this.nameOnCardField = page.locator('[data-qa="name-on-card"]');
    this.cardNumberField = page.locator('[data-qa="card-number"]');
    this.cvcField = page.locator('[data-qa="cvc"]');
    this.expirationMonthField = page.locator('[data-qa="expiry-month"]');
    this.expirationYearField = page.locator('[data-qa="expiry-year"]');
    this.payAndConfirmOrderButton = page.locator('[data-qa="pay-button"]');
}
    
   
    async fillNameOnCard(name: string) {
        await this.nameOnCardField.fill(name);
    }

    async fillCardNumber(cardNumber: string) {
        await this.cardNumberField.fill(cardNumber);
    }

    async fillCVC(cvc: string) {
        await this.cvcField.fill(cvc);
    }

    async fillExpirationMonth(expirationMonth: string) {
        await this.expirationMonthField.fill(expirationMonth);
    }

    async fillExpirationYear(expirationYear: string) {
        await this.expirationYearField.fill(expirationYear);
    }

    async clickPayAndConfirmOrder() {
        await this.payAndConfirmOrderButton.click({ force: true });
    }
}
