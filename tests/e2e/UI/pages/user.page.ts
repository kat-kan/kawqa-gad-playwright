import { Locator, Page } from '@playwright/test';

export class UserPage {
  firstnameInput: Locator;
  lastnameInput: Locator;
  emailInput: Locator;
  passwordInput: Locator;
  registerButton: Locator;

  constructor(private page: Page) {
    this.firstnameInput = this.page.getByTestId('firstname-input');
    this.lastnameInput = this.page.getByTestId('lastname-input');
    this.emailInput = this.page.getByTestId('email-input');
    this.passwordInput = this.page.getByTestId('password-input');
    this.registerButton = this.page.getByTestId('register-button');
  }

  async createUser(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ): Promise<void> {
    await this.firstnameInput.fill(firstname);
    await this.lastnameInput.fill(lastname);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.registerButton.click();
  }
}
