import { expect, test } from '@playwright/test';
import { ArticlesPage } from 'src/gui/pages/articles.page';

test.describe('Articles page visual tests', () => {
  let articlesPage: ArticlesPage;
  let bodyElements,
    titleElements,
    userElements,
    dateElements,
    paginationElement;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    await page.goto(articlesPage.url);

    bodyElements = page.locator(
      '[data-testid^="article-"][data-testid$="-body"]',
    );
    titleElements = page.locator(
      '[data-testid^="article-"][data-testid$="-title"]',
    );
    userElements = page.locator(
      '[data-testid^="article-"][data-testid$="-user"]',
    );
    dateElements = page.locator(
      '[data-testid^="article-"][data-testid$="-date"]',
    );
    paginationElement = page.locator('[data-testid="total-pages"]');
  });

  test('Verification of screenshot of article page', async ({ page }) => {
    await expect(page).toHaveScreenshot('articlesPage.png', {
      mask: [
        bodyElements,
        titleElements,
        userElements,
        dateElements,
        paginationElement,
      ],
      maxDiffPixelRatio: 0.04,
    });
  });

  test('Verification of screenshot of articles page (full page)', async ({
    page,
  }) => {
    await expect(page).toHaveScreenshot('articlesFullPage.png', {
      fullPage: true,
      mask: [
        bodyElements,
        titleElements,
        userElements,
        dateElements,
        paginationElement,
      ],
      maxDiffPixels: 70,
      maxDiffPixelRatio: 0.03,
    });
  });
});
