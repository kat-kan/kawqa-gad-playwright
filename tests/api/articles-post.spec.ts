import { testUser } from "@_src_fixtures_api/auth";
import { createHeaders } from "@_src_helpers_api/create-token.helper";
import test, { APIResponse, expect } from "@playwright/test";

test.describe("POST articles tests", async () => {
  let baseURL: string = process.env.BASE_URL;
  let setHeaders: any;
  let articlesEndpoint: string = "/api/articles";
  let articleTitle: string =
    "Quick Error Handling Guide: What to Do When Coffee Leaks on Your Keyboard";
  let articleBody: string =
    "Ah, the joys of being a programmer - navigating through the intricate world of code with the constant companionship of our trusted caffeinated beverages. But what happens when that comforting cup of coffee turns against us, staging a daring escape onto our precious keyboards? Fear not, for we present to you the Quick Error Handling Guide for such a perilous situation.";
  let articleDate: string = "2024-06-30T15:44:31Z";
  let articleImage: string = "coffee.jpg";

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
  });
  test("Returns 201 Created after creating article", async ({ request }) => {
    const response: APIResponse = await request.post(
      `${baseURL + articlesEndpoint}`,
      {
        headers: setHeaders,
        data: {
          user_id: testUser.userId,
          title: articleTitle,
          body: articleBody,
          date: articleDate,
          image: articleImage,
        },
      }
    );
    const responseBody = await response.json();
    console.log(responseBody);

    expect.soft(response.status()).toBe(201);
    expect.soft(responseBody.user_id).toBe(testUser.userId);
    expect.soft(responseBody.title).toBe(articleTitle);
    expect.soft(responseBody.body).toBe(articleBody);
    expect.soft(responseBody.date).toBe(articleDate);
    expect.soft(responseBody.image).toBe(articleImage);
    expect.soft(responseBody.id).not.toBeNull;
  });
  test("Returns 400 Bad Request after sending malformed JSON", async ({
    request,
  }) => {
    const malformedJson: string = `{
        "user_id": "${testUser.userId}",
        "title: ${articleTitle},  // error: missing closing quotation mark
        "body": "${articleBody}",
        "date": "${articleDate}",
        "image": "${articleImage}"
    }`;
    const response: APIResponse = await request.post(
      `${baseURL + articlesEndpoint}`,
      {
        headers: setHeaders,
        data: malformedJson,
      }
    );

    expect(response.status()).toBe(400);
  });
  test("Returns 422 Unprocessable content after sending article with missing required information", async ({
    request,
  }) => {
    const response: APIResponse = await request.post(
      `${baseURL + articlesEndpoint}`,
      {
        headers: setHeaders,
        data: {
          user_id: testUser.userId,
          title: articleTitle,
          body: articleBody,
          //missing date, image - all keys are required
        },
      }
    );

    expect(response.status()).toBe(422);
  });
  test("Returns 422 Unprocessable content after sending article JSON with too long value", async ({
    request,
  }) => {
    const exceedingLengthTitle: string = "a".repeat(10001);
    const response: APIResponse = await request.post(
      `${baseURL + articlesEndpoint}`,
      {
        headers: setHeaders,
        data: {
          user_id: testUser.userId,
          title: exceedingLengthTitle,
          body: articleBody,
          date: articleDate,
          image: articleImage,
        },
      }
    );

    expect(response.status()).toBe(422);
  });
  test("Returns 401 Unauthorized after sending article JSON with missing userId", async ({
    request,
  }) => {
    const response: APIResponse = await request.post(
      `${baseURL + articlesEndpoint}`,
      {
        headers: setHeaders,
        data: {
          title: articleTitle,
          body: articleBody,
        },
      }
    );

    expect(response.status()).toBe(401);
  });
});
