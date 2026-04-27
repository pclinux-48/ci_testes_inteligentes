import { expect, type Page } from '@playwright/test';
import type { TestUser } from '../utils/test-data';

export class AutomationExercisePage {
  constructor(private readonly page: Page) {}

  async open(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async openLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async signup(user: TestUser): Promise<void> {
    await this.page.locator('[data-qa="signup-name"]').fill(user.name);
    await this.page.locator('[data-qa="signup-email"]').fill(user.email);
    await this.page.getByRole('button', { name: /signup/i }).click();
  }

  async completeAccountCreation(user: TestUser): Promise<void> {
    await this.page.locator('#id_gender1').check();
    await this.page.locator('[data-qa="password"]').fill(user.password);
    await this.page.locator('[data-qa="days"]').selectOption('10');
    await this.page.locator('[data-qa="months"]').selectOption('5');
    await this.page.locator('[data-qa="years"]').selectOption('1999');
    await this.page.locator('[data-qa="first_name"]').fill(user.firstName);
    await this.page.locator('[data-qa="last_name"]').fill(user.lastName);
    await this.page.locator('[data-qa="company"]').fill(user.company);
    await this.page.locator('[data-qa="address"]').fill(user.address);
    await this.page.locator('[data-qa="country"]').selectOption(user.country);
    await this.page.locator('[data-qa="state"]').fill(user.state);
    await this.page.locator('[data-qa="city"]').fill(user.city);
    await this.page.locator('[data-qa="zipcode"]').fill(user.zipcode);
    await this.page.locator('[data-qa="mobile_number"]').fill(user.mobileNumber);
    await this.page.locator('[data-qa="create-account"]').click();
    await expect(this.page.getByText('Account Created!')).toBeVisible();
    await this.page.getByRole('link', { name: /continue/i }).click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.locator('[data-qa="login-email"]').fill(email);
    await this.page.locator('[data-qa="login-password"]').fill(password);
    await this.page.getByRole('button', { name: /login/i }).click();
  }

  async deleteAccount(): Promise<void> {
    await this.page.getByRole('link', { name: /delete account/i }).click();
    await expect(this.page.getByText('Account Deleted!')).toBeVisible();
  }

  async searchProduct(term: string): Promise<void> {
    await this.page.goto('/products');
    await this.page.locator('#search_product').fill(term);
    await this.page.locator('#submit_search').click();
  }

  async assertLoggedUser(userName: string): Promise<void> {
    await expect(this.page.getByText(`Logged in as ${userName}`)).toBeVisible();
  }
}
