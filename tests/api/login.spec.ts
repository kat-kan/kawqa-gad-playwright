import { test, expect } from '@playwright/test';
import { testUsers } from '@_src_fixtures_api/auth';
import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';

test.describe('Login endpoint tests', async () => {
  let accessToken;
  const login = `/api/login`;
  test('Returns 200 OK for correct login credentials', async ({
    request,
  }) => {
    // When POST request is sent to LOGIN endpoint
    const response = await request.post(login, {
      // And request body is in JSON format with proper login credentials
      data: {
        email: testUsers.regularUser.email,
        password: testUsers.regularUser.password,
      },
    });

    // Then status code should be 200
    const code = response.status();
    expect(code).toBe(HttpStatusCode.Ok);

    // And response body should have "access_token" string
    const body = await response.json();
    expect(JSON.stringify(body)).toContain('access_token');

    // And access_token should not be empty
    expect(body.access_token?.length).toBeGreaterThan(0);

    // saving access token for next tests
    //console.log(JSON.stringify(body));
    accessToken = `Bearer ${body.access_token}`;
    //console.log(accessToken);
  });

  test('Returns Unauthorized status code when logging in with incorrect credentials', async ({
    request,
  }) => {
    const incorrectPassword = 'wrongPassword';
    const expectedErrorMessage = 'Incorrect email or password';

    // When POST request is sent to LOGIN endpoint
    const response = await request.post(login, {
      // And request body in JSON format is used with proper login credentials
      data: {
        email: testUsers.regularUser.email,
        password: incorrectPassword,
      },
    });

    // Then response status code should be 401
    const code = response.status();
    expect(code).toBe(HttpStatusCode.Unauthorized);

    // And response body should have "Incorrect email or password" error message
    const body = await response.json();
    expect(body.message).toBe(HttpStatusCode.Unauthorized);
  });
});
