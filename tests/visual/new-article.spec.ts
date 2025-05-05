import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';
import { ArticlesPage } from 'src/gui/pages/articles.page';
import { testUsers } from 'src/shared/fixtures/auth';
import { customDate } from 'test-data/shared/date.generator';

test.describe('Article creation and visual verification', () => {
  const articlesEndpoint = `/api/articles`;
  const articleTitle =
    'Quick Error Handling Guide: What to Do When Coffee Leaks on Your Keyboard2';
  const articleBody =
    'Ah, the joys of being a programmer - navigating through the intricate world of code with the constant companionship of our trusted caffeinated beverages...';

  let setHeaders: { [key: string]: string };
  let createdArticleId: number;
  let articlesPage: ArticlesPage;

  test.beforeAll(async ({ request }) => {
    setHeaders = await createHeaders();

    const createResponse: APIResponse = await request.post(articlesEndpoint, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: articleTitle,
        body: articleBody,
        date: customDate.now,
      },
    });

    const responseBody = await createResponse.json();
    createdArticleId = responseBody.id;
  });

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    await page.goto(articlesPage.url);
  });

  test('Verification card screenshot of new article on articles page', async ({
    page,
  }) => {
    // Given
    const articleCard = page.locator(`#article${createdArticleId}.item-card`);
    const dateElement = page.locator(
      `[data-testid="article-${createdArticleId}-date"]`,
    );
    await articleCard.waitFor();

    // Then
    await expect(articleCard).toHaveScreenshot('new-article-card.png', {
      mask: [dateElement],
    });
  });

  test('Enter article details via "See More" and verify screenshot of new article', async ({
    page,
  }) => {
    // Given
    const seeMoreButton = page.locator(`#seeArticle${createdArticleId}`);
    await seeMoreButton.click();
    const dateInDetails = page.locator('tr:has(label:has-text("date:")) span');

    // Then
    await expect(page).toHaveScreenshot('article-details.png', {
      mask: [dateInDetails],
    });
  });
});
