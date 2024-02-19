import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { test, APIResponse, expect } from '@playwright/test';

test.describe('GET all articles endpoint tests', async () => {
  const articles: string = `/api/articles`;

  test('Returns 200 OK for all articles', async ({ request }) => {
    // Given
    const expectedStatusCode = HttpStatusCode.Ok;
    // When
    const response: APIResponse = await request.get(articles);
    // Then
    expect(response.status()).toBe(expectedStatusCode);
  });
});
