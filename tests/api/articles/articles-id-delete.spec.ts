import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { testUsers } from '@_src_fixtures_api/auth';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';
import { customDate } from 'test-data/shared/date.generator';

test.describe('DELETE articles/{id}', () => {
  let setHeaders: { [key: string]: string };

  const articles = `/api/articles`;
  const articleData = {
    user_id: testUsers.regularUser.id,
    title: 'New Article',
    body: 'This is the content of the new article.',
    date: customDate.pastDate,
    image: 'image.jpg',
  };

  test('returns 200 status code when delete a newly created article', async ({
    request,
  }) => {
    // Given the new article is created
    setHeaders = await createHeaders();

    const createResponse: APIResponse = await request.post(articles, {
      headers: setHeaders,
      data: articleData,
    });
    const createdArticle = await createResponse.json();
    const createdArticleId = createdArticle.id;

    // Acc. to the GAD authors, there is a delay between POST request and actual creating the asset
    // To avoid flaky tests (when sometimes the delay is bigger) I used the polling technique
    await expect
      .poll(
        async () => {
          const getResponse: APIResponse = await request.get(
            `${articles}/${createdArticleId}`,
          );
          return getResponse.status();
        },
        {
          intervals: [100, 500, 1_000],
          timeout: 30_000,
        },
      )
      .toBe(HttpStatusCode.Ok);

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

    const createResponse: APIResponse = await request.post(articles, {
      headers: setHeaders,
      data: articleData,
    });
    const createdArticle = await createResponse.json();
    const createdArticleId = createdArticle.id;

    await expect
      .poll(
        async () => {
          const getResponse: APIResponse = await request.get(
            `${articles}/${createdArticleId}`,
          );
          return getResponse.status();
        },
        {
          intervals: [100, 500, 1_000],
          timeout: 30_000,
        },
      )
      .toBe(HttpStatusCode.Ok);

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

    const createResponse: APIResponse = await request.post(articles, {
      headers: setHeaders,
      data: articleData,
    });
    const createdArticle = await createResponse.json();
    const createdArticleId = createdArticle.id;

    await expect
      .poll(
        async () => {
          const getResponse: APIResponse = await request.get(
            `${articles}/${createdArticleId}`,
          );
          return getResponse.status();
        },
        {
          intervals: [100, 500, 1_000],
          timeout: 30_000,
        },
      )
      .toBe(HttpStatusCode.Ok);

    // When regular user tries to delete the article
    setHeaders = await createHeaders();
    const response = await request.delete(`${articles}/${createdArticleId}`, {
      headers: setHeaders,
    });

    // Then
    expect(response.status()).toBe(HttpStatusCode.Unauthorized);
  });
});

test('DELETE articles/{id} returns 404 on deleting a non-existent article', async ({
  request,
}) => {
  // Given
  const articles = `/api/articles`;
  const setHeaders = await createHeaders();
  const nonExistentArticleId = -1;

  // When
  const response = await request.delete(`${articles}/${nonExistentArticleId}`, {
    headers: setHeaders,
  });

  // Then
  expect(response.status()).toBe(HttpStatusCode.NotFound);
});
