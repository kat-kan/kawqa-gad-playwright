import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class ArticlesPage extends BasePage {
  url = '/articles.html';
  commentsButtonId = '#btnComments';
  commentsButton = this.page.locator(this.commentsButtonId);

  constructor(page: Page) {
    super(page);
  }
}
