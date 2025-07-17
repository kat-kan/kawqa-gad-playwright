import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class ArticlePage extends BasePage {
  articleDateInDetails: Locator;

  constructor(page: Page) {
    super(page);
    this.articleDateInDetails = this.page.locator(
      'tr:has(label:has-text("date:")) span',
    );
  }

  getArticleTitle(): Locator {
    return this.page.getByTestId('article-title');
  }
}
