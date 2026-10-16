import { type Locator, type Page, expect } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText('Products');
  }

  /** Product slug as used by SauceDemo test ids, e.g. "sauce-labs-backpack". */
  async addToCart(productSlug: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${productSlug}`).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
