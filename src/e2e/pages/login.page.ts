import { Locator, Page } from '@playwright/test';

export class LoginPage {
  loginInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
  keepMeSignedInCheckbox: Locator;
  userName: Locator;
  // assert
  alertPopUp: Locator;

  constructor(private page: Page) {
    this.loginInput = this.page.getByPlaceholder('Enter User Email');
    this.passwordInput = this.page.getByPlaceholder('Enter Password');
    this.keepMeSignedInCheckbox = this.page.getByText('keep me sign in');
    this.loginButton = this.page.getByRole('button', { name: 'LogIn' });
    this.userName = this.page.getByTestId('hello');
    // assert
    this.alertPopUp = this.page.getByTestId('alert-popup');
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.goto('/login/');
    await this.loginInput.fill(email);
    await this.passwordInput.fill(password);
    await this.keepMeSignedInCheckbox.click();
    await this.loginButton.click();
  }
}
