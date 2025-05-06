import { expect, test } from '@playwright/test';
import { ArticlesPage } from 'src/gui/pages/articles.page';

test.describe('Articles page visual tests', () => {
  let articlesPage: ArticlesPage;
  let articleCards;
  let totalPages;
  let sortingSelect;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    await page.goto(articlesPage.url);

    articleCards = page.locator('[data-testid^="article-"]');
    totalPages = page.locator('[data-testid="total-pages"]');
    sortingSelect = page.locator('[data-testid="sorting-select"]');
  });

  test('Verification of screenshot of article page', async ({ page }) => {
    await expect(page).toHaveScreenshot('articlesPage.png', {
      mask: [articleCards, totalPages, sortingSelect],
      maxDiffPixelRatio: 0.04,
    });
  });
});
