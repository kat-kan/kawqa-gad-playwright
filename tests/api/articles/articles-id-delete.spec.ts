import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { testUsers } from '@_src_fixtures_api/auth';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';
import { customDate } from 'test-data/shared/date.generator';

test.describe('DELETE articles/{id}', () => {
  const articles: string = `/api/articles`;
  let setHeaders: { [key: string]: string };

  test.beforeAll(async () => {});

  test('returns 200 status code when delete a newly created article', async ({
    request,
  }) => {
    // Given the new article is created
    setHeaders = await createHeaders();
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
    const createdArticleId = createdArticle.id;
    await new Promise((f) => setTimeout(f, 500));

    // When
    const deleteResponse: APIResponse = await request.delete(
      `${articles}/${createdArticleId}`,
      {
        headers: setHeaders,
      },
    );

    // Then
    expect(deleteResponse.status()).toBe(HttpStatusCode.Ok);
  });
  test('returns 200 when admin user tries to delete article created by other user', async ({
    request,
  }) => {
    // Given the article is created by other (regular) user
    setHeaders = await createHeaders();
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
    const createdArticleId = createdArticle.id;
    await new Promise((f) => setTimeout(f, 500));

    // When admin user tries to delete the article
    setHeaders = await createHeaders('admin');
    const response = await request.delete(`${articles}/${createdArticleId}`, {
      headers: setHeaders,
    });

    // Then
    expect(response.status()).toBe(HttpStatusCode.Ok);
  });
  test('returns 401 when regular user tries to delete article created by other user', async ({
    request,
  }) => {
    // Given the article is created by other user (admin)
    setHeaders = await createHeaders('admin');
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
    const createdArticleId = createdArticle.id;
    await new Promise((f) => setTimeout(f, 500));

    // When regular user tries to delete the article
    setHeaders = await createHeaders();
    const response = await request.delete(`${articles}/${createdArticleId}`, {
      headers: setHeaders,
    });

    // Then
    expect(response.status()).toBe(HttpStatusCode.Unauthorized);
  });

  test('returns 404 status code when delete a non-existent article', async ({
    request,
  }) => {
    // Given
    const nonExistentArticleId = -1;

    // When
    const response = await request.delete(
      `${articles}/${nonExistentArticleId}`,
      {
        headers: setHeaders,
      },
    );

    // Then
    expect(response.status()).toBe(HttpStatusCode.NotFound);
  });
});
