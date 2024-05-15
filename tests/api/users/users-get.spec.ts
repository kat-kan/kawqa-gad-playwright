import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { APIResponse, expect, test } from '@playwright/test';

test.describe('GET/users endpoint tests', async () => {
  const users: string = '/api/users';

  test('Returns all users with 200 OK - without authorization', async ({
    request,
  }) => {
    // When
    const response: APIResponse = await request.get(users);
    // Then
    expect(response.status()).toBe(HttpStatusCode.Ok);
  });
});
