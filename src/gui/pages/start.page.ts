import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class StartPage extends BasePage {
  url = '/';
  articlesButton = this.page.locator('a[href="./articles.html"]');

  constructor(page: Page) {
    super(page);
  }
}
