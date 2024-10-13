import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { testUsers } from '@_src_fixtures_api/auth';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';
import { customDate } from 'test-data/shared/date.generator';

test.describe('DELETE articles/{id}', () => {
  const articles: string = `/api/articles`;
  let setHeaders: { [key: string]: string };

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
  });

  test('returns 200 status code when delete an article after create', async ({
    request,
  }) => {
    // Given: an article is created
    const articleTitle: string = 'New Article';
    const articleBody: string = 'This is the content of the new article.';
    const articleDate: string = customDate.pastDate;
    const articleImage: string = 'image.jpg';

    const createResponse: APIResponse = await request.post(articles, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: articleTitle,
        body: articleBody,
        date: articleDate,
        image: articleImage,
      },
    });
    const createdArticle = await createResponse.json();
    const createdArticleID = createdArticle.id;

    // When: The article is deleted
    const deleteResponse: APIResponse = await request.delete(
      `${articles}/${createdArticleID}`,
      {
        headers: setHeaders,
      },
    );

    // Then: The response status code should be 200
    expect(deleteResponse.status()).toBe(HttpStatusCode.Ok);
  });

  test('returns 404 status code when delete a non-existent article', async ({
    request,
  }) => {
    // Given: An article ID that does not exist
    const nonExistentArticleID = -1;

    // When: Attempting to delete the non-existent article
    const response = await request.delete(
      `${articles + nonExistentArticleID}`,
      {
        headers: setHeaders,
      },
    );

    // Then: The response status code should be 404
    expect(response.status()).toBe(HttpStatusCode.NotFound);
  });
});
