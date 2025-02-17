import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { expect, test } from '@playwright/test';
import { testUsers } from 'src/shared/fixtures/auth';

test.describe('Login endpoint tests', async () => {
  const login = `/api/login`;
  test('Returns 200 OK for correct login credentials', async ({ request }) => {
    // When
    const response = await request.post(login, {
      data: {
        email: testUsers.regularUser.email,
        password: testUsers.regularUser.password,
      },
    });

    // Then
    const code = response.status();
    expect(code).toBe(HttpStatusCode.Ok);

    const body = await response.json();
    expect(JSON.stringify(body)).toContain('access_token');
    expect(body.access_token?.length).toBeGreaterThan(0);
  });

  test('Returns Unauthorized status code when logging in with incorrect credentials', async ({
    request,
  }) => {
    // Given
    const incorrectPassword = 'wrongPassword';
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
    expect(code).toBe(HttpStatusCode.Unauthorized);

    const body = await response.json();
    expect(body.message).toBe(expectedErrorMessage);
  });
});
