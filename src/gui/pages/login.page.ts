import { BasePage } from './base.page';
import { WelcomePage } from './welcome.page';
import { Page } from '@playwright/test';
import { userDataInterface } from 'src/shared/interfaces/user.interface';

export class LoginPage extends BasePage {
  url = 'login';
  userEmailInput = this.page.getByPlaceholder('Enter User Email');
  userPasswordInput = this.page.locator('#password');
  loginButton = this.page.locator('#loginButton');

  constructor(page: Page) {
    super(page);
  }

  async login(userData: userDataInterface): Promise<WelcomePage> {
    await this.userEmailInput.fill(userData.email);
    await this.userPasswordInput.fill(userData.password);
    await this.loginButton.click();

    return new WelcomePage(this.page);
  }
}
