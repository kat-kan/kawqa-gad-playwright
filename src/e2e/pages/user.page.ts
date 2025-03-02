import { generateRandomValidUser } from '../../../tests/e2e/data-generators/testDataHelpers';
import { Locator, Page } from '@playwright/test';

export class UserPage {
  firstNameInput: Locator;
  lastNameInput: Locator;
  emailInput: Locator;
  passwordInput: Locator;
  registerButton: Locator;

  constructor(private page: Page) {
    this.firstNameInput = this.page.getByTestId('firstname-input');
    this.lastNameInput = this.page.getByTestId('lastname-input');
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
    await this.firstNameInput.fill(firstname);
    await this.lastNameInput.fill(lastname);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.registerButton.click();
  }

  async registerRandomUser() {
    const userData = generateRandomValidUser();
    await this.createUser(
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.password,
    );
  }
}
