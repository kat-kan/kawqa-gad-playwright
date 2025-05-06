import { expect, test } from '@playwright/test';
import { ArticlesPage } from 'src/gui/pages/articles.page';

test.describe('Articles page visual tests', () => {
  let articlesPage: ArticlesPage;
  let articleCards;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    await page.goto(articlesPage.url);

    articleCards = page.locator('[data-testid^="article-"]');
  });

  test('Verification of screenshot of article page', async ({ page }) => {
    await expect(page).toHaveScreenshot('articlesPage.png', {
      mask: [articleCards],
      maxDiffPixelRatio: 0.04,
    });
  });

  test('Verification of screenshot of articles page (full page)', async ({
    page,
  }) => {
    await expect(page).toHaveScreenshot('articlesFullPage.png', {
      fullPage: true,
      mask: [articleCards],
      maxDiffPixels: 70,
      maxDiffPixelRatio: 0.03,
    });
  });
});
