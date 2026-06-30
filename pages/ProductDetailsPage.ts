import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage'; 

export class ProductDetailsPage extends BasePage { 
  readonly productNameHeading: Locator;
  readonly productInfoContainer: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productNameHeading = page.locator('.product-information h2');
    this.productInfoContainer = page.locator('.product-information');
    this.addToCartButton = page.locator('.product-information button.cart');
  }

  async verifyProductNameIsVisibleAndNotEmpty() {
    await expect(this.productNameHeading).toBeVisible({ timeout: 5000 });
    await expect(this.productNameHeading).not.toBeEmpty();
  }

  async verifyProductDetailsArePresent() {
    await expect(this.productInfoContainer.locator('p:has-text("Category:")')).toBeVisible();    
    await expect(this.productInfoContainer.locator('span:has-text("Rs.")').first()).toBeVisible(); 
    await expect(this.productInfoContainer.locator('p:has-text("Availability:")')).toBeVisible();
    await expect(this.productInfoContainer.locator('p:has-text("Condition:")')).toBeVisible();
    await expect(this.productInfoContainer.locator('p:has-text("Brand:")')).toBeVisible();

    // Verify sections are not empty placeholders
    await expect(this.productInfoContainer.locator('p:has-text("Category:")')).not.toBeEmpty();
    await expect(this.productInfoContainer.locator('p:has-text("Availability:")')).not.toBeEmpty();
    await expect(this.productInfoContainer.locator('p:has-text("Condition:")')).not.toBeEmpty();
    await expect(this.productInfoContainer.locator('p:has-text("Brand:")')).not.toBeEmpty();
  }

  async verifyAddToCartButtonPresent(){
    await expect(this.addToCartButton).toBeVisible();
  }
}