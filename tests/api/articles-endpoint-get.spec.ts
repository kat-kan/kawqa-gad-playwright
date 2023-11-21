import { test, expect } from "@playwright/test";
import { createHeaders } from "@_src_helpers_api/create-token.helper";
import { testUser } from "@_src_fixtures_api/auth";

test.describe("GET articles/endpoint Verification of the correctness of the downloaded article data", async () => {
  // const baseURL: string = process.env.BASE_URL;
  const baseURL: string = "http://localhost:3000";
  const articlesEndpoint: string = "/api/articles/";
  let setHeaders: any;

  const expectedArticle = {
    id: 0,
    user_id: 0,
    title: "string",
    body: "string",
    date: "2024-06-30T15:44:31Z",
    image: "string",
  };

  test.beforeAll(async () => {
    // Given token is created
    setHeaders = await createHeaders();
  });

  test("download article by ID 1", async ({ request }) => {
    const existingArticleID = 1;
    const statusCode = 200;

    const response = await request.get(
      `${baseURL + articlesEndpoint + existingArticleID}`,
      {
        headers: setHeaders,
      }
    );
    expect(response.status()).toBe(statusCode);
  });

  test.only("download article by ID 1 dwa", async ({ request }) => {
    const existingArticleID = 1;
    const statusCode = 200;

    const expectedArticle = {
      id: 1,
      user_id: 4,
      //powinno byc
      title: "string",
      body: "string",
      date: "2020-04-12 02:17:51",
      image: "string",
    };

    const response = await request.get(
      `${baseURL + articlesEndpoint + existingArticleID}`,
      {
        headers: setHeaders,
      }
    );

    const articleData = await response.json();

    console.log("ten heeeeee");
    console.log(response);

    const responsetwo = await request.get(
      `http://localhost:3000/article.html?id=60`,
      {
        headers: setHeaders,
      }
    );
    const articleDatatwo = await response.json();
    console.log("ooooooooooooooo");
    console.log(responsetwo);
    // const responseBody = await setHeaders();
    // const firstArticle = responseBody[0];

    // console.log(firstArticle);

    // expect(response.status()).toBe(statusCode);
    // Sprawdź, czy odpowiedź zawiera oczekiwane pola
    // expect(firstArticle).toMatchObject(expectedArticle);
  });
});
