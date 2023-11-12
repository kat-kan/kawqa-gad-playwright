import { test, expect } from "@playwright/test";

test.describe("GET/articles/{id} Find article by ID", () => {
  let baseURL = process.env.BASE_URL;

  test.skip("get list of articles", async ({ request }) => {
    const response = await request.get(`${baseURL}/api/articles`);
    console.log(await response.json());
  });

  test("return OK status code", async ({ request }) => {
    const statusCode = 200;
    const articleID = 3;
    const articleTitle = "What is agile software development?";
    const articleDate = "2021-07-25";

    const response = await request.get(`${baseURL}/api/articles/${articleID}`);
    const responseBody = await response.json();

    expect(response.status()).toBe(statusCode);

    const expectedData = {
      title: articleTitle,
      date: expect.stringMatching(articleDate),
    };

    expect(responseBody).toMatchObject(expectedData);
  });

  test("return 404 code", async ({ request }) => {
    const statusCode = 404;
    const articleID = -1;

    const response = await request.get(`${baseURL}/api/articles/${articleID}`);

    expect(response.status()).toBe(statusCode);
  });
});
