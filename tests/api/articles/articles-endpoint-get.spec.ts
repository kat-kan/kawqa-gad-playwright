import { APIResponse, expect, test } from '@playwright/test';

test.describe('GET/articles endpoint tests', async () => {
  const baseUrl: string = process.env.BASE_URL;
  const articles: string = `${baseUrl}/api/articles`;

  test('Returns 200 OK for all articles', async ({ request }) => {
    // Given
    const expectedStatusCode = 200;
    // When
    const response: APIResponse = await request.get(articles);
    // Then
    expect(response.status()).toBe(expectedStatusCode);
  });
});
