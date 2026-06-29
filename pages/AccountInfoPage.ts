import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AccountInfoPage extends BasePage {
    //core details
    readonly mrTitle: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator
    readonly passwordInput: Locator;

    readonly daysDropdown: Locator;
    readonly monthsDropdown: Locator;
    readonly yearsDropdown: Locator;
   
    //aditional details
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly addressInput: Locator;
    readonly countryDropdown: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipCodeInput: Locator;
    readonly mobileNumberInput: Locator;

    readonly createAccountButton: Locator;
    readonly closeAdButton: Locator;
    

 constructor(page: Page) {
        super(page);
        
        this.mrTitle = page.locator('#uniform-id_gender1');
        this.nameInput = page.locator('#name');
        this.emailInput = page.locator('#email');
        this.passwordInput = page.getByRole('textbox', { name: 'Password *' });

        this.daysDropdown = page.locator('#days');
        this.monthsDropdown = page.locator('#months');
        this.yearsDropdown = page.locator('#years');

        this.firstNameInput = page.getByRole('textbox', { name: 'First name *' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last name *' });
        this.addressInput = page.getByRole('textbox', { name: 'Address *' });
        this.countryDropdown = page.locator('#country');
        this.stateInput = page.locator('#state');
        this.cityInput = page.locator('#city');
        this.zipCodeInput = page.locator('#zipcode');
        this.mobileNumberInput = page.locator('#mobile_number');
        this.createAccountButton = page.getByRole('button', { name: 'Create Account' });

        this.closeAdButton = page.locator('.fa-angle-down');

 }
   async selectTitle() {
    await this.mrTitle.click();
   }
    async fillName(name: string) {
        await this.nameInput.fill(name);
    }

   async verifyEmailField() {
        await this.emailInput.waitFor({ state: 'visible' });
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }
    async selectDateOfBirth(day: string, month: string, year: string) {
        await this.daysDropdown.selectOption(day);
        await this.monthsDropdown.selectOption(month);
        await this.yearsDropdown.selectOption(year);
    }

   async fillFirstName(firstName: string) {
        await this.firstNameInput.fill(firstName);
    }

    async fillLastName(lastName: string) {
        await this.lastNameInput.fill(lastName);
    }

    async fillAddress(address: string) {
        await this.addressInput.fill(address);
    }

    async selectCountry(country: string) {
        await this.countryDropdown.click();
        await this.countryDropdown.selectOption(country);
    }

    async fillState(state: string) {
        await this.stateInput.fill(state);
    }
    async closeBottomBannerIfPresent() {
        if (await this.closeAdButton.isVisible()) {
            await this.closeAdButton.click();
        }
    }
   
    async fillCity(city: string) {
        // Close any ad overlays that might block the field
        await this.closeBottomBannerIfPresent();
        
        // Ensure field is visible and scroll into view if needed
        await this.cityInput.scrollIntoViewIfNeeded();
        await this.cityInput.waitFor({ state: 'visible' });
        
        // Fill the city field
        await this.cityInput.fill(city);
    }
    async fillZipCode(zipcode: string) {
        await this.zipCodeInput.fill(zipcode);

    }

    async fillMobileNumber(mobileNumber: string) {
        await this.mobileNumberInput.fill(mobileNumber);
    }

    async clickCreateAccount() {
        await this.createAccountButton.click();
    }

    async closeAdIfPresent() {
        if (await this.closeAdButton.isVisible()) {
            await this.closeAdButton.click();
        }}

    /**
     * 👇 LECTURE REQUIREMENT WORKER METHOD
     * Wraps up all registration input sequences into a clean single action call.
     */
    async registerUser(user: { name: string; password: string }) {
        await this.selectTitle();
        await this.fillName(user.name);
        await this.verifyEmailField();
        await this.fillPassword(user.password);
        await this.selectDateOfBirth('12', 'January', '1990');
        await this.fillFirstName('Test User First Name');
        await this.fillLastName('Test User Last Name');
        await this.fillAddress('123 Test Street, Test City, Test Country');
        await this.selectCountry('United States');
        await this.fillState('Test State');
        await this.fillCity('Test City');
        await this.fillZipCode('12345');
        await this.fillMobileNumber('1234567890');
        await this.clickCreateAccount();
    }
}