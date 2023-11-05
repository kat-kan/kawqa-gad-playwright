import { test, expect } from "@playwright/test";
import { testUser } from "../../src/fixtures/api/auth";

test.describe("Login endpoint tests", async () => {
  let accessToken = "";
  let baseURL = process.env.BASE_URL;
  
  test("Login endpoint returns 200 OK for correct login credentials", async ({
    request,
  }) => {
    const expectedResponseCode = 200;

    //When POST request is send to LOGIN endpoint
    const response = await request.post(`${baseURL}/api/login`, {
      // And request body in JSON format is used with proper login credentials
      data: {
        email: testUser.userEmail,
        password: testUser.userPassword,
      },
    });

    //Then status code should be 200
    const code = response.status();
    expect(code).toBe(expectedResponseCode);

    // And response body should have "access_token" string
    const body = await response.json();
    expect(JSON.stringify(body)).toContain("access_token");

    // And access_token should not be empty
    expect(body.access_token?.length).toBeGreaterThan(0);

    // saving access token for next tests
    //console.log(JSON.stringify(body));
    accessToken = `Bearer ${body.access_token}`;
    //console.log(accessToken);
  });

  test("Login endpoint returns 401 Unauthorized for incorrect login credentials", async ({
    request,
  }) => {
    const incorrectPassword = "wrongPassword";
    const expectedResponseCode = 401;
    const expectedErrorMessage = "Incorrect email or password";

    //When POST request is send to LOGIN endpoint
    const response = await request.post(`${baseURL}/api/login`, {
      // And request body in JSON format is used with proper login credentials
      data: {
        email: testUser.userEmail,
        password: incorrectPassword,
      },
    });

    //Then status code should be 401
    const code = response.status();
    expect(code).toBe(expectedResponseCode);

    // And response body should have error message
    const body = await response.json();
    expect(body.message).toBe(expectedErrorMessage);
  });
});
