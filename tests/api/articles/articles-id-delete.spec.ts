import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { UserType } from '@_src_api/enums/user-types.enum';
import { createArticle } from '@_src_helpers_api/create-article.helper';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';
import { testUsers } from 'src/shared/fixtures/auth';
import { customDate } from 'test-data/shared/date.generator';

test.describe('DELETE articles/{id} @serial', () => {
  let headers: { [key: string]: string };

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
    headers = await createHeaders();
    const createdArticleId = await createArticle(articleData, request, headers);

    // When
    const deleteResponse: APIResponse = await request.delete(
      `${articles}/${createdArticleId}`,
      {
        headers: headers,
      },
    );

    // Then
    expect(deleteResponse.status()).toBe(HttpStatusCode.Ok);
  });

  test('returns 200 when admin user tries to delete article created by other user', async ({
    request,
  }) => {
    // Given the article is created by other (regular) user
    headers = await createHeaders();
    const createdArticleId = await createArticle(articleData, request, headers);

    // When admin user tries to delete the article
    headers = await createHeaders(UserType.admin);
    const response = await request.delete(`${articles}/${createdArticleId}`, {
      headers: headers,
    });

    // Then
    expect(response.status()).toBe(HttpStatusCode.Ok);
  });

  test('returns 401 when regular user tries to delete article created by other user', async ({
    request,
  }) => {
    // Given the article is created by other user (admin)
    headers = await createHeaders(UserType.admin);
    const createdArticleId = await createArticle(articleData, request, headers);

    // When regular user tries to delete the article
    headers = await createHeaders();
    const response = await request.delete(`${articles}/${createdArticleId}`, {
      headers: headers,
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
