import { test, APIResponse, expect } from '@playwright/test';

test.describe('GET/articles/ Get all articles', async () => {
  let baseURL = process.env.BASE_URL;

  test('Returns 200 OK for all articles', async ({ request }) => {
    // Given
    const expectedStatusCode = 200;
    // When
    const response: APIResponse = await request.get(`${baseURL}/api/articles/`);
    // Then
    expect(response.status()).toBe(expectedStatusCode);
  });
});
