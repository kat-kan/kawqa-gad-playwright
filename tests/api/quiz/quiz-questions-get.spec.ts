import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { UserType } from '@_src_api/enums/user-types.enum';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import test, { APIResponse, expect } from '@playwright/test';

test.describe('GET quiz questions endpoint tests', async () => {
  const quizQuestions: string = '/api/quiz/questions';
  const errorKey: string = 'error';

  test('Returns 200 OK with authorization', async ({ request }) => {
    //Given
    const setHeaders = await createHeaders(UserType.Custom);
    // When
    const response: APIResponse = await request.get(quizQuestions, {
      headers: setHeaders,
    });

    // Then
    const responseBody = await response.json();
    expect.soft(response.status()).toBe(HttpStatusCode.Ok);
    expect.soft(Object.keys(responseBody)).not.toContain(errorKey);
    expect.soft(Object.keys(responseBody).length).toBeGreaterThan(0);
  });

  test('Returns 401 Unauthorized without authorization', async ({
    request,
  }) => {
    //Given
    const errorMessage = 'Access token not provided!';

    // When
    const response: APIResponse = await request.get(quizQuestions);

    // Then
    const responseBody = await response.json();
    expect.soft(response.status()).toBe(HttpStatusCode.Unauthorized);
    expect.soft(Object.keys(responseBody)).toContain(errorKey);
    expect.soft(responseBody.error.message).toEqual(errorMessage);
  });
});
