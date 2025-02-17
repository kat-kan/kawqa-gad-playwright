import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class WelcomePage extends BasePage {
  url = '/welcome';
  title = this.page.getByTestId('hello');

  constructor(page: Page) {
    super(page);
  }
}
