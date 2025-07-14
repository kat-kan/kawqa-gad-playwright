import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { UserType } from '@_src_api/enums/user-types.enum';
import { logConsole } from '@_src_api/utils/log-levels';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';

test.describe('GET/users endpoint tests', async () => {
  const maskedData: string = '****';
  const users: string = '/api/users';
  const userTypes: string[] = [UserType.Regular, UserType.Admin];

  test('Returns 200 OK - without authorization', async ({ request }) => {
    // When
    const response: APIResponse = await request.get(users);
    // Then
    expect(response.status()).toBe(HttpStatusCode.Ok);
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
        expect(user.email).toEqual(maskedData);
        expect(user.lastname).toEqual(maskedData);
        expect(user.password).toEqual(maskedData);
      } catch (error) {
        logConsole(`Data leak for user: ${user.id}`);
      }
    });
  });

  for (const userType of userTypes) {
    test(`Returns 200 OK - with ${userType} user authorization`, async ({
      request,
    }) => {
      // Given
      const setHeaders = await createHeaders(userType);
      // When
      const response: APIResponse = await request.get(users, {
        headers: setHeaders,
      });
      // Then
      expect(response.status()).toBe(HttpStatusCode.Ok);
    });

    test(`Checks masking sensitive user data - with ${userType} user authorization`, async ({
      request,
    }) => {
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
          expect(user.email).toEqual(maskedData);
          expect(user.lastname).toEqual(maskedData);
          expect(user.password).toEqual(maskedData);
        } catch (error) {
          logConsole(`Data leak for user: ${user.id}`);
        }
      });
    });
  }
});
