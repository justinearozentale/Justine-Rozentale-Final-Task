import { Locator, Page } from "@playwright/test";

export class BasePage {
    constructor(readonly page: Page) {}

    //protected async waitForVisible(locator: Locator, timeout = 10000) {
        //await locator.waitFor({ state: 'visible', timeout });
    //}

    //protected async clickWhenVisible(locator: Locator, timeout = 10000) {
        //await this.waitForVisible(locator, timeout);
        //await locator.scrollIntoViewIfNeeded();
        //await locator.click({ force: true });
    //}

    //protected async fillWhenVisible(locator: Locator, value: string, timeout = 10000) {
        //await this.waitForVisible(locator, timeout);
        //await locator.scrollIntoViewIfNeeded();
        //await locator.fill(value);
    //}
}