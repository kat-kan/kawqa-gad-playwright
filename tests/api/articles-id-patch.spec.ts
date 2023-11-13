import { APIResponse, test, expect } from "@playwright/test";
import { createToken, createHeaders, createInvalidHeaders } from "@_src_helpers_api/create-token.helper";
import { testUser } from "@_src_fixtures_api/auth";

test.describe("PATCH articles/{id} endpoint tests", async () => {
  let baseURL = process.env.BASE_URL;
  let setHeaders, setInvalidHeaders;
  const newTitle = "How to start writing effective test cases in Gherkin";
  const newContent = "Start with a Feature Description:\nBegin each Gherkin feature file with a high-level description\n of the feature you are testing. This provides context for the scenarios that follow\n Example: \nFeature: User Authentication \nAs a user,\nI want to be able to log in to my account,\nSo that I can access my personalized content.";
  let newTitleExceedingLengthLimit = "test".repeat(10001);

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
    setInvalidHeaders = await createInvalidHeaders();
  });

  /* The 2nd time the request is run it returns 401 Unauthorized status code and the request to {baseURL}/api/restoreDB has to be sent to restore DB to the default one
 The request works always only with admin credentials */
  test("Returns 200 OK status code when updating article", async ({ request }) => {
    // Given
    const expectedResponseCode = 200;

    // When
    const response: APIResponse = await request.patch(`${baseURL}/api/articles/1`, {
      headers: setHeaders,
      data: {
        "user_id": testUser.userId,
        "title": newTitle,
        "body": newContent
      }
    });

    // Then
    const code = response.status();
    expect(code).toBe(expectedResponseCode);

    const body = await response.json();
    expect(body.title).toBe(newTitle);
    expect(body.body).toBe(newContent);
  });

  test("Returns 404 NotFound status code when trying to update non-existing article", async ({ request }) => {
    // Given
    const expectedResponseCode = 404;

    // When
    const response: APIResponse = await request.patch(`${baseURL}/api/articles/0`, {
      headers: setHeaders,
      data: {
        "user_id": testUser.userId,
        "title": newTitle,
        "body": newContent
      }
    });

    // Then
    const code = response.status();
    expect(code).toBe(expectedResponseCode);
  });

  test("Returns 401 Unauthorized status code when trying to update existing article with random text as token", async ({ request }) => {
    // Given
    const expectedResponseCode = 401;
    const expectedErrorMessage = 'Access token not provided!';

    // When
    const response: APIResponse = await request.patch(`${baseURL}/api/articles/1`, {
      headers: setInvalidHeaders,
      data: {
        "user_id": testUser.userId,
        "title": newTitle,
        "body": newContent
      }
    });

    // Then
    const code = response.status();
    expect(code).toBe(expectedResponseCode);

    const body = await response.json();
    console.log(body);
    expect(body.error.message).toBe(expectedErrorMessage);
  });

  test("Returns 401 Unauthorized status code when trying to update article added by different user", async ({ request }) => {
    // Given
    const expectedResponseCode = 401;
    const expectedErrorMessage = 'Access token for given user is invalid!';
    // When
    const response: APIResponse = await request.patch(`${baseURL}/api/articles/2`, {
      headers: setHeaders,
      data: {
        "user_id": testUser.userId,
        "title": newTitle,
        "body": newContent
      }
    });

    // Then
    const code = response.status();
    expect(code).toBe(expectedResponseCode);

    const body = await response.json();
    console.log(body);
    expect(body.error.message).toBe(expectedErrorMessage);
  });

  test("Returns 400 Bad Request status code when trying to update existing article with malformed JSON", async ({ request }) => {
    // Given
    const malformedJson: string = `{
        "user_id": "${testUser.userId}",
        "title: ${newTitle},
        "body": "${newContent}" 
      }`;
    const expectedResponseCode = 400;

    // When
    const response: APIResponse = await request.patch(`${baseURL}/api/articles/1`, {
      headers: setHeaders,
      data: malformedJson
    });

    // Then
    const code = response.status();
    expect(code).toBe(expectedResponseCode);
  });

  /* The 2nd time the request is run it returns 401 Unauthorized status code and the request to {baseURL}/api/restoreDB has to be sent to restore DB to the default one */
  test("Returns 422 Unprocessable Entity status code when trying to update existing article with title that exceeds length limit", async ({ request }) => {
    // Given
    setHeaders = await createHeaders();
    const expectedResponseCode = 422;
    const expectedErrorMessage = 'One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: \"title\" longer than \"10000\"';

    // When 
    const response: APIResponse = await request.patch(`${baseURL}/api/articles/1`, {
      headers: setHeaders,
      data: {
        "user_id": testUser.userId,
        "title": `${newTitleExceedingLengthLimit}`
      }
    });

    // Then
    const code = response.status();
    expect(code).toBe(expectedResponseCode);

    const body = await response.json();
    console.log(body);
    expect(body.error.message).toBe(expectedErrorMessage);
  });

  test("Returns 200 OK status code when updating as admin existing article with title that normally exceeds length limit", async ({ request }) => {
    // Given
    let token = await createToken("admin", "admin");
    const expectedResponseCode = 200;

    // When 
    const response: APIResponse = await request.patch(`${baseURL}/api/articles/1`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      data: {
        "user_id": testUser.userId,
        "title": `${newTitleExceedingLengthLimit}`
      }
    });

    // Then
    const code = response.status();
    expect(code).toBe(expectedResponseCode);

    const body = await response.json();
    console.log(body);
    expect(body.title).toBe(newTitleExceedingLengthLimit);
  });
});
