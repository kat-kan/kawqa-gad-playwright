import { testUsers } from "@_src_fixtures_api/auth";
import { createHeaders } from "@_src_helpers_api/create-token.helper";
import { test, APIResponse, expect } from "@playwright/test";

test.describe("POST articles tests", async () => {
  const baseURL: string = process.env.BASE_URL;
  const articles: string = `${baseURL}/api/articles`;
  const articleTitle: string =
    "Quick Error Handling Guide: What to Do When Coffee Leaks on Your Keyboard";
  const articleBody: string =
    "Ah, the joys of being a programmer - navigating through the intricate world of code with the constant companionship of our trusted caffeinated beverages. But what happens when that comforting cup of coffee turns against us, staging a daring escape onto our precious keyboards? Fear not, for we present to you the Quick Error Handling Guide for such a perilous situation.";
  const articleDate: string = "2024-06-30T15:44:31Z";
  const articleImage: string =
    "src\\test-data\\images\\Roasted_coffee_beans.jpg";
  let setHeaders: any;
  let expectedStatusCode: number;

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
  });

  test("Returns 201 Created after creating article", async ({ request }) => {
    expectedStatusCode = 201;
    const response: APIResponse = await request.post(articles, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: articleTitle,
        body: articleBody,
        date: articleDate,
        image: articleImage,
      },
    });
    const responseBody: any = await response.json();

    expect.soft(response.status()).toBe(expectedStatusCode);
    expect.soft(responseBody.user_id).toBe(testUsers.regularUser.id);
    expect.soft(responseBody.title).toBe(articleTitle);
    expect.soft(responseBody.body).toBe(articleBody);
    expect.soft(responseBody.date).toBe(articleDate);
    expect.soft(responseBody.image).toBe(articleImage);
    expect.soft(responseBody.id).not.toBeNull;
  });

  test("Returns 400 Bad Request after sending malformed JSON", async ({
    request,
  }) => {
    expectedStatusCode = 400;
    const malformedJson: string = `{
        "user_id": "${testUsers.regularUser.id}",
        "title: ${articleTitle},  // error: missing closing quotation mark
        "body": "${articleBody}",
        "date": "${articleDate}",
        "image": "${articleImage}"
    }`;
    const response: APIResponse = await request.post(articles, {
      headers: setHeaders,
      data: malformedJson,
    });

    expect(response.status()).toBe(expectedStatusCode);
  });

  test("Returns 422 Unprocessable content after sending article with missing required information", async ({
    request,
  }) => {
    expectedStatusCode = 422;
    const response: APIResponse = await request.post(articles, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: articleTitle,
        body: articleBody,
        //missing date, image - all keys are required
      },
    });

    expect(response.status()).toBe(expectedStatusCode);
  });

  test("Returns 422 Unprocessable content after sending article JSON with too long value", async ({
    request,
  }) => {
    expectedStatusCode = 422;
    const exceedingLengthTitle: string = "a".repeat(10001);
    const response: APIResponse = await request.post(articles, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: exceedingLengthTitle,
        body: articleBody,
        date: articleDate,
        image: articleImage,
      },
    });

    expect(response.status()).toBe(expectedStatusCode);
  });

  test("Returns 401 Unauthorized after sending article JSON with missing userId", async ({
    request,
  }) => {
    expectedStatusCode = 401;
    const response: APIResponse = await request.post(articles, {
      headers: setHeaders,
      data: {
        title: articleTitle,
        body: articleBody,
      },
    });

    expect(response.status()).toBe(expectedStatusCode);
  });
});
