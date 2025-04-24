import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class StartPage extends BasePage {
  url = '/';
  articlesHref = '[href="./articles.html"]';
  articlesButton = this.page.locator(`a${this.articlesHref}`);

  constructor(page: Page) {
    super(page);
  }
}
