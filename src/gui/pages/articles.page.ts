import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class ArticlesPage extends BasePage {
  url = '/articles.html';
  commentsButtonId = '#btnComments';
  commentsButton: Locator;
  articleCards: Locator;
  totalPages: Locator;
  sortingSelect: Locator;
  articleDateInDetails: Locator;

  constructor(page: Page) {
    super(page);
    this.commentsButton = this.page.locator(this.commentsButtonId);
    this.articleCards = this.page.locator('[data-testid^="article-"]');
    this.totalPages = this.page.locator('[data-testid="total-pages"]');
    this.sortingSelect = this.page.locator('[data-testid="sorting-select"]');
    this.articleDateInDetails = this.page.locator('tr:has(label:has-text("date:")) span');
  }

  getArticleCardById(id: number): Locator {
    return this.page.locator(`#article${id}.item-card`);
  }

  getArticleDateById(id: number): Locator {
    return this.page.locator(`[data-testid="article-${id}-date"]`);
  }

  getSeeMoreButtonById(id: number): Locator {
    return this.page.locator(`#seeArticle${id}`);
  }
}
