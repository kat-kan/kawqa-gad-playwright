import { expect, test } from '@playwright/test';
import { ArticlesPage } from 'src/gui/pages/articles.page';

test.describe('Articles page visual tests', () => {
  let articlesPage: ArticlesPage;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    await page.goto(articlesPage.url);
  });

  test('Verification of screenshot of article page', async ({ page }) => {
    await expect(page).toHaveScreenshot('articlesPage.png', {
      mask: [
        articlesPage.articleCards,
        articlesPage.totalPages,
        articlesPage.sortingSelect,
      ],
      maxDiffPixelRatio: 0.04,
    });
  });
});
