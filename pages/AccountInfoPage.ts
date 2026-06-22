import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AccountInfoPage extends BasePage{
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
    readonly zipcodeInput: Locator;
    readonly mobileNumberInput: Locator;

    readonly createAccountButton: Locator;
    

 constructor(page: Page) {
        super(page);
        
        this.mrTitle = page.getByRole('radio', { name: 'Mr.' });
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
        this.stateInput = page.getByRole('textbox', { name: 'State' });
        this.cityInput = page.getByRole('textbox', { name: 'City' });
        this.zipcodeInput = page.getByRole('textbox', { name: 'Zipcode' });
        this.mobileNumberInput = page.getByRole('textbox', { name: 'Mobile Number *' });
        this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
        //this.mobileNumberInput = page.getByRole('textbox', { name: 'Mobile Number *' });
 }
   async selectTitle() {
        await this.mrTitle.check();
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

    async fillCity(city: string) {
        await this.cityInput.fill(city);
    }

    async fillZipcode(zipcode: string) {
        await this.zipcodeInput.fill(zipcode);
    }

    async fillMobileNumber(mobileNumber: string) {
        await this.mobileNumberInput.fill(mobileNumber);
    }

    async clickCreateAccount() {
        await this.createAccountButton.click();
    }
}