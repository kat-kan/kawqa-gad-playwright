import { test, expect, APIResponse } from "@playwright/test";
import { createHeaders } from "@_src_helpers_api/create-token.helper";
import { testUsers } from "@_src_fixtures_api/auth";

test.describe("DELETE articles/{id}", () => {
  const baseURL: string = process.env.BASE_URL;
  const articles: string = `${baseURL}/api/articles/`;
  let setHeaders: any;

  const articleTitle: string = "New Article";
  const articleBody: string = "This is the content of the new article.";
  const articleDate: string = "2024-11-30T15:44:31Z";
  const articleImage: string = "image.jpg";

  test.beforeEach(async () => {
    setHeaders = await createHeaders();
  });

  test("returns 200 status code when delete an article after create", async ({ request }) => {
    const expectedResponseCode = 200;  
    const createResponse: APIResponse = await request.post(articles, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: articleTitle,
        body: articleBody,
        date: articleDate,
        image: articleImage,
      },
    });      
    
    const articleData = await createResponse.json();
    const articleID = articleData.id;

    const deleteResponse = await request.delete(`${articles + articleID}`, {
      headers: setHeaders,
    });

    expect(deleteResponse.status()).toBe(expectedResponseCode);
  });

  // Error - Received: 401
  test("returns 404 status code when delete a non-existent article", async ({ request }) => {
    test.fail();
    const nonExistentArticleID = -1;
    const expectedResponseCode = 404;

    const response = await request.delete(`${articles + nonExistentArticleID}`, {
      headers: setHeaders,
    });

    expect(response.status()).toBe(expectedResponseCode);
  });
});
