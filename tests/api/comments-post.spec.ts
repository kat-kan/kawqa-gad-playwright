import { testUsers } from "@_src_fixtures_api/auth";
import { createHeaders } from "@_src_helpers_api/create-token.helper";
import { test, APIResponse, expect } from "@playwright/test";

test.describe("POST comments tests", async () => {
  const comments: string = `/api/comments`;
  const commentBody: string =
    "What a wonderful article!";
  const commentDate: string = "2024-06-30T15:44:31Z";
  const article_id: number = 1;
  let setHeaders: any;
  let expectedStatusCode: number;

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
  });

  test("Returns 201- Created after creating comment", async ({ request }) => {  
    //Given
    expectedStatusCode = 201;
    //When 
    const response: APIResponse = await request.post(comments, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        article_id: article_id,
        body: commentBody,
        date: commentDate,
      },
    });
     const responseBody = JSON.parse(await response.text())
    //Then 
    expect(response.status()).toBe(expectedStatusCode);
    expect(responseBody.user_id).toBe(testUsers.regularUser.id);
    expect(responseBody.article_id).toBe(article_id);
    expect(responseBody.body).toBe(commentBody);
    expect(responseBody.date).toBe(commentDate);
    expect(responseBody.id).not.toBeNull;
  });

  test("Returns 400 - Bad request after sending comment with malformed JSON", async ({ request }) => {
    //Given 
    expectedStatusCode = 400;
    const malformedJson: string = `{
      user_id: testUsers.regularUser.id,
      article_id: "article_id,  
      body: commentBody,
      date: commentDate,
  }`;
    //When  
    const response: APIResponse = await request.post(comments, {
      headers: setHeaders,
      data: malformedJson,
    });
     //Then
    expect(response.status()).toBe(expectedStatusCode);
  });

  test("Returns 422- Invalid comment supplied after sending comment without body ", async ({ request }) => {   
     //Given 
     expectedStatusCode = 422;
    //When  
    const response: APIResponse = await request.post(comments, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        article_id: article_id,
        date: commentDate,
      },
    });
    //Then 
    expect(response.status()).toBe(expectedStatusCode);
  });
});
