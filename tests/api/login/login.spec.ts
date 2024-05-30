
import { test, expect } from '@playwright/test';
import { testUsers } from '@_src_fixtures_api/auth';
import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';

test.describe('Login endpoint tests', async () => {
  let accessToken;
  const login = `/api/login`;
  test('Returns 200 OK for correct login credentials', async ({
    request,
  }) => {
    // Given
    const expectedResponseCode = HttpStatusCode.Ok;

    // When
    const response = await request.post(login, {
      data: {
        email: testUsers.regularUser.email,
        password: testUsers.regularUser.password,
      },
    });

    // Then
    const code = response.status();
    expect(code).toBe(expectedResponseCode);

    const body = await response.json();
    expect(JSON.stringify(body)).toContain('access_token');
    expect(body.access_token?.length).toBeGreaterThan(0);

    accessToken = `Bearer ${body.access_token}`;
  });

  test('Returns Unauthorized status code when logging in with incorrect credentials', async ({
    request,
  }) => {
    // Given
    const incorrectPassword = 'wrongPassword';
    const expectedResponseCode = HttpStatusCode.Unauthorized;
    const expectedErrorMessage = 'Incorrect email or password';

    // When
    const response = await request.post(login, {
      data: {
        email: testUsers.regularUser.email,
        password: incorrectPassword,
      },
    });

    // Then
    const code = response.status();
    expect(code).toBe(expectedResponseCode);

    const body = await response.json();
    expect(body.message).toBe(expectedErrorMessage);
  });
});
