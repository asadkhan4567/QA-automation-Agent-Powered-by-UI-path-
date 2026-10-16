import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/**
 * Test data. SauceDemo publishes these demo users and the shared password on its login page;
 * they are public fixtures, not secrets. Override via env for other environments.
 */
export const users = {
  standard: process.env.QA_STANDARD_USER ?? 'standard_user',
  lockedOut: process.env.QA_LOCKED_USER ?? 'locked_out_user',
  password: process.env.QA_PASSWORD ?? 'secret_sauce',
};

type Pages = { loginPage: LoginPage; inventoryPage: InventoryPage; checkoutPage: CheckoutPage };

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
});

export { expect } from '@playwright/test';
