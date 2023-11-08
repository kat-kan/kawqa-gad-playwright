import { test, expect } from "@playwright/test";

let baseURL = process.env.BASE_URL;
let articleID = 3;
let articleTitle = "What is agile software development?";
let articleDate = "2021-07-25";

test.only("GET/articles/ return OK status code by ID", async ({ request }) => {
  const response = await request.get(`${baseURL}/api/articles/${articleID}`);
  const responseBody = await response.json();

  expect(response.status()).toBe(200);

  const expectedData = {
    title: articleTitle,
    date: expect.stringMatching(articleDate),
  };

  expect(responseBody).toMatchObject(expectedData);

  console.log(await response.json());
});
