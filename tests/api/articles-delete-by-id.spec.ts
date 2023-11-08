import { test, expect } from "@playwright/test";
import { createHeaders } from "../../src/helpers/api/create-token.helper";

let baseURL = process.env.BASE_URL;
let articleID;
let setHeaders: any;

test.describe("Create and Delete an article", () => {
  let articleTitle = "New Article";
  let articleContent = "This is the content of the new article.";

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
  });

  test("POST/articles - create an article", async ({ request }) => {
    const response = await request.post(`${baseURL}/api/articles`, {
      headers: setHeaders,
      data: {
        title: articleTitle,
        body: articleContent,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    articleID = responseBody.id;
  });

  test("DELETE/articles - delete an article by ID", async ({ request }) => {
    expect(articleID).toBeDefined();

    const response = await request.delete(
      `${baseURL}/api/articles/${articleID}`,
      {
        headers: setHeaders,
      }
    );

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(204);

    console.log(`Deleted article with ID: ${articleID}`);
  });
});
