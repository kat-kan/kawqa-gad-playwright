import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { logConsole } from '@_src_api/utils/log-levels';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';

test.describe('GET/users endpoint tests', async () => {
  const users: string = '/api/users';

  test('Returns 200 OK - without authorization', async ({ request }) => {
    // When
    const response: APIResponse = await request.get(users);
    // Then
    expect(response.status()).toBe(HttpStatusCode.Ok);
  });

  test('Returns 200 OK - with authorization', async ({ request }) => {
    const userTypes = ['regular', 'admin'];
    for (const userType of userTypes) {
      // Given
      const setHeaders = await createHeaders(userType);
      // When
      const response: APIResponse = await request.get(users, {
        headers: setHeaders,
      });
      // Then
      expect(response.status()).toBe(HttpStatusCode.Ok);
    }
  });

  test('Checks masking sensitive user data - without authorization', async ({
    request,
  }) => {
    // When
    const response: APIResponse = await request.get(users);
    const responseBody = await response.json();
    // Then
    responseBody.forEach((user) => {
      try {
        expect(user.email).toEqual('****');
        expect(user.lastname).toEqual('****');
        expect(user.password).toEqual('****');
      } catch (error) {
        logConsole(`Data leak for user: ${user.id}`);
      }
    });
  });

  test('Checks masking sensitive user data - with authorization', async ({
    request,
  }) => {
    const userTypes = ['regular', 'admin'];
    for (const userType of userTypes) {
      // Given
      const setHeaders = await createHeaders(userType);
      // When
      const response: APIResponse = await request.get(users, {
        headers: setHeaders,
      });
      const responseBody = await response.json();
      // Then
      responseBody.forEach((user) => {
        try {
          expect(user.email).toEqual('****');
          expect(user.lastname).toEqual('****');
          expect(user.password).toEqual('****');
        } catch (error) {
          logConsole(`Data leak for user: ${user.id}`);
        }
      });
    }
  });
});
