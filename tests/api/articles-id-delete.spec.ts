import { test, expect } from "@playwright/test";
import { createHeaders } from "@_src_helpers_api/create-token.helper";
import { testUser } from "@_src_fixtures_api/auth";

test.describe("DELETE/articles/{id} Deletes an article", () => {
  const baseURL: string = process.env.BASE_URL;
  const articlesEndpoint: string = "/api/articles";
  let setHeaders: any;

  const articleTitle: string = "New Article";
  const articleContent: string = "This is the content of the new article.";
  const articleDate: string = "2024-11-30T15:44:31Z";
  const articleImage: string = "image.jpg";

  test.beforeEach(async () => {
    setHeaders = await createHeaders();
  });

  test("create an article for delete", async ({ request }) => {
    const statusCode = 201;
    const response = await request.post(
      `${baseURL + articlesEndpoint}`,
      {
      headers: setHeaders,
      data: {
        user_id: testUser.userId,
        title: articleTitle,
        body: articleContent,
        date: articleDate,
        image: articleImage,
      },
    });

    expect(response.status()).toBe(statusCode);
  });

  test("delete article by ID 60", async ({ request }) => {
    const nonExistentArticleID = 60;
    const statusCode = 200;

    const response = await request.delete(
      `${baseURL + articlesEndpoint + nonExistentArticleID}`,
      {
        headers: setHeaders,
      }
    );

    expect(response.status()).toBe(statusCode);
  });

  test("delete a non-existent article", async ({ request }) => {
    const nonExistentArticleID = -1;
    const statusCode = 404;

    const response = await request.delete(
      `${baseURL + articlesEndpoint + nonExistentArticleID}`,
      {
        headers: setHeaders,
      }
    );

    expect(response.status()).toBe(statusCode);
  });
});
