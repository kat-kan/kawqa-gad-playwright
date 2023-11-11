import { testUser } from "@_src_fixtures_api/auth";
import { createHeaders } from "@_src_helpers_api/create-token.helper";
import test, { expect } from "@playwright/test";

test.describe("POST articles tests", async () => {
  let baseURL: string = process.env.BASE_URL;
  let setHeaders: any;
  let articlesEndpoint: string = "/api/articles";

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
  });
  test("Returns 201 Created after creating article", async ({ request }) => {
    const response = await request.post(`${baseURL + articlesEndpoint}`, {
      headers: setHeaders,
      data: {
        user_id: testUser.userId,
        title: "newTitle",
        body: "newContent",
      },
    });

    expect(response.status()).toBe(201);
  });
  test("Returns 400 Bad Request after sending malformed JSON", async ({
    request,
  }) => {});
  test.only("Returns 422 Unprocessable content after sending invalid article data", async ({
    request,
  }) => {
    const response = await request.post(`${baseURL + articlesEndpoint}`, {
      headers: setHeaders,
      data: {
        user_id: testUser.userId
        //missing title, body, date, image
      },
    });

    expect(response.status()).toBe(422);
  });
});
