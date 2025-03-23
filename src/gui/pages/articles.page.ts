import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class ArticlesPage extends BasePage {
  url = '/articles.html';
  commentsButton = this.page.locator('#btnComments');

  constructor(page: Page) {
    super(page);
  }
}
