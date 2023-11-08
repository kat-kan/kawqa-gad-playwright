import { test, expect } from "@playwright/test";
import { createHeaders } from "../../src/helpers/api/create-token.helper";
import { testUser } from "../../src/fixtures/api/auth";

test.describe("PATCH articles/{id} endpoint tests", async () => {
  let baseURL = process.env.BASE_URL;
  let setHeaders: any;
  const newTitle = "How to start writing effective test cases in Gherkin";
  const newContent = "Start with a Feature Description:\nBegin each Gherkin feature file with a high-level description\n of the feature you are testing. This provides context for the scenarios that follow\n Example: \nFeature: User Authentication \nAs a user,\nI want to be able to log in to my account,\nSo that I can access my personalized content.";

  test.beforeAll(async () => {
    // Given token is created
    setHeaders = await createHeaders();
  });

  test("Should return OK Status Code when updating article", async ({ request }) => {
    const expectedResponseCode = 200;

    // When PATCH request is sent to ARTICLES/1 endpoint with payload
    const response = await request.patch(`${baseURL}/api/articles/1`, {
      // And both access token and application/json as content-type are set in headers
      headers: setHeaders,
      // And request body in JSON format is used with a new title and a new content
      data: {
        "user_id": testUser.userId,
        "title": newTitle,
        "body": newContent
      }
    });

    // Then response status code should be 200
    const code = response.status();
    //console.log(`response.status is: ${code}`);
    expect(code).toBe(expectedResponseCode);

    // And response body should have a new title
    const body = await response.json();
    expect(body.title).toBe(newTitle);

    // And response body should have a new content
    expect(body.body).toBe(newContent);
  });

  test("Should return NotFound status code when trying to update article", async ({ request }) => {
    const expectedResponseCode = 404;

    // When PATCH request is sent to ARTICLES/1 endpoint with payload
    const response = await request.patch(`${baseURL}/api/articles/0`, {
      // And both valid access token and application/json as content-type are set in headers
      headers: setHeaders,
      // And request body in JSON format is used with a new title and a new content
      data: {
        "user_id": testUser.userId,
        "title": newTitle,
        "body": newContent
      }
    });

    // Then response status code should be 404
    const code = response.status();
    //console.log(`response.status is: ${code}`);
    expect(code).toBe(expectedResponseCode);
  });
});
