import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { APIResponse, expect, test } from '@playwright/test';

test.describe('GET/comments endpoint tests', async () => {
  const articles: string = `/api/comments`;

  test('Returns 200 OK for all comments', async ({ request }) => {
    // When
    const response: APIResponse = await request.get(articles);
    // Then
    expect(response.status()).toBe(HttpStatusCode.Ok);
  });
});
