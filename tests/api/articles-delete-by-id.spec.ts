import { test, expect } from "@playwright/test";
import { createHeaders } from "../../src/helpers/api/create-token.helper";
import { testUser } from "../../src/fixtures/api/auth";

let baseURL = process.env.BASE_URL;
let setHeaders: any;

test.describe.only("Create and Delete an article", () => {
  let articleID;
  let articleTitle = "New Article";
  let articleContent = "This is the content of the new article.";
  let articleDate = "2024-11-30T15:44:31Z";
  let articleImage = "string";

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
  });

  test.afterEach("POST/articles - create an article", async ({ request }) => {
    const response = await request.post(`${baseURL}/api/articles`, {
      headers: setHeaders,
      data: {
        user_id: testUser.userId,
        title: articleTitle,
        body: articleContent,
        date: articleDate,
        image: articleImage,
      },
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    articleID = responseBody.id;
  });

  test.afterEach("DELETE/articles - delete an article by ID", async ({ request }) => {
      if (articleID) {
        const response = await request.delete(
          `${baseURL}/api/articles/${articleID}`,
          {
            headers: setHeaders,
          }
        );

        expect(response.status()).toBe(204);

        console.log(`Deleted article with ID: ${articleID}`);
      }
    }
  );
});
